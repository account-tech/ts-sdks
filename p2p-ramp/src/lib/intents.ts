// @ts-nocheck

import {coinWithBalance, Transaction, TransactionObjectArgument} from "@mysten/sui/transactions";
import * as accountProtocol from "../.gen/account-protocol/account/functions";
import * as intents from "../.gen/account-protocol/intents/functions";

import {ConfigP2PRampArgs, FillBuyArgs, FillSellArgs, P2PRampIntentTypes} from "./types";
import {CLOCK} from "@account.tech/core/types";
import {POLICY, P2P_RAMP, ORDER_REGISTRY} from "./constants";
import {Intent} from "@account.tech/core/lib/intents";

export class ConfigP2PRampIntent extends Intent {
    static type = P2PRampIntentTypes.ConfigP2PRamp;
    declare args: ConfigP2PRampArgs;

    async init() {
        const actions = await this.fetchActions(this.fields.actionsId);

        this.args = {
            members: actions[0].fields.config.fields.members.contents
        };
    }

    request(
        tx: Transaction,
        _accountGenerics: null,
        auth: TransactionObjectArgument,
        account: string,
        params: TransactionObjectArgument,
        outcome: TransactionObjectArgument,
        actionArgs: ConfigP2PRampArgs,
    ) {

        tx.moveCall(
            {
                target: `${P2P_RAMP.V1}::config::request_config_p2p_ramp`,
                arguments: [
                    auth,
                    params,
                    outcome,
                    tx.object(account),
                    tx.pure.vector("address", actionArgs.members),
                ],
            }
        );
    }

    execute(
        tx: Transaction,
        _accountGenerics: null,
        executable: TransactionObjectArgument,
    ) {
        tx.moveCall({
            target: `${P2P_RAMP.V1}::config::execute_config_p2p_ramp`,
            arguments: [
                executable,
                tx.object(this.account),
            ],
        });
    }

    clearEmpty(
        tx: Transaction,
        accountGenerics: [string, string],
        key: string,
    ) {
        const expired = accountProtocol.destroyEmptyIntent(
            tx,
            accountGenerics,
            {
                account: this.account,
                key,
            }
        );
        tx.moveCall({
            target: `${P2P_RAMP.V1}::config::delete_config_p2p_ramp`,
            arguments: [
                expired,
            ],
        });
        intents.destroyEmptyExpired(
            tx,
            expired,
        );
    }

    deleteExpired(
        tx: Transaction,
        accountGenerics: [string, string],
        key: string,
    ) {
        const expired = accountProtocol.deleteExpiredIntent(
            tx,
            accountGenerics,
            {
                account: this.account,
                key,
                clock: CLOCK,
            }
        );
        tx.moveCall({
            target: `${P2P_RAMP.V1}::config::delete_config_p2p_ramp`,
            arguments: [
                expired,
            ],
        });
        intents.destroyEmptyExpired(
            tx,
            expired,
        );
    }
}

export class FillBuyIntent extends Intent {
    static type = P2PRampIntentTypes.FillBuyIntent;
    declare args: FillBuyArgs & { taker: string };

    async init() {
        const actions = await this.fetchActions(this.fields.actionsId);
        const coinType = actions[0].type.match(/<([^>]*)>/)[1];

        this.args = {
            orderId: actions[0].fields.order_id,
            coinType,
            coinAmount: actions[0].fields.coin.fields.balance,
            taker: actions[0].fields.taker,
        };
    }

    request(
        tx: Transaction,
        _accountGenerics: null,
        _auth: null,
        account: string,
        outcome: TransactionObjectArgument,
        actionArgs: FillBuyArgs,
    ) {
        tx.moveCall(
            {
                target: `${P2P_RAMP.V1}::orders::request_fill_buy_order`,
                typeArguments: [actionArgs.coinType],
                arguments: [
                    tx.object(ORDER_REGISTRY),
                    outcome,
                    tx.object(account),
                    tx.pure.address(actionArgs.orderId),
                    coinWithBalance({
                        balance: actionArgs.coinAmount,
                        type: actionArgs.coinType,
                    }),
                    tx.object(CLOCK),
                ],
            }
        );
    }

