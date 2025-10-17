/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as object from './deps/sui/object.js';
const $moduleName = '@account/multisig::fees';
export const Fees = new MoveStruct({ name: `${$moduleName}::Fees`, fields: {
        id: object.UID,
        amount: bcs.u64(),
        recipient: bcs.Address
    } });
export const AdminCap = new MoveStruct({ name: `${$moduleName}::AdminCap`, fields: {
        id: object.UID
    } });
export interface AmountArguments {
    fees: RawTransactionArgument<string>;
}
export interface AmountOptions {
    package?: string;
    arguments: AmountArguments | [
        fees: RawTransactionArgument<string>
    ];
}
export function amount(options: AmountOptions) {
    const packageAddress = options.package ?? '@account/multisig';
    const argumentsTypes = [
        `${packageAddress}::fees::Fees`
    ] satisfies string[];
    const parameterNames = ["fees"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'fees',
        function: 'amount',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface RecipientArguments {
    fees: RawTransactionArgument<string>;
}
export interface RecipientOptions {
    package?: string;
    arguments: RecipientArguments | [
        fees: RawTransactionArgument<string>
    ];
}
export function recipient(options: RecipientOptions) {
    const packageAddress = options.package ?? '@account/multisig';
    const argumentsTypes = [
        `${packageAddress}::fees::Fees`
    ] satisfies string[];
    const parameterNames = ["fees"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'fees',
        function: 'recipient',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface SetAmountArguments {
    _: RawTransactionArgument<string>;
    fees: RawTransactionArgument<string>;
    amount: RawTransactionArgument<number | bigint>;
}
export interface SetAmountOptions {
    package?: string;
    arguments: SetAmountArguments | [
        _: RawTransactionArgument<string>,
        fees: RawTransactionArgument<string>,
        amount: RawTransactionArgument<number | bigint>
    ];
}
export function setAmount(options: SetAmountOptions) {
    const packageAddress = options.package ?? '@account/multisig';
    const argumentsTypes = [
        `${packageAddress}::fees::AdminCap`,
        `${packageAddress}::fees::Fees`,
        'u64'
    ] satisfies string[];
    const parameterNames = ["_", "fees", "amount"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'fees',
        function: 'set_amount',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface SetRecipientArguments {
    _: RawTransactionArgument<string>;
    fees: RawTransactionArgument<string>;
    recipient: RawTransactionArgument<string>;
}
export interface SetRecipientOptions {
    package?: string;
    arguments: SetRecipientArguments | [
        _: RawTransactionArgument<string>,
        fees: RawTransactionArgument<string>,
        recipient: RawTransactionArgument<string>
    ];
}
export function setRecipient(options: SetRecipientOptions) {
    const packageAddress = options.package ?? '@account/multisig';
    const argumentsTypes = [
        `${packageAddress}::fees::AdminCap`,
        `${packageAddress}::fees::Fees`,
        'address'
    ] satisfies string[];
    const parameterNames = ["_", "fees", "recipient"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'fees',
        function: 'set_recipient',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}