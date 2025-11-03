/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/


/** Copied from https://github.com/interest-protocol/suitears */

import { type Transaction } from '@mysten/sui/transactions';
import { normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
export interface MulDivDownArguments {
    x: RawTransactionArgument<number | bigint>;
    y: RawTransactionArgument<number | bigint>;
    z: RawTransactionArgument<number | bigint>;
}
export interface MulDivDownOptions {
    package?: string;
    arguments: MulDivDownArguments | [
        x: RawTransactionArgument<number | bigint>,
        y: RawTransactionArgument<number | bigint>,
        z: RawTransactionArgument<number | bigint>
    ];
}
export function mulDivDown(options: MulDivDownOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        'u64',
        'u64',
        'u64'
    ] satisfies string[];
    const parameterNames = ["x", "y", "z"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'math',
        function: 'mul_div_down',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface Log2DownArguments {
    x: RawTransactionArgument<number | bigint>;
}
export interface Log2DownOptions {
    package?: string;
    arguments: Log2DownArguments | [
        x: RawTransactionArgument<number | bigint>
    ];
}
export function log2Down(options: Log2DownOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        'u256'
    ] satisfies string[];
    const parameterNames = ["x"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'math',
        function: 'log2_down',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface MinArguments {
    x: RawTransactionArgument<number | bigint>;
    y: RawTransactionArgument<number | bigint>;
}
export interface MinOptions {
    package?: string;
    arguments: MinArguments | [
        x: RawTransactionArgument<number | bigint>,
        y: RawTransactionArgument<number | bigint>
    ];
}
export function min(options: MinOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        'u64',
        'u64'
    ] satisfies string[];
    const parameterNames = ["x", "y"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'math',
        function: 'min',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface SqrtDownArguments {
    x: RawTransactionArgument<number | bigint>;
}
export interface SqrtDownOptions {
    package?: string;
    arguments: SqrtDownArguments | [
        x: RawTransactionArgument<number | bigint>
    ];
}
export function sqrtDown(options: SqrtDownOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        'u64'
    ] satisfies string[];
    const parameterNames = ["x"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'math',
        function: 'sqrt_down',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}