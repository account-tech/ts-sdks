import { Transaction, TransactionObjectInput, TransactionResult } from "@mysten/sui/transactions";
import {
	Intent, OwnedData, AccountPreview, Currencies, Kiosks, Vaults, Packages, Caps, Dep,
	IntentStatus, ActionsArgs, IntentArgs, Invite, Profile, ActionsIntentTypes,
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

import { MULTISIG_GENERICS, MULTISIG_CONFIG_TYPE } from "./lib/constants"; 
import { Member, Threshold, MultisigData, DepStatus } from "./lib/types";
import { Multisig } from "./lib/account";
import { Approvals } from "./lib/outcome";
import { ConfigMultisigIntent } from "./lib/intents";

export class MultisigClient extends AccountSDK {

	get multisig(): Multisig {
		return this.account as Multisig;
	}

	static async init(
		network: "mainnet" | "testnet" | "devnet" | "localnet" | string,
		userAddr: string,
		multisigId?: string,
	): Promise<MultisigClient> {
		const msClient = await super.init(
			network,
			userAddr,
			multisigId,
			{
				accountType: Multisig,
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
					ConfigMultisigIntent,
				],
				outcomeFactory: [Approvals],
			}
		);
		return msClient as MultisigClient;
	}

	async refresh() {
		await super.refresh();
	}

	async switchMultisig(multisigId: string) {
		await this.account.refresh(multisigId);
	}

	/// Creates a multisig with default weights of 1 (1 member = 1 voice)
	createMultisig(
		tx: Transaction,
		name: string,
		newUser?: { username: string, profilePicture: string },
		memberAddresses?: string[],
		globalThreshold?: number,
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
		// create the multisig
		const fee = tx.splitCoins(tx.gas, [this.multisig.fees]);
		const multisig = this.multisig?.newMultisig(tx, fee);
		// add name
		const auth = this.multisig.authenticate(tx, multisig);
		commands.replaceMetadata(tx, MULTISIG_CONFIG_TYPE, auth, multisig, ["name"], [name]);
		// update multisig rules if members are provided
		if (memberAddresses) {
			const members = memberAddresses.map((address: string) => ({ address, weight: 1, roles: [] }));
			members.push({ address: this.user.address!, weight: 1, roles: [] }); // add creator to the members

			this.multisig.atomicConfigMultisig(
				tx,
				{ members, thresholds: { global: globalThreshold ?? 1, roles: [] } },
				multisig
			); // atomic intent
		}
		// creator register the multisig in his user
		this.multisig.joinMultisig(tx, createdUser ? createdUser : userId, multisig);
		// send invites to added members
		memberAddresses?.forEach(address => { this.multisig.sendInvite(tx, address, multisig) });
		// transfer the user if just created
		if (createdUser) this.user.transferUser(tx, createdUser, this.user.address!);
		// share the multisig
		return this.multisig?.shareMultisig(tx, multisig);
	}

	/// Factory function to call the appropriate request function
	request(
		tx: Transaction,
		intentType: string, // TypeName of the intent
		intentArgs: IntentArgs,
		actionsArgs: ActionsArgs,
	): TransactionResult {
		const auth = this.multisig.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.multisig.emptyApprovalsOutcome(tx);

		const intentClass = this.config.intentFactory.find(intent => intent.type === intentType);
		if (!intentClass) throw new Error("Intent not found");
		const method = intentClass.prototype.request;
		method.call(intentClass, tx, MULTISIG_GENERICS, auth, this.multisig.id, params, outcome, actionsArgs);
		// directly approve after proposing
		return this.multisig.approveIntent(tx, intentArgs.key, this.multisig.id);
	}

	/// Approves a intent
	approve(
		tx: Transaction,
		intentKey: string
	): TransactionResult {
		return this.multisig.approveIntent(tx, intentKey, this.multisig.id);
	}

	/// Removes approval from a intent
	disapprove(
		tx: Transaction,
		intentKey: string
	): TransactionResult {
		return this.multisig.disapproveIntent(tx, intentKey, this.multisig.id);
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
			(intent as WithdrawAndTransferIntent).initTypeById(this.ownedObjects);
		}

		(intent.outcome as Approvals).maybeApprove(tx, caller);
		const executable = this.multisig.executeIntent(tx, intentKey);

		let result;
		result = intent.execute(tx, MULTISIG_GENERICS, executable);
		intent.completeExecution(tx, MULTISIG_GENERICS, executable);
		// if no more executions scheduled after this one, destroy intent
		if (intent.fields.executionTimes.length == 1) {
			result = intent.clearEmpty(tx, MULTISIG_GENERICS, this.multisig.id, intentKey);
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

		intent.deleteExpired(tx, MULTISIG_GENERICS, this.multisig.id, intentKey);
	}

	acceptInvite(tx: Transaction, invite: TransactionObjectInput): TransactionResult {
		let user: TransactionObjectInput = this.user.id;
		if (user === "") {
			user = this.user.createUser(tx);
		}
		return this.user.acceptInvite(tx, user, invite);
	}

	refuseInvite(tx: Transaction, invite: TransactionObjectInput): TransactionResult {
		return this.user.refuseInvite(tx, invite);
	}

	reorderMultisigs(tx: Transaction, multisigAddrs: string[]) {
		return this.user.reorderAccounts(tx, this.user.id, MULTISIG_CONFIG_TYPE, multisigAddrs);
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

	getMultisigName(): string {
		return this.multisig.getName();
	}

	getMultisigDeps(): Dep[] {
		return this.multisig.deps;
	}

	/// Returns deps that are in Multisig and in Extensions
	getVerifiedDeps(): Dep[] {
		const currentDeps = this.getMultisigDeps();
		const latestDeps = this.getLatestExtensions();

		return currentDeps.filter(dep => latestDeps.some(latestDep => latestDep.name === dep.name));
	}

	/// Returns deps that are in Multisig but not in Extensions
	getUnverifiedDeps(): Dep[] {
		const currentDeps = this.getMultisigDeps();
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

	getMultisigConfig(): Pick<MultisigData, "global" | "roles" | "members"> {
		return {
			global: this.multisig.global,
			roles: this.multisig.roles,
			members: this.multisig.members,
		};
	}

	getIntent(key: string): Intent {
		const intent = this.intents?.intents[key];
		if (!intent) throw new Error("Intent not found");
		return intent;
	}

	getIntentStatus(key: string): IntentStatus {
		const now = Date.now();
		const intent = this.getIntent(key);

		let [stage, deletable] = ['pending', false];

		// Check expiration first
		if (now >= intent.fields.expirationTime) {
			deletable = true;
		}

		// Check if intent has reached threshold
		const hasReachedThreshold =
			(intent.outcome as Approvals).totalWeight >= this.multisig.global.threshold ||
			(intent.fields.role in this.multisig.roles && (intent.outcome as Approvals).totalWeight >= this.multisig.roles[intent.fields.role].threshold);

		// If threshold is reached, check execution time
		if (hasReachedThreshold) {
			stage = now >= intent.fields.executionTimes[0] ? 'executable' : 'resolved';
		}

		return {
			stage: stage as 'pending' | 'executable' | 'resolved',
			deletable,
		};
	}

	canApproveIntent(key: string): boolean {
		const outcome = this.getIntent(key).outcome as Approvals;
		return outcome.approved.includes(this.user.address!);
	}

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
		const availableInstances = coins?.instances.filter(instance => !this.multisig.lockedObjects.includes(instance.ref.objectId));
		if (!availableInstances || availableInstances.reduce((acc, curr) => acc + curr.amount, 0n) < toSplit.reduce((acc, curr) => acc + curr, 0n)) {
			throw new Error("Not enough coins");
		}

		const auth = this.multisig.authenticate(tx);
		return commands.mergeAndSplit(tx, MULTISIG_CONFIG_TYPE, coinType, auth, this.multisig.id, availableInstances.map(instance => instance.ref).slice(0, 500), toSplit);
	}

	/// Deposits and locks a Cap object in the Account
	depositCap(
		tx: Transaction,
		capType: string,
		capObject: TransactionObjectInput,
	): TransactionResult {
		const auth = this.multisig.authenticate(tx);
		return commands.depositCap(tx, MULTISIG_CONFIG_TYPE, capType, auth, this.multisig.id, capObject);
	}

	/// Modifies the name of the Account
	modifyName(
		tx: Transaction,
		newName: string,
	): TransactionResult {
		const auth = this.multisig.authenticate(tx);
		return commands.replaceMetadata(tx, MULTISIG_CONFIG_TYPE, auth, this.multisig.id, ["name"], [newName]);
	}

	/// Updates the verified deps to the latest version
	updateVerifiedDeps(
		tx: Transaction,
	): TransactionResult {
		const auth = this.multisig.authenticate(tx);
		return commands.updateVerifiedDepsToLatest(tx, MULTISIG_CONFIG_TYPE, auth, this.multisig.id);
	}

	/// Deposits and locks a TreasuryCap object in the Account
	depositTreasuryCap(
		tx: Transaction,
		coinType: string,
		treasuryCap: TransactionObjectInput,
	): TransactionResult {
		const auth = this.multisig.authenticate(tx);
		return commands.depositTreasuryCap(tx, MULTISIG_CONFIG_TYPE, coinType, auth, this.multisig.id, treasuryCap);
	}

	/// Opens a Kiosk in the Account
	openKiosk(
		tx: Transaction,
		kioskName: string,
	): TransactionResult {
		const auth = this.multisig.authenticate(tx);
		return commands.openKiosk(tx, MULTISIG_CONFIG_TYPE, auth, this.multisig.id, kioskName);
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
		const auth = this.multisig.authenticate(tx);
		const request = commands.placeInKiosk(tx, MULTISIG_CONFIG_TYPE, nftType, auth, this.multisig.id, accountKioskId, senderKiosk, senderCap, policyId, kioskName, nftId);
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
		const auth = this.multisig.authenticate(tx);
		return commands.delistFromKiosk(tx, MULTISIG_CONFIG_TYPE, nftType, auth, this.multisig.id, accountKioskId, kioskName, nftId);
	}

	/// Withdraws the profits from a Kiosk managed by the Account
	withdrawProfitsFromKiosk(
		tx: Transaction,
		kioskName: string,
	): TransactionResult {
		// get the account kiosk from its name 
		const accountKioskId = this.getKiosks().assets[kioskName].id;
		if (!accountKioskId) throw new Error("Kiosk not found");
		const auth = this.multisig.authenticate(tx);
		return commands.withdrawProfitsFromKiosk(tx, MULTISIG_CONFIG_TYPE, auth, this.multisig.id, accountKioskId, kioskName);
	}

	/// Closes an empty Kiosk managed by the Account
	closeKiosk(
		tx: Transaction,
		kioskName: string,
	): TransactionResult {
		// get the account kiosk from its name 
		const accountKioskId = this.getKiosks().assets[kioskName].id;
		if (!accountKioskId) throw new Error("Kiosk not found");
		const auth = this.multisig.authenticate(tx);
		return commands.closeKiosk(tx, MULTISIG_CONFIG_TYPE, auth, this.multisig.id, accountKioskId, kioskName);
	}

	/// Deposits and locks an UpgradeCap object in the Account
	depositUpgradeCap(
		tx: Transaction,
		packageName: string,
		upgradeCap: TransactionObjectInput,
	): TransactionResult {
		const auth = this.multisig.authenticate(tx);
		return commands.depositUpgradeCap(tx, MULTISIG_CONFIG_TYPE, auth, this.multisig.id, upgradeCap, packageName, 0);
	}

	/// Opens a Treasury in the Account
	openVault(
		tx: Transaction,
		treasuryName: string,
	): TransactionResult {
		const auth = this.multisig.authenticate(tx);
		return commands.openVault(tx, MULTISIG_CONFIG_TYPE, auth, this.multisig.id, treasuryName);
	}

	/// Deposits an object into the Treasury from the caller wallet
	depositFromWallet(
		tx: Transaction,
		coinType: string,
		treasuryName: string,
		coin: TransactionObjectInput,
	): TransactionResult {
		const auth = this.multisig.authenticate(tx);
		return commands.depositFromWallet(tx, MULTISIG_CONFIG_TYPE, coinType, auth, this.multisig.id, treasuryName, coin);
	}

	/// Closes an empty Treasury managed by the Account
	closeVault(
		tx: Transaction,
		treasuryName: string,
	): TransactionResult {
		const auth = this.multisig.authenticate(tx);
		return commands.closeVault(tx, MULTISIG_CONFIG_TYPE, auth, this.multisig.id, treasuryName);
	}

	// === Intents ===

	requestConfigMultisig(
		tx: Transaction,
		intentArgs: IntentArgs,
		globalThreshold: number,
		roleThresholds: Threshold[],
		members: Member[],
	): TransactionResult {
		const auth = this.multisig.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.multisig.emptyApprovalsOutcome(tx);

		ConfigMultisigIntent.prototype.request(
			tx,
			MULTISIG_GENERICS,
			auth,
			this.multisig.id,
			params,
			outcome,
			{ members, thresholds: { global: globalThreshold, roles: roleThresholds } },
		);

		return this.multisig.approveIntent(tx, intentArgs.key, this.multisig.id);
	}

	requestConfigDeps(
		tx: Transaction,
		intentArgs: IntentArgs,
		deps: Dep[],
	): TransactionResult {
		const auth = this.multisig.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.multisig.emptyApprovalsOutcome(tx);

		ConfigDepsIntent.prototype.request(
			tx,
			MULTISIG_GENERICS,
			auth,
			this.multisig.id,
			params,
			outcome,
			{ deps },
		);

		return this.multisig.approveIntent(tx, intentArgs.key, this.multisig.id);
	}

	requestToggleUnverifiedDepsAllowed(
		tx: Transaction,
		intentArgs: IntentArgs,
	): TransactionResult {
		const auth = this.multisig.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.multisig.emptyApprovalsOutcome(tx);

		ToggleUnverifiedAllowedIntent.prototype.request(
			tx,
			MULTISIG_GENERICS,
			auth,
			this.multisig.id,
			params,
			outcome,
			{}
		);

		return this.multisig.approveIntent(tx, intentArgs.key, this.multisig.id);
	}

	requestBorrowCap(
		tx: Transaction,
		intentArgs: IntentArgs,
		capType: string,
	): TransactionResult {
		const auth = this.multisig.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.multisig.emptyApprovalsOutcome(tx);

		BorrowCapIntent.prototype.request(
			tx,
			MULTISIG_GENERICS,
			auth,
			this.multisig.id,
			params,
			outcome,
			{ capType },
		);

		return this.multisig.approveIntent(tx, intentArgs.key, this.multisig.id);
	}

	requestDisableRules(
		tx: Transaction,
		intentArgs: IntentArgs,
		coinType: string,
		mint: boolean,
		burn: boolean,
		updateSymbol: boolean,
		updateName: boolean,
		updateDescription: boolean,
		updateIcon: boolean,
	): TransactionResult {
		const auth = this.multisig.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.multisig.emptyApprovalsOutcome(tx);

		DisableRulesIntent.prototype.request(
			tx,
			MULTISIG_GENERICS,
			auth,
			this.multisig.id,
			params,
			outcome,
			{ coinType, mint, burn, updateSymbol, updateName, updateDescription, updateIcon },
		);

		return this.multisig.approveIntent(tx, intentArgs.key, this.multisig.id);
	}

	requestUpdateMetadata(
		tx: Transaction,
		intentArgs: IntentArgs,
		coinType: string,
		newName: string | null,
		newSymbol: string | null,
		newDescription: string | null,
		newIconUrl: string | null,
	): TransactionResult {
		const auth = this.multisig.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.multisig.emptyApprovalsOutcome(tx);

		UpdateMetadataIntent.prototype.request(
			tx,
			MULTISIG_GENERICS,
			auth,
			this.multisig.id,
			params,
			outcome,
			{ coinType, newName, newSymbol, newDescription, newIconUrl },
		);

		return this.multisig.approveIntent(tx, intentArgs.key, this.multisig.id);
	}

	requestMintAndTransfer(
		tx: Transaction,
		intentArgs: IntentArgs,
		coinType: string,
		transfers: { amount: bigint, recipient: string }[],
	): TransactionResult {
		const auth = this.multisig.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.multisig.emptyApprovalsOutcome(tx);

		MintAndTransferIntent.prototype.request(
			tx,
			MULTISIG_GENERICS,
			auth,
			this.multisig.id,
			params,
			outcome,
			{ coinType, transfers },
		);

		return this.multisig.approveIntent(tx, intentArgs.key, this.multisig.id);
	}

	requestMintAndVest(
		tx: Transaction,
		intentArgs: IntentArgs,
		coinType: string,
		amount: bigint,
		start: bigint,
		end: bigint,
		recipient: string,
	): TransactionResult {
		const auth = this.multisig.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.multisig.emptyApprovalsOutcome(tx);

		MintAndVestIntent.prototype.request(
			tx,
			MULTISIG_GENERICS,
			auth,
			this.multisig.id,
			params,
			outcome,
			{ coinType, amount, start, end, recipient },
		);

		return this.multisig.approveIntent(tx, intentArgs.key, this.multisig.id);
	}

	requestWithdrawAndBurn(
		tx: Transaction,
		intentArgs: IntentArgs,
		coinType: string,
		amount: bigint,
	): TransactionResult {
		const auth = this.multisig.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.multisig.emptyApprovalsOutcome(tx);

		const coinId = this.mergeAndSplit(tx, coinType, [amount]);

		WithdrawAndBurnIntent.prototype.request(
			tx,
			MULTISIG_GENERICS,
			auth,
			this.multisig.id,
			params,
			outcome,
			{ coinType, coinId, amount },
		);

		return this.multisig.approveIntent(tx, intentArgs.key, this.multisig.id);
	}

	requestTakeNfts(
		tx: Transaction,
		intentArgs: IntentArgs,
		kioskName: string,
		nftIds: string[],
		recipient: string,
	): TransactionResult {
		const auth = this.multisig.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.multisig.emptyApprovalsOutcome(tx);

		TakeNftsIntent.prototype.request(
			tx,
			MULTISIG_GENERICS,
			auth,
			this.multisig.id,
			params,
			outcome,
			{ kioskName, nftIds, recipient },
		);

		return this.multisig.approveIntent(tx, intentArgs.key, this.multisig.id);
	}

	requestListNfts(
		tx: Transaction,
		intentArgs: IntentArgs,
		kioskName: string,
		listings: { nftId: string, price: bigint }[],
	): TransactionResult {
		const auth = this.multisig.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.multisig.emptyApprovalsOutcome(tx);

		ListNftsIntent.prototype.request(
			tx,
			MULTISIG_GENERICS,
			auth,
			this.multisig.id,
			params,
			outcome,
			{ kioskName, listings },
		);

		return this.multisig.approveIntent(tx, intentArgs.key, this.multisig.id);
	}

	requestWithdrawAndTransferToVault(
		tx: Transaction,
		intentArgs: IntentArgs,
		coinType: string,
		coinAmount: bigint,
		vaultName: string,
	): TransactionResult {
		const auth = this.multisig.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.multisig.emptyApprovalsOutcome(tx);

		const coinIds = this.mergeAndSplit(tx, coinType, [coinAmount]);
		const coinId = tx.moveCall({
			target: `${MOVE_STDLIB}::vector::swap_remove`,
			typeArguments: [`${SUI_FRAMEWORK}::object::ID`],
			arguments: [coinIds, tx.pure.u64(0)],
		});

		WithdrawAndTransferToVaultIntent.prototype.request(
			tx,
			MULTISIG_GENERICS,
			auth,
			this.multisig.id,
			params,
			outcome,
			{ coinType, coinId, coinAmount, vaultName },
		);

		return this.multisig.approveIntent(tx, intentArgs.key, this.multisig.id);
	}

	requestWithdrawAndTransfer(
		tx: Transaction,
		intentArgs: IntentArgs,
		coinTransfers: { coinType: string, coinAmount: bigint, recipient: string }[],
		objTransfers: { objectId: string, recipient: string }[],
	): TransactionResult {
		const auth = this.multisig.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.multisig.emptyApprovalsOutcome(tx);

		let transfers: { objectId: TransactionPureInput, recipient: string }[] = objTransfers;

		coinTransfers.forEach(transfer => {
			const ids = this.mergeAndSplit(tx, transfer.coinType, [transfer.coinAmount]);
			const objectId = tx.moveCall({
				target: `${MOVE_STDLIB}::vector::swap_remove`,
				typeArguments: [`${SUI_FRAMEWORK}::object::ID`],
				arguments: [ids, tx.pure.u64(0)],
			});
			transfers.push({ objectId, recipient: transfer.recipient });
		});
		
		WithdrawAndTransferIntent.prototype.request(
			tx,
			MULTISIG_GENERICS,
			auth,
			this.multisig.id,
			params,
			outcome,
			{ transfers },
		);

		return this.multisig.approveIntent(tx, intentArgs.key, this.multisig.id);
	}

	// optimized version of withdrawAndTransfer for airdropping coins to multiple recipients
	requestWithdrawAndAirdropCoins(
		tx: Transaction,
		intentArgs: IntentArgs,
		coinType: string,
		drops: {recipient: string, amount: bigint}[],
	): TransactionResult {
		const auth = this.multisig.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.multisig.emptyApprovalsOutcome(tx);

		const coinIds = this.mergeAndSplit(tx, coinType, drops.map(drop => drop.amount));
		const recipients = drops.map(drop => drop.recipient);
		
		tx.moveCall({
			target: `${ACCOUNT_ACTIONS.V1}::owned_intents::request_withdraw_and_transfer`,
			typeArguments: MULTISIG_GENERICS,
			arguments: [
				auth,
				tx.object(this.multisig.id),
				params,
				outcome,
				coinIds,
				tx.pure.vector("address", recipients),
			],
		});

		return this.multisig.approveIntent(tx, intentArgs.key, this.multisig.id);
	}

	requestWithdrawAndVest(
		tx: Transaction,
		intentArgs: IntentArgs,
		coinType: string,
		coinAmount: bigint,
		start: bigint,
		end: bigint,
		recipient: string,
	): TransactionResult {
		const auth = this.multisig.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.multisig.emptyApprovalsOutcome(tx);

		const coinId = this.mergeAndSplit(tx, coinType, [coinAmount]);

		WithdrawAndVestIntent.prototype.request(
			tx,
			MULTISIG_GENERICS,
			auth,
			this.multisig.id,
			params,
			outcome,
			{ coinId, start, end, recipient },
		);

		return this.multisig.approveIntent(tx, intentArgs.key, this.multisig.id);
	}

	requestUpgradePackage(
		tx: Transaction,
		intentArgs: IntentArgs,
		packageName: string,
		digest: number[],
	): TransactionResult {
		const auth = this.multisig.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.multisig.emptyApprovalsOutcome(tx);

		UpgradePackageIntent.prototype.request(
			tx,
			MULTISIG_GENERICS,
			auth,
			this.multisig.id,
			params,
			outcome,
			{ packageName, digest },
		);

		return this.multisig.approveIntent(tx, intentArgs.key, this.multisig.id);
	}

	requestRestrictPolicy(
		tx: Transaction,
		intentArgs: IntentArgs,
		packageName: string,
		policy: number,
	): TransactionResult {
		const auth = this.multisig.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.multisig.emptyApprovalsOutcome(tx);

		RestrictPolicyIntent.prototype.request(
			tx,
			MULTISIG_GENERICS,
			auth,
			this.multisig.id,
			params,
			outcome,
			{ packageName, policy },
		);

		return this.multisig.approveIntent(tx, intentArgs.key, this.multisig.id);
	}

	requestSpendAndTransfer(
		tx: Transaction,
		intentArgs: IntentArgs,
		treasuryName: string,
		coinType: string,
		transfers: { amount: bigint, recipient: string }[],
	): TransactionResult {
		const auth = this.multisig.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.multisig.emptyApprovalsOutcome(tx);

		SpendAndTransferIntent.prototype.request(
			tx,
			MULTISIG_GENERICS,
			auth,
			this.multisig.id,
			params,
			outcome,
			{ treasuryName, coinType, transfers },
		);

		return this.multisig.approveIntent(tx, intentArgs.key, this.multisig.id);
	}

	requestSpendAndVest(
		tx: Transaction,
		intentArgs: IntentArgs,
		treasuryName: string,
		coinType: string,
		amount: bigint,
		start: bigint,
		end: bigint,
		recipient: string,
	): TransactionResult {
		const auth = this.multisig.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.multisig.emptyApprovalsOutcome(tx);

		SpendAndVestIntent.prototype.request(
			tx,
			MULTISIG_GENERICS,
			auth,
			this.multisig.id,
			params,
			outcome,
			{ treasuryName, coinType, amount, start, end, recipient },
		);

		return this.multisig.approveIntent(tx, intentArgs.key, this.multisig.id);
	}
}

