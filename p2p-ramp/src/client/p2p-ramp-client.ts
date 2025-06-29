// @ts-nocheck

import { Transaction, TransactionResult } from "@mysten/sui/transactions";
import { SuiMoveObject, SuiObjectResponse } from "@mysten/sui/client";
import { HANDSHAKE_GENERICS, P2P_RAMP_CONFIG_TYPE } from "../lib/constants";
import { P2PRamp } from "../lib/account";
import { Handshake } from "../lib/outcome";
import { ConfigP2PRampIntent, FillBuyIntent, FillSellIntent } from "../lib/intents";
import { DepStatus } from "../lib/types";
import { Orders } from "../lib/dynamic-fields";
import { createOrder, destroyOrder } from "../lib/commands";
import { AccountRegistry } from "../lib/account-registry.ts";
import {ACCOUNT_PROTOCOL, SUI_FRAMEWORK, TransactionPureInput} from "@account.tech/core/types";
import {Intent, IntentArgs} from "@account.tech/core/lib/intents";
import {Profile} from "@account.tech/core/lib/user";
import {Dep} from "@account.tech/core/lib/account"
import {AccountSDK} from "@account.tech/core/sdk";
import * as commands from "@account.tech/core/lib/commands";

export class P2PRampClient extends AccountSDK {
	registry?: AccountRegistry;
	previews: { name: string, id: string }[] = [];

	get p2pramp() {
		return this.account as P2PRamp;
	}

	static async init(
		network: "mainnet" | "testnet" | "devnet" | "localnet" | string,
		userAddr: string,
		accountId?: string,
	): Promise<P2PRampClient> {
		const p2prampClient = await super.init(
			network,
			userAddr,
			accountId,
			{
				accountType: P2PRamp,
				ownedObjects: false,
				assetFactory: [Orders],
				intentFactory: [
					ConfigP2PRampIntent,
					FillBuyIntent,
					FillSellIntent,
				],
				outcomeFactory: [Handshake],
			}
		);

		(p2prampClient as P2PRampClient).previews = await (p2prampClient as P2PRampClient).fetchAccountPreviews();

		(p2prampClient as P2PRampClient).registry = await AccountRegistry.init(p2prampClient.client);

		return p2prampClient as P2PRampClient;
	}

	async fetchAccountPreviews(): Promise<{ id: string, name: string }[]> {
		const allIds = this.user.accountIds;
		if (allIds.length === 0) return [];

		// Fetch all account objects in one batch
		// Process in batches of 50 due to API limitations
		const accountsObjs = [];
		for (let i = 0; i < allIds.length; i += 50) {
			const batch = allIds.slice(i, i + 50);
			const batchResults = await this.client.multiGetObjects({
				ids: batch,
				options: { showContent: true }
			});
			accountsObjs.push(...batchResults);
		}

		// Process each account object
		const accounts = accountsObjs
			.filter(acc => (acc.data?.content as SuiMoveObject).type.includes(this.user.accountType))
			.map((acc: SuiObjectResponse) => {
				const moveObj = acc.data?.content as SuiMoveObject;

				const name = (moveObj.fields as any).metadata.fields.inner.fields.contents
					.find((entry: any) => entry.fields.key === "name")?.fields.value;

				return {
					id: (moveObj.fields as any).id.id,
					name: name ?? ""
				};
			})
			.sort((a, b) => {
				// Create a map of id to its position in allIds for sorting
				const idPositionMap = new Map(allIds.map((id, index) => [id, index]));
				// Sort based on the original order in allIds
				return idPositionMap.get(a.id)! - idPositionMap.get(b.id)!;
			});

		return accounts;
	}

	async refresh() {
		await super.refresh();
		this.previews = await this.fetchAccountPreviews();
		this.registry!.refresh();
	}

	async switchAccount(accountId: string) {
		await this.account.refresh(accountId);
	}

	/// Creates a p2p ramp account
	createAccount(
		tx: Transaction,
		name: string,
	): TransactionResult {
		// create the user if the user doesn't have one
		let userId: TransactionPureInput = this.user.id;
		let createdUser: TransactionPureInput | null = null;
		if (userId === "") {
			createdUser = this.user.createUser(tx); 
			userId = tx.moveCall({
				target: `${SUI_FRAMEWORK}::object::id`,
				typeArguments: [`${ACCOUNT_PROTOCOL.V1}::user::User`],
				arguments: [tx.object(createdUser)],
			});
		}
		// create the dao
		// const fee = tx.splitCoins(tx.gas, [this.dao.fees]); // TODO: add fees
		const account = this.p2pramp.newAccount(tx);
		// add name
		const auth = this.p2pramp.authenticate(tx, account);
		commands.replaceMetadata(tx, P2P_RAMP_CONFIG_TYPE, auth, account, ["name"], [name]);
		// creator register the dao in his user
		this.p2pramp.joinAccount(tx, createdUser ? createdUser : userId, account);
		// transfer the user if just created
		if (createdUser) this.user.transferUser(tx, createdUser, this.user.address!);
		// share the dao
		return this.p2pramp.shareAccount(tx, account);
	}

