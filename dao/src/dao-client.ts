import { Transaction, TransactionObjectInput, TransactionResult } from "@mysten/sui/transactions";
import {
	Intent, OwnedData, AccountPreview, Currencies, Kiosks, Vaults, Packages, Caps, Dep,
	ActionsArgs, Invite, Profile, ActionsIntentTypes, Policy,
} from "@account.tech/core";
import {
	BorrowCapIntent,
	UpdateMetadataIntent, DisableRulesIntent, MintAndTransferIntent, MintAndVestIntent, WithdrawAndBurnIntent,
	TakeNftsIntent, ListNftsIntent,
	UpgradePackageIntent, RestrictPolicyIntent,
	WithdrawAndTransferToVaultIntent, WithdrawAndTransferIntent, WithdrawAndVestIntent,
	SpendAndTransferIntent, SpendAndVestIntent,
	ConfigDepsIntent, ToggleUnverifiedAllowedIntent,
} from "@account.tech/core/dist/lib/intents";
import { MOVE_STDLIB, SUI_FRAMEWORK, TRANSFER_POLICY_RULES, ACCOUNT_PROTOCOL, ACCOUNT_ACTIONS, TransactionPureInput } from "@account.tech/core/dist/types";
import * as commands from "@account.tech/core/dist/lib/commands";
import { AccountSDK } from "@account.tech/core/dist/sdk";

import { DAO_GENERICS, DAO_CONFIG_TYPE } from "./lib/constants"; 
import { Dao } from "./lib/account";
import { Votes } from "./lib/outcome";
import { ConfigDaoIntent } from "./lib/intents";
import { DaoData, DepStatus, IntentStatus, VoteIntentArgs } from "./lib/types";

export class DaoClient extends AccountSDK {

	get dao(): Dao {
		return this.account as Dao;
	}

	static async init(
		network: "mainnet" | "testnet" | "devnet" | "localnet" | string,
		userAddr: string,
		daoId?: string,
	): Promise<DaoClient> {
		const daoClient = await super.init(
			network,
			userAddr,
			daoId,
			{
				accountType: Dao,
				ownedObjects: true,
				assetFactory: [Caps, Currencies, Kiosks, Packages, Vaults],
				intentFactory: [
					BorrowCapIntent,
					UpdateMetadataIntent, DisableRulesIntent, MintAndTransferIntent, MintAndVestIntent, WithdrawAndBurnIntent,
					TakeNftsIntent, ListNftsIntent,
					UpgradePackageIntent, RestrictPolicyIntent,
					WithdrawAndTransferToVaultIntent, WithdrawAndTransferIntent, WithdrawAndVestIntent,
					SpendAndTransferIntent, SpendAndVestIntent,
					ConfigDepsIntent, ToggleUnverifiedAllowedIntent,
					ConfigDaoIntent,
				],
				outcomeFactory: [Votes],
			}
		);
		return daoClient as DaoClient;
	}

	async refresh() {
		await super.refresh();
	}

	async switchDao(daoId: string) {
		await this.account.refresh(daoId);
	}

	/// Creates a dao
	createDao(
		tx: Transaction,
		// mandatory params
		assetType: string,
		authVotingPower: bigint,
		unstakingCooldown: bigint,
		votingRule: number,
		maxVotingPower: bigint,
		minimumVotes: bigint,
		votingQuorum: bigint,
		// social params
		name: string,
		description: string,
		image: string,
		twitter: string,
		telegram: string,
		discord: string,
		github: string,
		website: string,
		// user params
		newUser?: { username: string, profilePicture: string },
	): TransactionResult {
		// create the user if the user doesn't have one
		let userId: TransactionPureInput = this.user.id;
		let createdUser: TransactionPureInput | null = null;
		if (userId === "") {
			if (!newUser) throw new Error("User must create an user before creating a multisig");
			createdUser = this.user.createUser(tx); // TODO: add optional params for username and avatar 
			userId = tx.moveCall({
				target: `${SUI_FRAMEWORK}::object::id`,
				typeArguments: [`${ACCOUNT_PROTOCOL.V1}::user::User`],
				arguments: [tx.object(createdUser)],
			});
		}
		// create the dao
		// const fee = tx.splitCoins(tx.gas, [this.dao.fees]); // TODO: add fees
		const dao = this.dao.newDao(tx, assetType, authVotingPower, unstakingCooldown, votingRule, maxVotingPower, minimumVotes, votingQuorum);
		// add name
		const daoWithMetadata = this.dao.addMetadata(tx, dao, name, description, image, twitter, telegram, discord, github, website);
		// creator register the dao in his user
		this.dao.joinDao(tx, createdUser ? createdUser : userId, daoWithMetadata);
		// transfer the user if just created
		if (createdUser) this.user.transferUser(tx, createdUser, this.user.address!);
		// share the dao
		return this.dao.shareDao(tx, daoWithMetadata);
	}

