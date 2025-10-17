/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/


/**
 * This module contains the logic for modifying the Multisig configuration via an
 * intent.
 */

import { MoveTuple, MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as multisig from './multisig.js';
const $moduleName = '@account/multisig::config';
export const ConfigMultisigIntent = new MoveTuple({ name: `${$moduleName}::ConfigMultisigIntent`, fields: [bcs.bool()] });
export const ConfigMultisigAction = new MoveStruct({ name: `${$moduleName}::ConfigMultisigAction`, fields: {
        config: multisig.Multisig
    } });
export interface RequestConfigMultisigArguments {
    auth: RawTransactionArgument<string>;
    account: RawTransactionArgument<string>;
    params: RawTransactionArgument<string>;
    outcome: RawTransactionArgument<string>;
    addresses: RawTransactionArgument<string[]>;
    weights: RawTransactionArgument<number | bigint[]>;
    roles: RawTransactionArgument<string[][]>;
    global: RawTransactionArgument<number | bigint>;
    roleNames: RawTransactionArgument<string[]>;
    roleThresholds: RawTransactionArgument<number | bigint[]>;
}
export interface RequestConfigMultisigOptions {
    package?: string;
    arguments: RequestConfigMultisigArguments | [
        auth: RawTransactionArgument<string>,
        account: RawTransactionArgument<string>,
        params: RawTransactionArgument<string>,
        outcome: RawTransactionArgument<string>,
        addresses: RawTransactionArgument<string[]>,
        weights: RawTransactionArgument<number | bigint[]>,
        roles: RawTransactionArgument<string[][]>,
        global: RawTransactionArgument<number | bigint>,
        roleNames: RawTransactionArgument<string[]>,
        roleThresholds: RawTransactionArgument<number | bigint[]>
    ];
}
/**
 * No actions are defined as changing the config isn't supposed to be composable
 * for security reasons Requests new Multisig settings.
 */
export function requestConfigMultisig(options: RequestConfigMultisigOptions) {
    const packageAddress = options.package ?? '@account/multisig';
    const argumentsTypes = [
        '0xc967e077f5b0f892658d854d5a454f8ed84027d9afd3cab26a5e6d6004637145::account::Auth',
        `0xc967e077f5b0f892658d854d5a454f8ed84027d9afd3cab26a5e6d6004637145::account::Account<${packageAddress}::multisig::Multisig>`,
        '0xc967e077f5b0f892658d854d5a454f8ed84027d9afd3cab26a5e6d6004637145::intents::Params',
        `${packageAddress}::multisig::Approvals`,
        'vector<address>',
        'vector<u64>',
        'vector<vector<0x0000000000000000000000000000000000000000000000000000000000000001::string::String>>',
        'u64',
        'vector<0x0000000000000000000000000000000000000000000000000000000000000001::string::String>',
        'vector<u64>'
    ] satisfies string[];
    const parameterNames = ["auth", "account", "params", "outcome", "addresses", "weights", "roles", "global", "roleNames", "roleThresholds"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'request_config_multisig',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ExecuteConfigMultisigArguments {
    executable: RawTransactionArgument<string>;
    account: RawTransactionArgument<string>;
}
export interface ExecuteConfigMultisigOptions {
    package?: string;
    arguments: ExecuteConfigMultisigArguments | [
        executable: RawTransactionArgument<string>,
        account: RawTransactionArgument<string>
    ];
}
/** Executes the action and modifies the Account Multisig. */
export function executeConfigMultisig(options: ExecuteConfigMultisigOptions) {
    const packageAddress = options.package ?? '@account/multisig';
    const argumentsTypes = [
        `0xc967e077f5b0f892658d854d5a454f8ed84027d9afd3cab26a5e6d6004637145::executable::Executable<${packageAddress}::multisig::Approvals>`,
        `0xc967e077f5b0f892658d854d5a454f8ed84027d9afd3cab26a5e6d6004637145::account::Account<${packageAddress}::multisig::Multisig>`
    ] satisfies string[];
    const parameterNames = ["executable", "account"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'execute_config_multisig',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface DeleteConfigMultisigArguments {
    expired: RawTransactionArgument<string>;
}
export interface DeleteConfigMultisigOptions {
    package?: string;
    arguments: DeleteConfigMultisigArguments | [
        expired: RawTransactionArgument<string>
    ];
}
/** Deletes the action in an expired intent. */
export function deleteConfigMultisig(options: DeleteConfigMultisigOptions) {
    const packageAddress = options.package ?? '@account/multisig';
    const argumentsTypes = [
        '0xc967e077f5b0f892658d854d5a454f8ed84027d9afd3cab26a5e6d6004637145::intents::Expired'
    ] satisfies string[];
    const parameterNames = ["expired"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'delete_config_multisig',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}