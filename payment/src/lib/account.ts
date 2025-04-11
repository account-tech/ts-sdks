import { Transaction, TransactionArgument, TransactionObjectInput, TransactionResult } from "@mysten/sui/transactions";
import { Account as AccountRaw } from "../.gen/account-protocol/account/structs";
import { destroyEmptyIntent, confirmExecution } from "../.gen/account-protocol/account/functions";
import { Payment as PaymentRaw } from "../.gen/account-payment/payment/structs";
import { newAccount } from "../.gen/account-payment/payment/functions";
import * as configPayment from "../.gen/account-payment/config/functions";
import { approveIntent, disapproveIntent, executeIntent, authenticate, emptyOutcome, sendInvite, join, leave } from "../.gen/account-payment/payment/functions";
import { destroyEmptyExpired } from "../.gen/account-protocol/intents/functions";
import { DepFields } from "../.gen/account-protocol/deps/structs";
import { Fees as FeesRaw } from "../.gen/account-payment/fees/structs";

import { User, Account, Intent, Dep, ACCOUNT_PROTOCOL, CLOCK, EXTENSIONS, SUI_FRAMEWORK, TransactionPureInput } from "@account.tech/core";
import { MemberProfile, PaymentData, ConfigPaymentArgs } from "./types";
import { PAYMENT_FEES, PAYMENT_GENERICS, PAYMENT_CONFIG_TYPE } from "./constants";

export class Payment extends Account implements PaymentData {
    static type = PAYMENT_CONFIG_TYPE;

    members: MemberProfile[] = [];
    fees: Record<string, bigint> = {};

    async init(id?: string): Promise<void> {
        if (id) {
            this.id = id;
            await this.refresh();
        } else {
            this.fees = await this.fetchFees();
        }
    }

    async fetch(id: string = this.id): Promise<PaymentData> {
        if (!id && !this.id) {
            throw new Error("No address provided to refresh multisig");
        }

        const accountReified = AccountRaw.r(PaymentRaw.r);
        const paymentAccount = await accountReified.fetch(this.client, id);

        // get metadata
        const metadata = paymentAccount.metadata.inner.contents.map((m: any) => ({ key: m.key, value: m.value }));

        // get deps
        const deps: Dep[] = paymentAccount.deps.inner.map((dep: DepFields) => {
            return { name: dep.name, addr: dep.addr, version: Number(dep.version) };
        });

        // get all members" data (from account and member)
        const members = await Promise.all(paymentAccount.config.members.contents.map(async member => {
            const user = await User.init(this.client, PAYMENT_CONFIG_TYPE);
            const { username, avatar } = await user.fetchProfile(member.key);
            return {
                address: member.key,
                username,
                avatar, 
                roles: member.value.contents
            }
        }));

        return {
            id: paymentAccount.id,
            metadata,
            deps,
            unverifiedDepsAllowed: paymentAccount.deps.unverifiedAllowed,
            lockedObjects: paymentAccount.intents.locked.contents,
            intentsBagId: paymentAccount.intents.inner.id,
            members,
        }
    }

    async fetchFees(): Promise<Record<string, bigint>> {
        const fees = await FeesRaw.fetch(this.client, PAYMENT_FEES);
        return Object.fromEntries(fees.inner.contents.map(entry => [entry.key, entry.value]));
    }

    async refresh(id: string = this.id) {
        this.setData(await this.fetch(id));
        this.fees = await this.fetchFees();
    }

    setData(payment: PaymentData) {
        this.id = payment.id;
        this.metadata = payment.metadata;
        this.deps = payment.deps;
        this.unverifiedDepsAllowed = payment.unverifiedDepsAllowed;
        this.lockedObjects = payment.lockedObjects;
        this.intentsBagId = payment.intentsBagId;
        this.members = payment.members;
    }