	/// Factory function to call the appropriate request function
	request(
		tx: Transaction,
		intentType: string, // TypeName of the intent
		intentArgs: VoteIntentArgs,
		actionsArgs: ActionsArgs,
	) {
		const auth = this.dao.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.dao.emptyVotesOutcome(tx, intentArgs.startTime, intentArgs.endTime);

		const intentClass = this.config.intentFactory.find(intent => intent.type === intentType);
		if (!intentClass) throw new Error("Intent not found");
		const method = intentClass.prototype.request;
		method.call(intentClass, tx, DAO_GENERICS, auth, this.dao.id, params, outcome, actionsArgs);
	}

	/// Calls the execute function for the intent, approve if not already done
	execute(
		tx: Transaction,
		caller: string,
		intentKey: string
	): TransactionResult {
		const intent = this.intents?.intents[intentKey];
		if (!intent) throw new Error("Intent not found");
		// not optimal, but we need to get the object types to execute the intent
		// @ts-ignore: Property 'type' exists on the constructor for Intent subclasses
		if (intent.constructor.type === ActionsIntentTypes.WithdrawAndTransfer) {
			(intent as WithdrawAndTransferIntent).initTypeById(this.ownedObjects!);
		}
		// @ts-ignore: Property 'type' exists on the constructor for Intent subclasses
		if (intent.constructor.type === ActionsIntentTypes.WithdrawAndVest) {
			(intent as WithdrawAndVestIntent).initTypeById(this.ownedObjects!);
		}

		const executable = this.dao.executeVotesIntent(tx, intentKey);

		let result = intent.execute(tx, DAO_GENERICS, executable);
		intent.completeExecution(tx, DAO_GENERICS, executable);
		// if no more executions scheduled after this one, destroy intent
		if (intent.fields.executionTimes.length == 1) {
			result = intent.clearEmpty(tx, DAO_GENERICS, intentKey);
		}
		return result;
	}

	/// Deletes a intent if it has expired
	delete(
		tx: Transaction,
		intentKey: string,
	) {
		const intent = this.intents?.intents[intentKey];
		if (!intent) throw new Error("Intent not found");
		if (!intent.hasExpired()) throw new Error("Intent has not expired");

		intent.deleteExpired(tx, DAO_GENERICS, intentKey);
	}

	reorderDaos(tx: Transaction, daoAddrs: string[]) {
		return this.user.reorderAccounts(tx, this.user.id, DAO_CONFIG_TYPE, daoAddrs);
	}

	// === Getters ===

	/// Returns the latest deps from the extensions
	getLatestExtensions(): Dep[] {
		return this.extensions.getLatestDeps();
	}

	getUserProfile(): Profile {
		return this.user.profile;
	}

	getUserMultisigs(): AccountPreview[] {
		return this.user.accounts;
	}

	getUserInvites(): Invite[] {
		return this.user.invites;
	}

	getDaoName(): string {
		return this.dao.getName();
	}

	getDaoDeps(): Dep[] {
		return this.dao.deps;
	}

	/// Returns deps that are in Multisig and in Extensions
	getVerifiedDeps(): Dep[] {
		const currentDeps = this.getDaoDeps();
		const latestDeps = this.getLatestExtensions();

		return currentDeps.filter(dep => latestDeps.some(latestDep => latestDep.name === dep.name));
	}

	/// Returns deps that are in Multisig but not in Extensions
	getUnverifiedDeps(): Dep[] {
		const currentDeps = this.getDaoDeps();
		const latestDeps = this.getLatestExtensions();

		return currentDeps.filter(dep => !latestDeps.some(latestDep => latestDep.name === dep.name));
	}