    execute(
        tx: Transaction,
        _accountGenerics: null,
        executable: TransactionObjectArgument,
    ) {
        tx.moveCall({
            target: `${P2P_RAMP.V1}::orders::execute_fill_buy_order`,
            typeArguments: [this.args.coinType],
            arguments: [
                tx.object(ORDER_REGISTRY),
                executable,
                tx.object(this.account),
                tx.object(POLICY),
            ],
        });
    }

    //! both methods not functioning right now
    clearEmpty(
        tx: Transaction,
        accountGenerics: [string, string],
        key: string,
    ) {
        const expired = accountProtocol.destroyEmptyIntent(
            tx,
            accountGenerics,
            {
                account: this.account,
                key,
            }
        );
        tx.moveCall({
            target: `${P2P_RAMP.V1}::orders::delete_fill_buy`,
            typeArguments: [this.args.coinType],
            arguments: [
                expired,
            ],
        });
        return intents.destroyEmptyExpired(
            tx,
            expired,
        );
    }

    deleteExpired(
        tx: Transaction,
        accountGenerics: [string, string],
        key: string,
    ) {
        const expired = accountProtocol.deleteExpiredIntent(
            tx,
            accountGenerics,
            {
                account: this.account,
                key,
                clock: CLOCK,
            }
        );
        tx.moveCall({
            target: `${P2P_RAMP.V1}::orders::delete_fill_buy`,
            typeArguments: [this.args.coinType],
            arguments: [
                expired,
            ],
        });
        return intents.destroyEmptyExpired(
            tx,
            expired,
        );
    }
}

export class FillSellIntent extends Intent {
    static type = P2PRampIntentTypes.FillSellIntent;
    declare args: FillSellArgs & { taker: string };

    async init() {
        const actions = await this.fetchActions(this.fields.actionsId);
        const coinType = actions[0].type.match(/<([^>]*)>/)[1];

        this.args = {
            orderId: actions[0].fields.order_id,
            coinType,
            fiatAmount: actions[0].fields.amount,
            taker: actions[0].fields.taker,
        };
    }

    request(
        tx: Transaction,
        _accountGenerics: null,
        _auth: null,
        account: string,
        outcome: TransactionObjectArgument,
        actionArgs: FillSellArgs,
    ) {
        tx.moveCall(
            {
                target: `${P2P_RAMP.V1}::orders::request_fill_sell_order`,
                typeArguments: [actionArgs.coinType],
                arguments: [
                    tx.object(ORDER_REGISTRY),
                    outcome,
                    tx.object(account),
                    tx.pure.address(actionArgs.orderId),
                    tx.pure.u64(actionArgs.fiatAmount),
                    tx.object(CLOCK),
                ],
            }
        );
    }

    execute(
        tx: Transaction,
        _accountGenerics: null,
        executable: TransactionObjectArgument,
    ) {
        tx.moveCall({
            target: `${P2P_RAMP.V1}::orders::execute_fill_sell_order`,
            typeArguments: [this.args.coinType],
            arguments: [
                tx.object(ORDER_REGISTRY),
                executable,
                tx.object(this.account),
                tx.object(POLICY),
            ],
        });
    }

    //! both methods not functioning right now
    clearEmpty(
        tx: Transaction,
        accountGenerics: [string, string],
        key: string,
    ) {
        const expired = accountProtocol.destroyEmptyIntent(
            tx,
            accountGenerics,
            {
                account: this.account,
                key,
            }
        );
        tx.moveCall({
            target: `${P2P_RAMP.V1}::orders::delete_fill_sell`,
            arguments: [
                expired,
            ],
        });
        return intents.destroyEmptyExpired(
            tx,
            expired,
        );
    }

    deleteExpired(
        tx: Transaction,
        accountGenerics: [string, string],
        key: string,
    ) {
        const expired = accountProtocol.deleteExpiredIntent(
            tx,
            accountGenerics,
            {
                account: this.account,
                key,
                clock: CLOCK,
            }
        );
        tx.moveCall({
            target: `${P2P_RAMP.V1}::orders::delete_fill_sell`,
            arguments: [
                expired,
            ],
        });
        return intents.destroyEmptyExpired(
            tx,
            expired,
        );
    }
}