import { coinWithBalance, Transaction, TransactionObjectInput, TransactionResult } from "@mysten/sui/transactions";
import {
	Intent, OwnedData, AccountPreview, Dep,
	IntentStatus, ActionsArgs, IntentArgs, Invite, Profile,
} from "@account.tech/core";
import { SUI_FRAMEWORK, ACCOUNT_PROTOCOL, TransactionPureInput } from "@account.tech/core/dist/types";
import * as commands from "@account.tech/core/dist/lib/commands";
import { AccountSDK } from "@account.tech/core/dist/sdk";

import { PAYMENT_GENERICS, PAYMENT_CONFIG_TYPE } from "./lib/constants";
import { Member, PaymentData, DepStatus, IntentTypes, Roles } from "./lib/types";
import { Payment } from "./lib/account";
import { Pending } from "./lib/outcome";
import { ConfigPaymentIntent, PayIntent } from "./lib/intents";

export class PaymentClient extends AccountSDK {
	get paymentAccount(): Payment {
		return this.account as Payment;
	}

	static async init(
		network: "mainnet" | "testnet" | "devnet" | "localnet" | string,
		userAddr: string,
		accountId?: string,
	): Promise<PaymentClient> {
		const msClient = await super.init(
			network,
			userAddr,
			accountId,
			{
				accountType: Payment,
				ownedObjects: true,
				assetFactory: [/* we don't need managed assets as of now */],
				intentFactory: [ConfigPaymentIntent, PayIntent],
				outcomeFactory: [Pending],
			}
		);
		return msClient as PaymentClient;
	}

	async refresh() {
		await super.refresh();
	}

	async switchAccount(accountId: string) {
		await this.account.refresh(accountId);
	}

	/// Creates a payment account
	createPaymentAccount(
		tx: Transaction,
		name: string, // name of the payment account
		newUser?: { username: string, profilePicture: string }, // must provide args if caller has no User object [USE PLACEHOLDER FOR NOW]
		memberAddresses?: string[], // backup addresses if any
	): TransactionResult {
		// create the user if the user doesn't have one
		let userId: TransactionPureInput = this.user.id;
		let createdUser: TransactionPureInput | null = null;
		if (userId === "") {
			if (!newUser) throw new Error("User must create an user before creating a payment account");
			createdUser = this.user.createUser(tx); // TODO: add optional params for username and avatar 
			userId = tx.moveCall({
				target: `${SUI_FRAMEWORK}::object::id`,
				typeArguments: [`${ACCOUNT_PROTOCOL.V1}::user::User`],
				arguments: [tx.object(createdUser)],
			});
		}
		// create the account
		const account = this.paymentAccount?.newPaymentAccount(tx);
		// add name
		const auth = this.paymentAccount.authenticate(tx, account);
		commands.replaceMetadata(tx, PAYMENT_CONFIG_TYPE, auth, account, ["name"], [name]);
		// update account rules if members are provided
		let members: Member[] = [{ address: this.user.address!, roles: [Roles.Pay] }];
		if (memberAddresses) {
			members = members.concat(memberAddresses.map((address: string) => ({ address, roles: [] })));
		}

		this.paymentAccount.atomicConfigPaymentAccount(
			tx,
			{ members },
			account
		);

		// creator register the account in his user
		this.paymentAccount.joinPaymentAccount(tx, createdUser ? createdUser : userId, account);
		// send invites to added members
		memberAddresses?.forEach(address => { this.paymentAccount.sendInvite(tx, address, account) });
		// transfer the user if just created
		if (createdUser) this.user.transferUser(tx, createdUser, this.user.address!);
		// share the account
		return this.paymentAccount?.sharePaymentAccount(tx, account);
	}