	/// Returns the status of verified deps, with the latest version available
	getDepsStatus(): DepStatus[] {
		const currentDeps = this.getVerifiedDeps();
		const latestDeps = this.getLatestExtensions();

		return currentDeps.map(dep => {
			const latestDep = latestDeps.find(latestDep => latestDep.name === dep.name);
			return {
				name: dep.name,
				currentAddr: dep.addr,
				currentVersion: dep.version,
				latestAddr: latestDep!.addr,
				latestVersion: latestDep!.version,
			};
		});
	}

	getDaoConfig(): Pick<DaoData, "assetType" | "authVotingPower" | "unstakingCooldown" | "votingRule" | "maxVotingPower" | "minimumVotes" | "votingQuorum"> {
		return {
			assetType: this.dao.assetType,
			authVotingPower: this.dao.authVotingPower,
			unstakingCooldown: this.dao.unstakingCooldown,
			votingRule: this.dao.votingRule,
			maxVotingPower: this.dao.maxVotingPower,
			minimumVotes: this.dao.minimumVotes,
			votingQuorum: this.dao.votingQuorum,
		};
	}

	getIntent(key: string): Intent {
		const intent = this.intents?.intents[key];
		console.log(intent);
		if (!intent) throw new Error("Intent not found");
		return intent;
	}

	getIntentStatus(key: string): IntentStatus {
		const now = Date.now();
		const intent = this.getIntent(key);
		const outcome = intent.outcome as Votes;

		let [stage, deletable] = ['pending', false];

		// Check expiration first
		if (now >= intent.fields.expirationTime) {
			deletable = true;
		}

		if (now > outcome.startTime) {
			stage = 'open';
		}
		if (now > outcome.endTime) {
			stage = 'closed';
		}

		// Check if intent has reached quorum
		if (
			stage === 'closed' &&
			outcome.results["yes"] + outcome.results["no"] >= this.dao.minimumVotes &&
			(outcome.results["yes"] * 1_000_000_000n / (outcome.results["yes"] + outcome.results["no"])) >= this.dao.votingQuorum
		) {
			stage = 'executable';
		}

		return {
			stage: stage as 'pending' | 'open' | 'closed' | 'executable',
			deletable,
		};
	}

	// canApproveIntent(key: string): boolean {
	// 	const outcome = this.getIntent(key).outcome as Approvals;
	// 	return outcome.approved.includes(this.user.address!);
	// }

	/// Returns true if the intent can be executed after potential approval
	// canExecuteIntent(key: string): boolean {
	// 	const intent = this.multisig.intent(key);
	// 	const outcome = intent?.outcome as Approvals;
	// 	const member = this.multisig.member(this.user.address!);

	// 	switch (this.multisig.intentStatus(key)) {
	// 		case IntentStatus.Executable:
	// 			return true;
	// 		case IntentStatus.Pending:
	// 			const hasRole = member.roles.includes(intent.fields.role);

	// 			const thresholdReachedAfterApproval =
	// 				(outcome.totalWeight + member.weight) >= this.multisig.global.threshold ||
	// 				(hasRole ? outcome.roleWeight + member.weight : outcome.roleWeight) >= this.multisig.roles[intent.fields.role].threshold;
	// 			const executionTimeReached = intent!.fields.executionTimes[0] <= Date.now();

	// 			return thresholdReachedAfterApproval && executionTimeReached;
	// 		default:
	// 			return false;
	// 	}
	// }

	getManagedAssets(): Record<string, any> {
		return this.managedAssets?.assets ?? {};
	}

	getOwnedObjects(): OwnedData {
		return this.ownedObjects?.getData() ?? {} as OwnedData;
	}

	getCaps(): Caps {
		return this.managedAssets?.assets?.["caps"] as Caps;
	}

	getCurrencies(): Currencies {
		return this.managedAssets?.assets?.["currencies"] as Currencies;
	}

	getKiosks(): Kiosks {
		return this.managedAssets?.assets?.["kiosks"] as Kiosks;
	}

	getPackages(): Packages {
		return this.managedAssets?.assets?.["packages"] as Packages;
	}

	getVaults(): Vaults {
		return this.managedAssets?.assets?.["vaults"] as Vaults;
	}

	// === Commands ===

