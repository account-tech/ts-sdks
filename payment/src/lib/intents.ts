import { Transaction, TransactionObjectInput, TransactionResult } from "@mysten/sui/transactions";
import * as config from "../.gen/account-payment/config/functions";
import * as pay from "../.gen/account-payment/pay/functions";
import * as accountProtocol from "../.gen/account-protocol/account/functions";
import * as intents from "../.gen/account-protocol/intents/functions";
import { ConfigPaymentAction } from "../.gen/account-payment/config/structs";
import { PayAction } from "../.gen/account-payment/pay/structs";

import { ConfigPaymentArgs, PayArgs, PaymentIntentTypes } from "./types";
import { Intent, CLOCK } from "@account.tech/core";
import { phantom } from "src/.gen/_framework/reified";
import { PAYMENT_FEES } from "./constants";

export class ConfigPaymentIntent extends Intent {
    static type = PaymentIntentTypes.ConfigPayment;
    declare args: ConfigPaymentArgs;

    async init() {
        const actions = await this.fetchActions(this.fields.actionsId);
        const configPaymentAction = ConfigPaymentAction.fromFieldsWithTypes(actions[0]);

        this.args = {
            members: configPaymentAction.config.members.contents.map((member) => ({
                address: member.key,
                roles: member.value.contents,
            })),
        };
    }

    request(
        tx: Transaction,
        _accountGenerics: [string, string], // can be anything, this is just to respect the interface
        auth: TransactionObjectInput,
        account: string,
        params: TransactionObjectInput,
        outcome: TransactionObjectInput,
        actionArgs: ConfigPaymentArgs,
    ): TransactionResult {
        let addrs: string[] = [];
        let roles: string[][] = [];
        if (actionArgs.members) {
            actionArgs.members.forEach((member) => {
                addrs.push(member.address);
                roles.push(member.roles);
            });
        }

        return config.requestConfigPayment(
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
    }

    execute(
        tx: Transaction,
        _accountGenerics: [string, string], // can be anything, this is just to respect the interface
        executable: TransactionObjectInput,
    ): TransactionResult {
        return config.executeConfigPayment(
            tx,
            {
                executable,
                account: this.account,
            }
        );
    }

    clearEmpty(
        tx: Transaction,
        accountGenerics: [string, string],
        account: TransactionObjectInput,
        key: string,
    ): TransactionResult {
        const expired = accountProtocol.destroyEmptyIntent(
            tx,
            accountGenerics,
            {
                account,
                key,
            }
        );
        config.deleteConfigPayment(
            tx,
            expired
        );
        return intents.destroyEmptyExpired(
            tx,
            expired,
        );
    }

    deleteExpired(
        tx: Transaction,
        accountGenerics: [string, string],
        account: TransactionObjectInput,
        key: string,
    ): TransactionResult {
        const expired = accountProtocol.deleteExpiredIntent(
            tx,
            accountGenerics,
            {
                account,
                key,
                clock: CLOCK,
            }
        );
        config.deleteConfigPayment(
            tx,
            expired
        );
        return intents.destroyEmptyExpired(
            tx,
            expired,
        );
    }
}

export class PayIntent extends Intent {
    static type = PaymentIntentTypes.Pay;
    declare args: PayArgs;

    async init() {
        const actions = await this.fetchActions(this.fields.actionsId);
        const coinType = actions[0].type.match(/<([^>]*)>/)[1];
        const payAction = PayAction.fromFieldsWithTypes(phantom(coinType), actions[0]);

        this.args = {
            paymentId: payAction.paymentId,
            coinType,
            amount: payAction.amount,
            issuedBy: payAction.issuedBy,
        };
    }

    request(
        tx: Transaction,
        _accountGenerics: [string, string], // can be anything, this is just to respect the interface
        auth: TransactionObjectInput,
        account: string,
        params: TransactionObjectInput,
        outcome: TransactionObjectInput,
        actionArgs: { coinType: string, amount: bigint },
    ): TransactionResult {
        return pay.requestPay(
            tx,
            actionArgs.coinType,
            {
                auth,
                account,
                params,
                outcome,
                amount: actionArgs.amount,
            }
        );
    }

    execute(
        tx: Transaction,
        _accountGenerics: [string, string], // can be anything, this is just to respect the interface
        executable: TransactionObjectInput,
        coin: TransactionObjectInput,
    ): TransactionResult {
        return pay.executePay(
            tx,
            this.args.coinType,
            {
                executable,
                account: this.account,
                coin,
                fees: PAYMENT_FEES,
                clock: CLOCK,
            }
        );
    }

    clearEmpty(
        tx: Transaction,
        accountGenerics: [string, string],
        account: TransactionObjectInput,
        key: string,
    ): TransactionResult {
        const expired = accountProtocol.destroyEmptyIntent(
            tx,
            accountGenerics,
            {
                account,
                key,
            }
        );
        pay.deletePay(
            tx,
            this.args.coinType,
            expired,
        );
        return intents.destroyEmptyExpired(
            tx,
            expired,
        );
    }

    deleteExpired(
        tx: Transaction,
        accountGenerics: [string, string],
        account: TransactionObjectInput,
        key: string,
    ): TransactionResult {
        const expired = accountProtocol.deleteExpiredIntent(
            tx,
            accountGenerics,
            {
                account,
                key,
                clock: CLOCK,
            }
        );
        pay.deletePay(
            tx,
            this.args.coinType,
            expired,
        );
        return intents.destroyEmptyExpired(
            tx,
            expired,
        );
    }
}