	/// Factory function to call the appropriate request function
	request(
		tx: Transaction,
		intentType: string, // TypeName of the intent
		intentArgs: IntentArgs,
		actionsArgs: ActionsArgs,
	): TransactionResult {
		const auth = this.paymentAccount.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.paymentAccount.emptyApprovalsOutcome(tx);

		const intentClass = this.config.intentFactory.find(intent => intent.type === intentType);
		if (!intentClass) throw new Error("Intent not found");
		const method = intentClass.prototype.request;
		method.call(intentClass, tx, PAYMENT_GENERICS, auth, this.paymentAccount.id, params, outcome, actionsArgs);
		// directly approve after proposing
		return this.paymentAccount.approveIntent(tx, intentArgs.key, this.paymentAccount.id);
	}

	/// Approves a intent
	approve(
		tx: Transaction,
		intentKey: string
	): TransactionResult {
		return this.paymentAccount.approveIntent(tx, intentKey, this.paymentAccount.id);
	}

	/// Removes approval from a intent
	disapprove(
		tx: Transaction,
		intentKey: string
	): TransactionResult {
		return this.paymentAccount.disapproveIntent(tx, intentKey, this.paymentAccount.id);
	}

	/// Calls the execute function for the intent, approve if not already done
	execute(
		tx: Transaction,
		intentKey: string
	): TransactionResult {
		const intent = this.intents?.intents[intentKey];
		if (!intent) throw new Error("Intent not found");

		const executable = this.paymentAccount.executeIntent(tx, intentKey);

		let result;
		result = intent.execute(tx, PAYMENT_GENERICS, executable);
		intent.completeExecution(tx, PAYMENT_GENERICS, executable);
		// if no more executions scheduled after this one, destroy intent
		if (intent.fields.executionTimes.length == 1) {
			result = intent.clearEmpty(tx, PAYMENT_GENERICS, this.paymentAccount.id, intentKey);
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

		intent.deleteExpired(tx, PAYMENT_GENERICS, this.paymentAccount.id, intentKey);
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

	// === Getters ===

	/// Returns the latest deps from the extensions
	getLatestExtensions(): Dep[] {
		return this.extensions.getLatestDeps();
	}

	getUserProfile(): Profile {
		return this.user.profile;
	}

	getUserPaymentAccounts(): AccountPreview[] {
		return this.user.accounts;
	}

	getUserInvites(): Invite[] {
		return this.user.invites;
	}

	getPaymentAccountName(): string {
		return this.paymentAccount.getName();
	}

	getPaymentAccountDeps(): Dep[] {
		return this.paymentAccount.deps;
	}

	/// Returns deps that are in Account and in Extensions
	getVerifiedDeps(): Dep[] {
		const currentDeps = this.getPaymentAccountDeps();
		const latestDeps = this.getLatestExtensions();

		return currentDeps.filter(dep => latestDeps.some(latestDep => latestDep.name === dep.name));
	}

	/// Returns deps that are in Account but not in Extensions
	getUnverifiedDeps(): Dep[] {
		const currentDeps = this.getPaymentAccountDeps();
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

	getPaymentAccountConfig(): Pick<PaymentData, "members"> {
		return {
			members: this.paymentAccount.members,
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

		// Check if intent has been approved
		const hasBeenApproved = (intent.outcome as Pending).approved_by ?? false;

		// If intent has been approved, check execution time
		if (hasBeenApproved) {
			stage = now >= intent.fields.executionTimes[0] ? 'executable' : 'resolved';
		}

		return {
			stage: stage as 'pending' | 'executable' | 'resolved',
			deletable,
		};
	}

	canApproveIntent(key: string): boolean {
		const outcome = this.getIntent(key).outcome as Pending;
		return outcome.approved_by !== null;
	}

	getPendingPayments(): Record<string, Intent> {
		// @ts-ignore: Property 'type' exists on the constructor for Intent subclasses
		return Object.fromEntries(Object.entries(this.intents?.intents ?? {}).filter(([_, intent]) => intent.constructor.type === IntentTypes.Pay));
	}

	getOwnedObjects(): OwnedData {
		return this.ownedObjects?.getData() ?? {} as OwnedData;
	}

	// === Commands ===

	/// Automatically merges and splits coins, then returns the ids of the newly created coins to be used in an intent
	mergeAndSplit(
		tx: Transaction,
		coinType: string,
		toSplit: bigint[], // amounts
	): TransactionResult {
		const coins = this.ownedObjects?.getCoin(coinType);
		const availableInstances = coins?.instances.filter(instance => !this.paymentAccount.lockedObjects.includes(instance.ref.objectId));
		if (!availableInstances || availableInstances.reduce((acc, curr) => acc + curr.amount, 0n) < toSplit.reduce((acc, curr) => acc + curr, 0n)) {
			throw new Error("Not enough coins");
		}

		const auth = this.paymentAccount.authenticate(tx);
		return commands.mergeAndSplit(tx, PAYMENT_CONFIG_TYPE, coinType, auth, this.paymentAccount.id, availableInstances.map(instance => instance.ref).slice(0, 500), toSplit);
	}


	/// Modifies the name of the Account
	modifyName(
		tx: Transaction,
		newName: string,
	): TransactionResult {
		const auth = this.paymentAccount.authenticate(tx);
		return commands.replaceMetadata(tx, PAYMENT_CONFIG_TYPE, auth, this.paymentAccount.id, ["name"], [newName]);
	}

	/// Updates the verified deps to the latest version
	updateVerifiedDeps(
		tx: Transaction,
	): TransactionResult {
		const auth = this.paymentAccount.authenticate(tx);
		return commands.updateVerifiedDepsToLatest(tx, PAYMENT_CONFIG_TYPE, auth, this.paymentAccount.id);
	}

	// === Intents ===

	/// Sets the recovery address using the owner address (user must sign with owner address)
	setRecoveryAddress(
		tx: Transaction,
		backupAddress: string,
	): TransactionResult {
		return this.paymentAccount.atomicConfigPaymentAccount(
			tx,
			{
				members: [
					{ address: this.paymentAccount.members[0].address, roles: [IntentTypes.Pay] }, // no change
					{ address: backupAddress, roles: [] }
				]
			},
			this.paymentAccount.id
		);
	}

	/// Sets the owner address using the backup address (user must sign with backup address)
	setOwnerAddress(
		tx: Transaction,
		ownerAddress: string,
	): TransactionResult {
		return this.paymentAccount.atomicConfigPaymentAccount(
			tx,
			{
				members: [
					{ address: ownerAddress, roles: [IntentTypes.Pay] },
					{ address: this.paymentAccount.members[1].address, roles: [] } // no change
				]
			},
			this.paymentAccount.id
		);
	}

	issuePayment(
		tx: Transaction,
		description: string,
		coinType: string,
		amount: bigint,
	): TransactionResult {
		const auth = this.paymentAccount.authenticate(tx);
		const [params, key] = Intent.createParamsWithRandKey( // key is payment id
			tx,
			{ description, executionTimes: undefined, expirationTime: BigInt(1000 * 60 * 60 * 6) } // 6 hours before payment request can be deleted
		);
		const outcome = this.paymentAccount.emptyApprovalsOutcome(tx);

		PayIntent.prototype.request(
			tx,
			PAYMENT_GENERICS,
			auth,
			this.paymentAccount.id,
			params,
			outcome,
			{ coinType, amount },
		);

		return this.paymentAccount.approveIntent(tx, key, this.paymentAccount.id);
	}

	makePayment(
		tx: Transaction,
		paymentId: string,
		tipAmount?: bigint,
	): TransactionResult {
		const intent = this.getIntent(paymentId) as PayIntent;
		if (!intent) throw new Error("Intent not found");

		const executable = this.paymentAccount.executeIntent(tx, paymentId);

		intent.execute(
			tx,
			PAYMENT_GENERICS,
			executable,
			coinWithBalance({ balance: intent.args.amount + (tipAmount ?? 0n), type: intent.args.coinType })
		);

		intent.completeExecution(tx, PAYMENT_GENERICS, executable);
		return intent.clearEmpty(tx, PAYMENT_GENERICS, this.paymentAccount.id, paymentId);
	}
}