	/// Automatically merges and splits coins, then returns the ids of the newly created coins to be used in an intent
	mergeAndSplit(
		tx: Transaction,
		coinType: string,
		toSplit: bigint[], // amounts
	): TransactionResult {
		const coins = this.ownedObjects?.getCoin(coinType);
		const availableInstances = coins?.instances.filter(instance => !this.dao.lockedObjects.includes(instance.ref.objectId));
		if (!availableInstances || availableInstances.reduce((acc, curr) => acc + curr.amount, 0n) < toSplit.reduce((acc, curr) => acc + curr, 0n)) {
			throw new Error("Not enough coins");
		}

		const auth = this.dao.authenticate(tx);
		return commands.mergeAndSplit(tx, DAO_CONFIG_TYPE, coinType, auth, this.dao.id, availableInstances.map(instance => instance.ref).slice(0, 500), toSplit);
	}

	/// Deposits and locks a Cap object in the Account
	depositCap(
		tx: Transaction,
		capType: string,
		capObject: TransactionObjectInput,
	): TransactionResult {
		const auth = this.dao.authenticate(tx);
		return commands.depositCap(tx, DAO_CONFIG_TYPE, capType, auth, this.dao.id, capObject);
	}

	/// Modifies the name of the Account
	modifyName(
		tx: Transaction,
		newName: string,
	): TransactionResult {
		const auth = this.dao.authenticate(tx);
		return commands.replaceMetadata(tx, DAO_CONFIG_TYPE, auth, this.dao.id, ["name"], [newName]);
	}

	/// Updates the verified deps to the latest version
	updateVerifiedDeps(
		tx: Transaction,
	): TransactionResult {
		const auth = this.dao.authenticate(tx);
		return commands.updateVerifiedDepsToLatest(tx, DAO_CONFIG_TYPE, auth, this.dao.id);
	}

	/// Deposits and locks a TreasuryCap object in the Account
	depositTreasuryCap(
		tx: Transaction,
		coinType: string,
		treasuryCap: TransactionObjectInput,
	): TransactionResult {
		const auth = this.dao.authenticate(tx);
		return commands.depositTreasuryCap(tx, DAO_CONFIG_TYPE, coinType, auth, this.dao.id, treasuryCap);
	}

	/// Opens a Kiosk in the Account
	openKiosk(
		tx: Transaction,
		kioskName: string,
	): TransactionResult {
		const auth = this.dao.authenticate(tx);
		return commands.openKiosk(tx, DAO_CONFIG_TYPE, auth, this.dao.id, kioskName);
	}

	/// Places an NFT in a Kiosk managed by the Account
	async placeInKiosk(
		tx: Transaction,
		nftType: string,
		senderKiosk: TransactionObjectInput,
		senderCap: TransactionObjectInput,
		kioskName: string,
		nftId: string,
	): Promise<TransactionResult> {
		const policies = await this.getKiosks().kioskClient.getTransferPolicies({ type: nftType });
		// find a correct policy
		let policyId = "";
		if (policies?.length == 0) {
			throw new Error("No transfer policy found for the given NFT type");
		} else if (policies?.length == 1) {
			policyId = policies[0].id;
		} else {
			// Find first policy that only contains known rules
			const validPolicy = policies!.find(policy =>
				policy.rules.every(rule => TRANSFER_POLICY_RULES.includes(rule))
			);
			if (!validPolicy) throw new Error("No transfer policy found with only known rules");
			policyId = validPolicy.id;
		}

		// get the account kiosk from its name 
		const accountKioskId = this.getKiosks().assets[kioskName].id;
		if (!accountKioskId) throw new Error("Kiosk not found");
		const auth = this.dao.authenticate(tx);
		const request = commands.placeInKiosk(tx, DAO_CONFIG_TYPE, nftType, auth, this.dao.id, accountKioskId, senderKiosk, senderCap, policyId, kioskName, nftId);
		return tx.moveCall({
			target: `${SUI_FRAMEWORK}::transfer_policy::confirm_request`,
			typeArguments: [nftType],
			arguments: [tx.object(policyId), request],
		});
	}

	/// Delists an NFT from a Kiosk managed by the Account
	delistFromKiosk(
		tx: Transaction,
		kioskName: string,
		nftId: string,
	): TransactionResult {
		// get the account kiosk from its name 
		const accountKioskId = this.getKiosks().assets[kioskName].id;
		if (!accountKioskId) throw new Error("Kiosk not found");
		// get the nft type from the nft id
		const nftType = this.getKiosks().assets[kioskName].items.find(item => item.id === nftId)?.type;
		if (!nftType) throw new Error("NFT not found in kiosk");
		const auth = this.dao.authenticate(tx);
		return commands.delistFromKiosk(tx, DAO_CONFIG_TYPE, nftType, auth, this.dao.id, accountKioskId, kioskName, nftId);
	}

