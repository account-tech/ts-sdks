import { Transaction, TransactionArgument, TransactionResult } from "@mysten/sui/transactions";

import { Account, Dep, ACCOUNT_PROTOCOL, EXTENSIONS, SUI_FRAMEWORK } from "@account.tech/core";
import { P2P_RAMP_CONFIG_TYPE, P2P_RAMP, FEES } from "./constants";
import { P2PRampData } from "./types";

export class P2PRamp extends Account implements P2PRampData {
    static type = P2P_RAMP_CONFIG_TYPE;
    
    members: string[] = [];
    fees: Record<string, bigint> = {}; // addr -> amount
    allowedCoins: string[] = [];
    allowedFiat: string[] = [];

    async init(id?: string): Promise<void> {
        if (id) {
            this.id = id;
            await this.refresh();
        }
    }

    async fetch(id: string = this.id)/*: Promise<DaoData> */ {
        if (!id && !this.id) {
            throw new Error("No address provided to refresh multisig");
        }

        const daoAccount = await this.client.getObject({
            id: this.id,
            options: { showContent: true },
        });
        const fields = (daoAccount.data?.content as any).fields

        const metadata = fields.metadata.fields.inner.fields.contents.map((m: any) => ({ key: m.fields.key, value: m.fields.value }));

        const deps: Dep[] = fields.deps.fields.inner.map((dep: any) => {
            return { name: dep.fields.name, addr: dep.fields.addr, version: Number(dep.fields.version) };
        });

        return {
            id,
            metadata,
            deps,
            unverifiedDepsAllowed: fields.deps.fields.unverified_allowed,
            lockedObjects: fields.intents.fields.locked.fields.contents,
            intentsBagId: fields.intents.fields.inner.fields.id.id,
            members: fields.config.fields.members.contents,
        }
    }

    async fetchFees(): Promise<Record<string, bigint>> {
        const fees = await this.client.getObject({
            id: FEES,
            options: { showContent: true },
        });
        return (fees.data?.content as any).fields.inner;
    }

    async refresh(id: string = this.id) {
        this.setData(await this.fetch(id));
        this.fees = await this.fetchFees();
    }

    setData(p2p: P2PRampData) {
        this.id = p2p.id;
        this.metadata = p2p.metadata;
        this.deps = p2p.deps;
        this.unverifiedDepsAllowed = p2p.unverifiedDepsAllowed;
        this.lockedObjects = p2p.lockedObjects;
        this.intentsBagId = p2p.intentsBagId;
        this.members = p2p.members;
    }

    getData(): P2PRampData {
        return {
            id: this.id,
            metadata: this.metadata,
            deps: this.deps,
            unverifiedDepsAllowed: this.unverifiedDepsAllowed,
            lockedObjects: this.lockedObjects,
            intentsBagId: this.intentsBagId,
            members: this.members,
        }
    }


    newAccount(
        tx: Transaction,
    ): TransactionResult {
        return tx.moveCall({
            target: `${P2P_RAMP.V1}::p2p_ramp::new_account`,
            arguments: [
                tx.object(EXTENSIONS),
            ],
        });
    }

    shareAccount(
        tx: Transaction,
        account: TransactionArgument,
    ): TransactionResult {
        return tx.moveCall({
            package: SUI_FRAMEWORK,
            module: "transfer",
            function: "public_share_object",
            typeArguments: [`${ACCOUNT_PROTOCOL.V1}::account::Account<${P2P_RAMP_CONFIG_TYPE}>`],
            arguments: [account],
        });
    }

    joinAccount(
        tx: Transaction,
        user: string | TransactionArgument,
        account: string | TransactionArgument,
    ): TransactionResult {
        return tx.moveCall({
            target: `${P2P_RAMP.V1}::p2p_ramp::join`,
            arguments: [
                typeof user === "string" ? tx.object(user) : user,
                typeof account === "string" ? tx.object(account) : account,
            ],
        });
    }

    leaveAccount(
        tx: Transaction,
        user: string,
        account: string,
    ): TransactionResult {
        return tx.moveCall({
            target: `${P2P_RAMP.V1}::p2p_ramp::leave`,
            arguments: [
                tx.object(user),
                tx.object(account),
            ],
        });
    }

    authenticate(
        tx: Transaction,
        account: string | TransactionArgument = this.id,
    ): TransactionResult {
        if (!account) {
            throw new Error("No account available: this.id is not set and no account was provided");
        }
        return tx.moveCall({
            target: `${P2P_RAMP.V1}::p2p_ramp::authenticate`,
            arguments: [
                typeof account === "string" ? tx.object(account) : account,
            ],
        });
    }

    emptyApprovedOutcome(
        tx: Transaction,
    ): TransactionResult {
        return tx.moveCall({
            target: `${P2P_RAMP.V1}::p2p_ramp::empty_approved_outcome`,
        });
    }

    requestedHandshakeOutcome(
        tx: Transaction,
        fiatSender: string,
        coinSender: string,
    ): TransactionResult {
        return tx.moveCall({
            target: `${P2P_RAMP.V1}::p2p_ramp::requested_handshake_outcome`,
            arguments: [
                tx.pure.address(fiatSender),
                tx.pure.address(coinSender),
            ],
        });
    }

    executeApprovedIntent(
        tx: Transaction,
        key: string,
        account: string | TransactionArgument = this.id,
    ): TransactionResult {
        if (!account) {
            throw new Error("No account available: this.id is not set and no account was provided");
        }
        return tx.moveCall({
            target: `${P2P_RAMP.V1}::p2p_ramp::execute_approved_intent`,
            arguments: [
                typeof account === "string" ? tx.object(account) : account,
                tx.pure.string(key),
                tx.object.clock,
            ],
        });
    }

    executeHandshakeIntent(
        tx: Transaction,
        key: string,
        account: string | TransactionArgument = this.id,
    ): TransactionResult {
        if (!account) {
            throw new Error("No account available: this.id is not set and no account was provided");
        }
        return tx.moveCall({
            target: `${P2P_RAMP.V1}::p2p_ramp::execute_handshake_intent`,
            arguments: [
                typeof account === "string" ? tx.object(account) : account,
                tx.pure.string(key),
                tx.object.clock,
            ],
        });
    }

    resolveHandshakeIntent(
        tx: Transaction,
        adminCap: string,
        key: string,
        account: string | TransactionArgument = this.id,
    ): TransactionResult {
        if (!account) {
            throw new Error("No account available: this.id is not set and no account was provided");
        }
        return tx.moveCall({
            target: `${P2P_RAMP.V1}::p2p_ramp::resolve_handshake_intent`,
            arguments: [
                tx.object(adminCap),
                typeof account === "string" ? tx.object(account) : account,
                tx.pure.string(key),
                tx.object.clock,
            ],
        });
    }
}

