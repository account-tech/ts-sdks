import { coinWithBalance, Transaction, TransactionArgument } from "@mysten/sui/transactions";
import * as accountProtocol from "../.gen/account-protocol/account/functions";
import * as intents from "../.gen/account-protocol/intents/functions";

import { ConfigP2PRampArgs, FillBuyArgs, FillSellArgs, P2PRampIntentTypes } from "./types";
import { Intent, CLOCK } from "@account.tech/core";
import { FEES, P2P_RAMP } from "./constants";

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
        auth: TransactionArgument,
        account: string,
        params: TransactionArgument,
        outcome: TransactionArgument,
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
        executable: TransactionArgument,
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
            orderId: actions[0].fields.orderId,
            coinType,
            coinAmount: actions[0].fields.amount,
            taker: actions[0].fields.taker,
        };
    }

    request(
        tx: Transaction,
        _accountGenerics: null,
        _auth: null,
        account: string,
        params: TransactionArgument,
        outcome: TransactionArgument,
        actionArgs: FillBuyArgs,
    ) {
        tx.moveCall(
            {
                target: `${P2P_RAMP.V1}::orders::request_fill_buy_intent`,
                typeArguments: [actionArgs.coinType],
                arguments: [
                    params,
                    outcome,
                    tx.object(account),
                    tx.pure.address(actionArgs.orderId),
                    coinWithBalance({
                        balance: actionArgs.coinAmount,
                        type: actionArgs.coinType,
                    }),
                ],
            }
        );
    }

    execute(
        tx: Transaction,
        _accountGenerics: null,
        executable: TransactionArgument,
    ) {
        tx.moveCall({
            target: `${P2P_RAMP.V1}::orders::execute_fill_buy_intent`,
            arguments: [
                executable,
                tx.object(this.account),
                tx.object(FEES),
            ],
        });
    }

    clearEmpty(
        tx: Transaction,
        accountGenerics: [string, string],
        key: string,
    ) {
        // const expired = accountProtocol.destroyEmptyIntent(
        //     tx,
        //     accountGenerics,
        //     {
        //         account: this.account,
        //         key,
        //     }
        // );
        // tx.moveCall({
        //     target: `${P2P_RAMP.V1}::orders::delete_fill_buy`,
        //     arguments: [
        //         expired,
        //     ],
        // });
        // return intents.destroyEmptyExpired(
        //     tx,
        //     expired,
        // );
    }

    deleteExpired(
        tx: Transaction,
        accountGenerics: [string, string],
        key: string,
    ) {
        // const expired = accountProtocol.deleteExpiredIntent(
        //     tx,
        //     accountGenerics,
        //     {
        //         account: this.account,
        //         key,
        //         clock: CLOCK,
        //     }
        // );
        // tx.moveCall({
        //     target: `${P2P_RAMP.V1}::orders::delete_fill_buy`,
        //     arguments: [
        //         expired,
        //     ],
        // });
        // return intents.destroyEmptyExpired(
        //     tx,
        //     expired,
        // );
    }
}

export class FillSellIntent extends Intent {
    static type = P2PRampIntentTypes.FillSellIntent;
    declare args: FillSellArgs & { taker: string };

    async init() {
        const actions = await this.fetchActions(this.fields.actionsId);
        const coinType = actions[0].type.match(/<([^>]*)>/)[1];

        this.args = {
            orderId: actions[0].fields.orderId,
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
        params: TransactionArgument,
        outcome: TransactionArgument,
        actionArgs: FillSellArgs,
    ) {
        tx.moveCall(
            {
                target: `${P2P_RAMP.V1}::orders::request_fill_sell_intent`,
                typeArguments: [actionArgs.coinType],
                arguments: [
                    params,
                    outcome,
                    tx.object(account),
                    tx.pure.address(actionArgs.orderId),
                    tx.pure.u64(actionArgs.fiatAmount),
                ],
            }
        );
    }

    execute(
        tx: Transaction,
        _accountGenerics: null,
        executable: TransactionArgument,
    ) {
        tx.moveCall({
            target: `${P2P_RAMP.V1}::orders::execute_fill_sell_intent`,
            arguments: [
                executable,
                tx.object(this.account),
                tx.object(FEES),
            ],
        });
    }

    clearEmpty(
        tx: Transaction,
        accountGenerics: [string, string],
        key: string,
    ) {
        // const expired = accountProtocol.destroyEmptyIntent(
        //     tx,
        //     accountGenerics,
        //     {
        //         account: this.account,
        //         key,
        //     }
        // );
        // tx.moveCall({
        //     target: `${P2P_RAMP.V1}::orders::delete_fill_buy`,
        //     arguments: [
        //         expired,
        //     ],
        // });
        // return intents.destroyEmptyExpired(
        //     tx,
        //     expired,
        // );
    }

    deleteExpired(
        tx: Transaction,
        accountGenerics: [string, string],
        key: string,
    ) {
        // const expired = accountProtocol.deleteExpiredIntent(
        //     tx,
        //     accountGenerics,
        //     {
        //         account: this.account,
        //         key,
        //         clock: CLOCK,
        //     }
        // );
        // tx.moveCall({
        //     target: `${P2P_RAMP.V1}::orders::delete_fill_buy`,
        //     arguments: [
        //         expired,
        //     ],
        // });
        // return intents.destroyEmptyExpired(
        //     tx,
        //     expired,
        // );
    }
}