	/// Withdraws the profits from a Kiosk managed by the Account
	withdrawProfitsFromKiosk(
		tx: Transaction,
		kioskName: string,
	): TransactionResult {
		// get the account kiosk from its name 
		const accountKioskId = this.getKiosks().assets[kioskName].id;
		if (!accountKioskId) throw new Error("Kiosk not found");
		const auth = this.dao.authenticate(tx);
		return commands.withdrawProfitsFromKiosk(tx, DAO_CONFIG_TYPE, auth, this.dao.id, accountKioskId, kioskName);
	}

	/// Closes an empty Kiosk managed by the Account
	closeKiosk(
		tx: Transaction,
		kioskName: string,
	): TransactionResult {
		// get the account kiosk from its name 
		const accountKioskId = this.getKiosks().assets[kioskName].id;
		if (!accountKioskId) throw new Error("Kiosk not found");
		const auth = this.dao.authenticate(tx);
		return commands.closeKiosk(tx, DAO_CONFIG_TYPE, auth, this.dao.id, accountKioskId, kioskName);
	}

	/// Deposits and locks an UpgradeCap object in the Account
	depositUpgradeCap(
		tx: Transaction,
		packageName: string,
		upgradeCap: TransactionObjectInput,
		timeLockDelayMs: bigint,
	): TransactionResult {
		const auth = this.dao.authenticate(tx);
		return commands.depositUpgradeCap(tx, DAO_CONFIG_TYPE, auth, this.dao.id, upgradeCap, packageName, timeLockDelayMs);
	}

	/// Opens a Treasury in the Account
	openVault(
		tx: Transaction,
		treasuryName: string,
	): TransactionResult {
		const auth = this.dao.authenticate(tx);
		return commands.openVault(tx, DAO_CONFIG_TYPE, auth, this.dao.id, treasuryName);
	}

	/// Deposits an object into the Treasury from the caller wallet
	depositFromWallet(
		tx: Transaction,
		coinType: string,
		treasuryName: string,
		coin: TransactionObjectInput,
	): TransactionResult {
		const auth = this.dao.authenticate(tx);
		return commands.depositFromWallet(tx, DAO_CONFIG_TYPE, coinType, auth, this.dao.id, treasuryName, coin);
	}

	/// Closes an empty Treasury managed by the Account
	closeVault(
		tx: Transaction,
		treasuryName: string,
	): TransactionResult {
		const auth = this.dao.authenticate(tx);
		return commands.closeVault(tx, DAO_CONFIG_TYPE, auth, this.dao.id, treasuryName);
	}

	// === Intents ===

	requestConfigDao(
		tx: Transaction,
		intentArgs: VoteIntentArgs,
		assetType: string,
		authVotingPower: bigint,
		unstakingCooldown: bigint,
		votingRule: number,
		maxVotingPower: bigint,
		minimumVotes: bigint,
		votingQuorum: bigint,
	) {
		const auth = this.dao.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.dao.emptyVotesOutcome(tx, intentArgs.startTime, intentArgs.endTime);

		ConfigDaoIntent.prototype.request(
			tx,
			DAO_GENERICS,
			auth,
			this.dao.id,
			params,
			outcome,
			{ assetType, authVotingPower, unstakingCooldown, votingRule, maxVotingPower, minimumVotes, votingQuorum },
		);
	}

	requestConfigDeps(
		tx: Transaction,
		intentArgs: VoteIntentArgs,
		deps: Dep[],
	) {
		const auth = this.dao.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.dao.emptyVotesOutcome(tx, intentArgs.startTime, intentArgs.endTime);

		ConfigDepsIntent.prototype.request(
			tx,
			DAO_GENERICS,
			auth,
			this.dao.id,
			params,
			outcome,
			{ deps },
		);
	}