    getData(): PaymentData {
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

    member(addr: string): MemberProfile {
        const member = this.members?.find(m => m.address == addr);
        if (!member) {
            throw new Error(`Member with address ${addr} not found.`);
        }
        return member;
    }


    newPaymentAccount(
        tx: Transaction,
    ): TransactionResult {
        return newAccount(
            tx,
            EXTENSIONS,
        );
    }

    sharePaymentAccount(
        tx: Transaction,
        account: TransactionArgument,
    ): TransactionResult {
        return tx.moveCall({
            package: SUI_FRAMEWORK,
            module: "transfer",
            function: "public_share_object",
            typeArguments: [`${ACCOUNT_PROTOCOL.V1}::account::Account<${PAYMENT_GENERICS[0]}>`],
            arguments: [account],
        });
    }

    joinPaymentAccount(
        tx: Transaction,
        user: TransactionPureInput,
        account: TransactionObjectInput = this.id,
    ): TransactionResult {
        if (!account) {
            throw new Error("No account available: this.id is not set and no account was provided");
        }
        return join(tx, { user, account });
    }

    leavePaymentAccount(
        tx: Transaction,
        user: TransactionObjectInput,
        account: TransactionObjectInput = this.id,
    ): TransactionResult {
        if (!account) {
            throw new Error("No account available: this.id is not set and no account was provided");
        }
        return leave(tx, { user, account });
    }

    sendInvite(
        tx: Transaction,
        recipient: string,
        account: TransactionObjectInput = this.id,
    ): TransactionResult {
        if (!account) {
            throw new Error("No account available: this.id is not set and no account was provided");
        }
        return sendInvite(tx, { account, recipient });
    }

    authenticate(
        tx: Transaction,
        account: TransactionObjectInput = this.id,
    ): TransactionResult {
        if (!account) {
            throw new Error("No account available: this.id is not set and no account was provided");
        }
        return authenticate(tx, account);
    }

    emptyApprovalsOutcome(
        tx: Transaction
    ): TransactionResult {
        return emptyOutcome(tx);
    }

    approveIntent(
        tx: Transaction,
        key: TransactionPureInput,
        account: TransactionObjectInput = this.id,
    ): TransactionResult {
        if (!account) {
            throw new Error("No account available: this.id is not set and no account was provided");
        }
        return approveIntent(tx, { account, key });
    }

    disapproveIntent(
        tx: Transaction,
        key: string,
        account: TransactionObjectInput = this.id,
    ): TransactionResult {
        if (!account) {
            throw new Error("No account available: this.id is not set and no account was provided");
        }
        return disapproveIntent(tx, { account, key });
    }

    executeIntent(
        tx: Transaction,
        key: string,
        account: TransactionObjectInput = this.id,
    ): TransactionResult {
        if (!account) {
            throw new Error("No account available: this.id is not set and no account was provided");
        }
        return executeIntent(tx, { account, key, clock: CLOCK });
    }

    // === Atomic Intents ===

    atomicConfigPaymentAccount(
        tx: Transaction,
        actionsArgs: ConfigPaymentArgs,
        account: TransactionObjectInput = this.id,
    ): TransactionResult {
        if (!account) {
            throw new Error("No account available: this.id is not set and no account was provided");
        }

        let addrs: string[] = [];
        let roles: string[][] = [];
        if (actionsArgs.members) {
            actionsArgs.members.forEach((member) => {
                addrs.push(member.address);
                roles.push(member.roles);
            });
        }

        const auth = this.authenticate(tx, account);
        const params = Intent.createParams(tx, { key: "config-payment" });
        const outcome = this.emptyApprovalsOutcome(tx);

        configPayment.requestConfigPayment(
            tx,
            {
                auth,
                account,
                params,
                outcome,
                addrs,
                roles,
            }
        );

        this.approveIntent(tx, "config-payment", account);
        const executable = this.executeIntent(tx, "config-payment", account);
        configPayment.executeConfigPayment(tx, { executable, account });
        confirmExecution(tx, PAYMENT_GENERICS, { account, executable });

        const expired = destroyEmptyIntent(tx, PAYMENT_GENERICS, { account, key: "config-payment" });
        configPayment.deleteConfigPayment(tx, expired);
        return destroyEmptyExpired(tx, expired);
    }
}