	flagAsPaid(
		tx: Transaction,
		key: string,
	) {
		const intent = this.getIntent(key);
		if (!intent) throw new Error("Intent not found");

		const handshake = intent.outcome as Handshake;
		handshake.flagAsPaid(tx, key, this.p2pramp.id);
	}

	flagAsSettled(
		tx: Transaction,
		key: string,
	) {
		const intent = this.getIntent(key);
		if (!intent) throw new Error("Intent not found");

		const handshake = intent.outcome as Handshake;
		handshake.flagAsSettled(tx, key, this.p2pramp.id);
	}

	flagAsDisputed(
		tx: Transaction,
		key: string,
	) {
		const intent = this.getIntent(key);
		if (!intent) throw new Error("Intent not found");

		const handshake = intent.outcome as Handshake;
		handshake.flagAsDisputed(tx, key, this.p2pramp.id);
	}

	executeHandshake(
		tx: Transaction,
		intentKey: string
	) {
		const intent = this.intents?.intents[intentKey];
		if (!intent) throw new Error("Intent not found");

		const executable = this.p2pramp.executeHandshakeIntent(tx, intentKey);

		intent.execute(tx, HANDSHAKE_GENERICS, executable);
	}

	reorderAccounts(tx: Transaction, accountAddrs: string[]) {
		this.user.reorderAccounts(tx, this.user.id, P2P_RAMP_CONFIG_TYPE, accountAddrs);
	}

	// === Getters ===

	/// Returns the latest deps from the extensions
	getLatestExtensions(): Dep[] {
		return this.extensions.getLatestDeps();
	}

	getUserProfile(): Profile {
		return this.user.profile;
	}

	getUserAccounts(): { id: string, name: string }[] {
		return this.previews;
	}

	getDaoDeps(): Dep[] {
		return this.p2pramp.deps;
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

	getAccountMembers(): string[] {
		return this.p2pramp.members;
	}

	getIntent(key: string): Intent {
		const intent = this.intents?.intents[key];
		if (!intent) throw new Error("Intent not found");
		return intent;
	}

	getManagedAssets(): Record<string, any> {
		return this.managedAssets?.assets ?? {};
	}

	getOrders(): Orders {
		return this.managedAssets?.assets?.["orders"] as Orders;
	}

	// === Commands ===

	/// Modifies the name of the Account
	modifyName(
		tx: Transaction,
		newName: string,
	) {
		const auth = this.p2pramp.authenticate(tx);
		commands.replaceMetadata(tx, P2P_RAMP_CONFIG_TYPE, auth, this.p2pramp.id, ["name"], [newName]);
	}

	/// Updates the verified deps to the latest version
	updateVerifiedDeps(
		tx: Transaction,
	) {
		const auth = this.p2pramp.authenticate(tx);
		commands.updateVerifiedDepsToLatest(tx, P2P_RAMP_CONFIG_TYPE, auth, this.p2pramp.id);
	}

	createOrder(
		tx: Transaction,
		isBuy: boolean,
		fiatAmount: bigint,
		fiatCode: string,
		coinAmount: bigint,
		coinType: string,
		minFill: bigint,
		maxFill: bigint,
	) {
		const auth = this.p2pramp.authenticate(tx);
		
		createOrder(
			tx, 
			auth, 
			this.p2pramp.id, 
			isBuy, 
			fiatAmount, 
			fiatCode, 
			coinAmount, 
			coinType, 
			minFill, 
			maxFill
		);
	}

	destroyOrder(
		tx: Transaction,
		orderId: string,
	) {
		const order = this.getOrders().assets[orderId];
		if (!order) throw new Error("Order not found");
		if (order.pendingFill > 0n) throw new Error("Order has pending fill");

		const auth = this.p2pramp.authenticate(tx);
		destroyOrder(tx, auth, this.p2pramp.id, orderId, order.coinType);
	}

	// === Intents ===

	requestConfigP2PRamp(
		tx: Transaction,
		intentArgs: IntentArgs,
		members: string[],
	) {
		const auth = this.p2pramp.authenticate(tx);
		const params = Intent.createParams(tx, intentArgs);
		const outcome = this.p2pramp.emptyApprovedOutcome(tx);

		ConfigP2PRampIntent.prototype.request(
			tx,
			null,
			auth,
			this.p2pramp.id,
			params,
			outcome,
			{ members },
		);
	}

	requestFillBuy(
		tx: Transaction,
		orderId: string,
		coinType: string,
		coinAmount: bigint,
	) {
		const outcome = this.p2pramp.requestedHandshakeOutcome(
			tx,
			this.p2pramp.members[0], // fiat sender
			this.user.address!, // coin sender
		);

		FillBuyIntent.prototype.request(
			tx,
			null,
			null,
			this.p2pramp.id,
			outcome,
			{ orderId, coinType, coinAmount },
		);
	}

	requestFillSell(
		tx: Transaction,
		orderId: string,
		coinType: string,
		fiatAmount: bigint,
	) {
		const outcome = this.p2pramp.requestedHandshakeOutcome(
			tx,
			this.user.address!, // fiat sender
			this.p2pramp.members[0], // coin sender
		);

		FillSellIntent.prototype.request(
			tx,
			null,
			null,
			this.p2pramp.id,
			outcome,
			{ orderId, coinType, fiatAmount },
		);
	}
}