	requestToggleUnverifiedDepsAllowed(
		tx: Transaction,
		intentArgs: VoteIntentArgs,
	) {
		const auth = this.dao.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.dao.emptyVotesOutcome(tx, intentArgs.startTime, intentArgs.endTime);

		ToggleUnverifiedAllowedIntent.prototype.request(
			tx,
			DAO_GENERICS,
			auth,
			this.dao.id,
			params,
			outcome,
			{}
		);
	}

	requestBorrowCap(
		tx: Transaction,
		intentArgs: VoteIntentArgs,
		capType: string,
	) {
		const auth = this.dao.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.dao.emptyVotesOutcome(tx, intentArgs.startTime, intentArgs.endTime);

		BorrowCapIntent.prototype.request(
			tx,
			DAO_GENERICS,
			auth,
			this.dao.id,
			params,
			outcome,
			{ capType },
		);
	}

	requestDisableRules(
		tx: Transaction,
		intentArgs: VoteIntentArgs,
		coinType: string,
		mint: boolean,
		burn: boolean,
		updateSymbol: boolean,
		updateName: boolean,
		updateDescription: boolean,
		updateIcon: boolean,
	) {
		const auth = this.dao.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.dao.emptyVotesOutcome(tx, intentArgs.startTime, intentArgs.endTime);

		DisableRulesIntent.prototype.request(
			tx,
			DAO_GENERICS,
			auth,
			this.dao.id,
			params,
			outcome,
			{ coinType, mint, burn, updateSymbol, updateName, updateDescription, updateIcon },
		);
	}

	requestUpdateMetadata(
		tx: Transaction,
		intentArgs: VoteIntentArgs,
		coinType: string,
		newName: string | null,
		newSymbol: string | null,
		newDescription: string | null,
		newIconUrl: string | null,
	) {
		const auth = this.dao.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.dao.emptyVotesOutcome(tx, intentArgs.startTime, intentArgs.endTime);

		UpdateMetadataIntent.prototype.request(
			tx,
			DAO_GENERICS,
			auth,
			this.dao.id,
			params,
			outcome,
			{ coinType, newName, newSymbol, newDescription, newIconUrl },
		);
	}

	requestMintAndTransfer(
		tx: Transaction,
		intentArgs: VoteIntentArgs,
		coinType: string,
		transfers: { amount: bigint, recipient: string }[],
	) {
		const auth = this.dao.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.dao.emptyVotesOutcome(tx, intentArgs.startTime, intentArgs.endTime);

		MintAndTransferIntent.prototype.request(
			tx,
			DAO_GENERICS,
			auth,
			this.dao.id,
			params,
			outcome,
			{ coinType, transfers },
		);
	}

	requestMintAndVest(
		tx: Transaction,
		intentArgs: VoteIntentArgs,
		coinType: string,
		amount: bigint,
		start: bigint,
		end: bigint,
		recipient: string,
	) {
		const auth = this.dao.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.dao.emptyVotesOutcome(tx, intentArgs.startTime, intentArgs.endTime);

		MintAndVestIntent.prototype.request(
			tx,
			DAO_GENERICS,
			auth,
			this.dao.id,
			params,
			outcome,
			{ coinType, amount, start, end, recipient },
		);
	}

	requestWithdrawAndBurn(
		tx: Transaction,
		intentArgs: VoteIntentArgs,
		coinType: string,
		amount: bigint,
	) {
		const auth = this.dao.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.dao.emptyVotesOutcome(tx, intentArgs.startTime, intentArgs.endTime);

		const coinId = this.mergeAndSplit(tx, coinType, [amount]);

		WithdrawAndBurnIntent.prototype.request(
			tx,
			DAO_GENERICS,
			auth,
			this.dao.id,
			params,
			outcome,
			{ coinType, coinId, amount },
		);
	}

	requestTakeNfts(
		tx: Transaction,
		intentArgs: VoteIntentArgs,
		kioskName: string,
		nftIds: string[],
		recipient: string,
	) {
		const auth = this.dao.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.dao.emptyVotesOutcome(tx, intentArgs.startTime, intentArgs.endTime);

		TakeNftsIntent.prototype.request(
			tx,
			DAO_GENERICS,
			auth,
			this.dao.id,
			params,
			outcome,
			{ kioskName, nftIds, recipient },
		);
	}

