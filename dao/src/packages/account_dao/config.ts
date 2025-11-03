/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/


/**
 * This module contains the logic for modifying the Dao configuration via an
 * intent.
 */

import { MoveTuple, MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as dao from './dao.js';
const $moduleName = '@account/dao::config';
export const ConfigDaoIntent = new MoveTuple({ name: `${$moduleName}::ConfigDaoIntent`, fields: [bcs.bool()] });
export const ConfigDaoAction = new MoveStruct({ name: `${$moduleName}::ConfigDaoAction`, fields: {
        config: dao.Dao
    } });
export interface RequestConfigDaoArguments {
    auth: RawTransactionArgument<string>;
    account: RawTransactionArgument<string>;
    params: RawTransactionArgument<string>;
    outcome: RawTransactionArgument<string>;
    authVotingPower: RawTransactionArgument<number | bigint>;
    unstakingCooldown: RawTransactionArgument<number | bigint>;
    votingRule: RawTransactionArgument<number>;
    maxVotingPower: RawTransactionArgument<number | bigint>;
    minimumVotes: RawTransactionArgument<number | bigint>;
    votingQuorum: RawTransactionArgument<number | bigint>;
}
export interface RequestConfigDaoOptions {
    package?: string;
    arguments: RequestConfigDaoArguments | [
        auth: RawTransactionArgument<string>,
        account: RawTransactionArgument<string>,
        params: RawTransactionArgument<string>,
        outcome: RawTransactionArgument<string>,
        authVotingPower: RawTransactionArgument<number | bigint>,
        unstakingCooldown: RawTransactionArgument<number | bigint>,
        votingRule: RawTransactionArgument<number>,
        maxVotingPower: RawTransactionArgument<number | bigint>,
        minimumVotes: RawTransactionArgument<number | bigint>,
        votingQuorum: RawTransactionArgument<number | bigint>
    ];
    typeArguments: [
        string
    ];
}
/**
 * No actions are defined as changing the config isn't supposed to be composable
 * for security reasons Requests new DAO settings.
 */
export function requestConfigDao(options: RequestConfigDaoOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        '0xb4cb9bfc37d340519e834165d6fc791ec279f756c2d3a3e2086ec22e09c04d3b::account::Auth',
        `0xb4cb9bfc37d340519e834165d6fc791ec279f756c2d3a3e2086ec22e09c04d3b::account::Account<${packageAddress}::dao::Dao>`,
        '0xb4cb9bfc37d340519e834165d6fc791ec279f756c2d3a3e2086ec22e09c04d3b::intents::Params',
        `${packageAddress}::dao::Votes`,
        'u64',
        'u64',
        'u8',
        'u64',
        'u64',
        'u64'
    ] satisfies string[];
    const parameterNames = ["auth", "account", "params", "outcome", "authVotingPower", "unstakingCooldown", "votingRule", "maxVotingPower", "minimumVotes", "votingQuorum"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'request_config_dao',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface ExecuteConfigDaoArguments {
    executable: RawTransactionArgument<string>;
    account: RawTransactionArgument<string>;
}
export interface ExecuteConfigDaoOptions {
    package?: string;
    arguments: ExecuteConfigDaoArguments | [
        executable: RawTransactionArgument<string>,
        account: RawTransactionArgument<string>
    ];
}
export function executeConfigDao(options: ExecuteConfigDaoOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `0xb4cb9bfc37d340519e834165d6fc791ec279f756c2d3a3e2086ec22e09c04d3b::executable::Executable<${packageAddress}::dao::Votes>`,
        `0xb4cb9bfc37d340519e834165d6fc791ec279f756c2d3a3e2086ec22e09c04d3b::account::Account<${packageAddress}::dao::Dao>`
    ] satisfies string[];
    const parameterNames = ["executable", "account"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'execute_config_dao',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface DeleteConfigDaoArguments {
    expired: RawTransactionArgument<string>;
}
export interface DeleteConfigDaoOptions {
    package?: string;
    arguments: DeleteConfigDaoArguments | [
        expired: RawTransactionArgument<string>
    ];
}
/** Deletes the action in an expired intent. */
export function deleteConfigDao(options: DeleteConfigDaoOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        '0xb4cb9bfc37d340519e834165d6fc791ec279f756c2d3a3e2086ec22e09c04d3b::intents::Expired'
    ] satisfies string[];
    const parameterNames = ["expired"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'config',
        function: 'delete_config_dao',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}