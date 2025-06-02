import { SUI_FRAMEWORK } from "@account.tech/core/types";
import { coinWithBalance, Transaction, TransactionArgument } from "@mysten/sui/transactions";
import { FEES, P2P_RAMP } from "./constants";

/// Deposits and locks a Cap object in the Account
export function createOrder(
    tx: Transaction,
    auth: TransactionArgument,
    account: TransactionArgument | string, 
    isBuy: boolean,
    fiatAmount: bigint,
    fiatCode: string,
    coinAmount: bigint,
    coinType: string,
    minFill: bigint,
    maxFill: bigint,
) {
    let coinBalance;
    if (isBuy) {
        coinBalance = tx.moveCall({
            target: `${SUI_FRAMEWORK}::balance::zero`,
            typeArguments: [coinType],
        });
    } else {
        const coin = coinWithBalance({
            balance: coinAmount,
            type: coinType,
        });
        coinBalance = tx.moveCall({
            target: `${SUI_FRAMEWORK}::coin::into_balance`,
            typeArguments: [coinType],
            arguments: [coin],
        });
    }

    tx.moveCall({
        target: `${P2P_RAMP.V1}::orders::create_order`,
        typeArguments: [coinType],
        arguments: [
            auth,
            tx.object(FEES),
            typeof account === "string" ? tx.object(account) : account,
            tx.pure.bool(isBuy),
            tx.pure.u64(fiatAmount),
            tx.pure.string(fiatCode),
            tx.pure.u64(coinAmount),
            tx.pure.u64(minFill),
            tx.pure.u64(maxFill),
            coinBalance,
        ],
    });
}

export function destroyOrder(
    tx: Transaction,
    auth: TransactionArgument,
    account: TransactionArgument | string,
    orderId: string,
    coinType: string,
) {
    tx.moveCall({
        target: `${P2P_RAMP.V1}::orders::destroy_order`,
        typeArguments: [coinType],
        arguments: [
            auth,
            typeof account === "string" ? tx.object(account) : account,
            tx.pure.address(orderId),
        ],
    });
}