	requestListNfts(
		tx: Transaction,
		intentArgs: VoteIntentArgs,
		kioskName: string,
		listings: { nftId: string, price: bigint }[],
	) {
		const auth = this.dao.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.dao.emptyVotesOutcome(tx, intentArgs.startTime, intentArgs.endTime);

		ListNftsIntent.prototype.request(
			tx,
			DAO_GENERICS,
			auth,
			this.dao.id,
			params,
			outcome,
			{ kioskName, listings },
		);
	}

	requestWithdrawAndTransferToVault(
		tx: Transaction,
		intentArgs: VoteIntentArgs,
		coinType: string,
		coinAmount: bigint,
		vaultName: string,
	) {
		const auth = this.dao.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.dao.emptyVotesOutcome(tx, intentArgs.startTime, intentArgs.endTime);

		const coinIds = this.mergeAndSplit(tx, coinType, [coinAmount]);
		const coinId = tx.moveCall({
			target: `${MOVE_STDLIB}::vector::swap_remove`,
			typeArguments: [`${SUI_FRAMEWORK}::object::ID`],
			arguments: [coinIds, tx.pure.u64(0)],
		});

		WithdrawAndTransferToVaultIntent.prototype.request(
			tx,
			DAO_GENERICS,
			auth,
			this.dao.id,
			params,
			outcome,
			{ coinType, coinId, coinAmount, vaultName },
		);
	}

	requestWithdrawAndTransfer(
		tx: Transaction,
		intentArgs: VoteIntentArgs,
		coins: { coinType: string, coinAmount: bigint }[],
		objectIds: string[],
		recipient: string,
	) {
		const auth = this.dao.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.dao.emptyVotesOutcome(tx, intentArgs.startTime, intentArgs.endTime);

		let transfers = objectIds.map(objectId => ({ objectId: tx.pure.id(objectId) as TransactionPureInput, recipient }));

		coins.forEach(coin => {
			const ids = this.mergeAndSplit(tx, coin.coinType, [coin.coinAmount]);
			const objectId = tx.moveCall({
				target: `${MOVE_STDLIB}::vector::swap_remove`,
				typeArguments: [`${SUI_FRAMEWORK}::object::ID`],
				arguments: [ids, tx.pure.u64(0)],
			});
			transfers.push({ objectId, recipient });
		});
		
		WithdrawAndTransferIntent.prototype.request(
			tx,
			DAO_GENERICS,
			auth,
			this.dao.id,
			params,
			outcome,
			{ transfers },
		);
	}

	// optimized version of withdrawAndTransfer for airdropping objects with same type to multiple recipients
	requestWithdrawAndAirdropObjects(
		tx: Transaction,
		intentArgs: VoteIntentArgs,
		drops: {objectId: string, recipient: string}[],
	) {
		const auth = this.dao.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.dao.emptyVotesOutcome(tx, intentArgs.startTime, intentArgs.endTime);

		WithdrawAndTransferIntent.prototype.request(
			tx,
			DAO_GENERICS,
			auth,
			this.dao.id,
			params,
			outcome,
			{ transfers: drops },
		);
	}

	// optimized version of withdrawAndTransfer for airdropping coins to multiple recipients
	requestWithdrawAndAirdropCoins(
		tx: Transaction,
		intentArgs: VoteIntentArgs,
		coinType: string,
		drops: {recipient: string, amount: bigint}[],
	) {
		const auth = this.dao.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.dao.emptyVotesOutcome(tx, intentArgs.startTime, intentArgs.endTime);

		const coinIds = this.mergeAndSplit(tx, coinType, drops.map(drop => drop.amount));
		const recipients = drops.map(drop => drop.recipient);
		
		tx.moveCall({
			target: `${ACCOUNT_ACTIONS.V1}::owned_intents::request_withdraw_and_transfer`,
			typeArguments: DAO_GENERICS,
			arguments: [
				auth,
				tx.object(this.dao.id),
				params,
				outcome,
				coinIds,
				tx.pure.vector("address", recipients),
			],
		});
	}

	requestWithdrawAndVest(
		tx: Transaction,
		intentArgs: VoteIntentArgs,
		coinType: string,
		coinAmount: bigint,
		start: bigint,
		end: bigint,
		recipient: string,
	) {
		const auth = this.dao.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.dao.emptyVotesOutcome(tx, intentArgs.startTime, intentArgs.endTime);

		const coinIds = this.mergeAndSplit(tx, coinType, [coinAmount]); 
		const coinId = tx.moveCall({
			target: `${MOVE_STDLIB}::vector::swap_remove`,
			typeArguments: [`${SUI_FRAMEWORK}::object::ID`],
			arguments: [coinIds, tx.pure.u64(0)],
		});

		WithdrawAndVestIntent.prototype.request(
			tx,
			DAO_GENERICS,
			auth,
			this.dao.id,
			params,
			outcome,
			{ coinId, start, end, recipient },
		);
	}

	requestUpgradePackage(
		tx: Transaction,
		intentArgs: VoteIntentArgs,
		packageName: string,
		digest: number[],
	) {
		const auth = this.dao.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.dao.emptyVotesOutcome(tx, intentArgs.startTime, intentArgs.endTime);

		UpgradePackageIntent.prototype.request(
			tx,
			DAO_GENERICS,
			auth,
			this.dao.id,
			params,
			outcome,
			{ packageName, digest },
		);
	}

	requestRestrictPolicy(
		tx: Transaction,
		intentArgs: VoteIntentArgs,
		packageName: string,
		policy: typeof Policy[keyof typeof Policy],
	) {
		const auth = this.dao.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.dao.emptyVotesOutcome(tx, intentArgs.startTime, intentArgs.endTime);

		RestrictPolicyIntent.prototype.request(
			tx,
			DAO_GENERICS,
			auth,
			this.dao.id,
			params,
			outcome,
			{ packageName, policy },
		);
	}

	requestSpendAndTransfer(
		tx: Transaction,
		intentArgs: VoteIntentArgs,
		treasuryName: string,
		coinType: string,
		transfers: { amount: bigint, recipient: string }[],
	) {
		const auth = this.dao.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.dao.emptyVotesOutcome(tx, intentArgs.startTime, intentArgs.endTime);

		SpendAndTransferIntent.prototype.request(
			tx,
			DAO_GENERICS,
			auth,
			this.dao.id,
			params,
			outcome,
			{ treasuryName, coinType, transfers },
		);
	}

	requestSpendAndVest(
		tx: Transaction,
		intentArgs: VoteIntentArgs,
		treasuryName: string,
		coinType: string,
		amount: bigint,
		start: bigint,
		end: bigint,
		recipient: string,
	) {
		const auth = this.dao.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.dao.emptyVotesOutcome(tx, intentArgs.startTime, intentArgs.endTime);

		SpendAndVestIntent.prototype.request(
			tx,
			DAO_GENERICS,
			auth,
			this.dao.id,
			params,
			outcome,
			{ treasuryName, coinType, amount, start, end, recipient },
		);
	}

	/// === Custom executors ===

	executeBorrowCap(
		tx: Transaction,
		caller: string,
		intentKey: string,
		useCap: (cap: TransactionObjectInput) => void,
	): TransactionResult {
		const intent = this.getIntent(intentKey) as BorrowCapIntent;

		// borrow the cap
		const executable = this.dao.executeVotesIntent(tx, intentKey);
		let cap = intent.execute(tx, DAO_GENERICS, executable);

		useCap(cap); // use the cap in your code here

		// return the cap
		intent.return(tx, DAO_GENERICS, executable, cap);
		let result = intent.completeExecution(tx, DAO_GENERICS, executable);
		// if no more executions scheduled after this one, destroy intent
		if (intent.fields.executionTimes.length == 1) {
			result = intent.clearEmpty(tx, DAO_GENERICS, intentKey);
		}
		return result;
	}

	executeUpgradePackage(
		tx: Transaction,
		caller: string,
		intentKey: string,
		packageId: string,
		modules: string[],
		dependencies: string[],
	): TransactionResult {
		const intent = this.getIntent(intentKey) as UpgradePackageIntent;

		// borrow the cap
		const executable = this.dao.executeVotesIntent(tx, intentKey);
		let ticket = intent.execute(tx, DAO_GENERICS, executable);

		// upgrade the package
		const receipt = tx.upgrade({
			modules,
			dependencies,
			package: packageId,
			ticket,
		});

		// return the cap
		intent.commit(tx, DAO_GENERICS, executable, receipt);
		let result = intent.completeExecution(tx, DAO_GENERICS, executable);
		// if no more executions scheduled after this one, destroy intent
		if (intent.fields.executionTimes.length == 1) {
			result = intent.clearEmpty(tx, DAO_GENERICS, intentKey);
		}
		return result;
	}
}

