/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/


/**
 * This module defines the DAO configuration and Votes proposal logic for
 * account.tech. Proposals can be executed once the role threshold is reached
 * (similar to multisig) or if the DAO rules are met.
 * 
 * The DAO can be configured with:
 * 
 * - a specific asset type for voting
 * - a cooldown for unstaking (this will decrease the voting power linearly over
 *   time)
 * - a voting rule (linear or quadratic, more can be added in the future)
 * - a maximum voting power that can be used in a single vote
 * - a minimum number of votes needed to pass a proposal (can be 0)
 * - a global voting threshold between (0, 1e9], If 50% votes needed, then should
 *   be > 500_000_000
 * 
 * Participants have to stake their assets to construct a Vote object. They can
 * stake their assets at any time, but they will have to wait for the cooldown
 * period to pass before they can unstake them. Staked assets can be pushed into a
 * Vote object, to vote on a proposal. This object can be unpacked once the vote
 * ends. New assets can be added during vote, and vote can be changed.
 * 
 * Alternatively, roles can be added to the DAO with a specific threshold, then
 * roles can be assigned to members Members with the role can approve the proposals
 * which can be executed once the role threshold is reached
 */

import { MoveStruct, MoveTuple, MoveEnum, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs, type BcsType } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as vec_set from './deps/sui/vec_set.js';
import * as type_name from './deps/std/type_name.js';
import * as object from './deps/sui/object.js';
import * as table from './deps/sui/table.js';
import * as vec_map from './deps/sui/vec_map.js';
const $moduleName = '@account/dao::dao';
export const Group = new MoveStruct({ name: `${$moduleName}::Group`, fields: {
        threshold: bcs.u64(),
        addrs: vec_set.VecSet(bcs.Address),
        roles: vec_set.VecSet(bcs.string())
    } });
export const Dao = new MoveStruct({ name: `${$moduleName}::Dao`, fields: {
        groups: bcs.vector(Group),
        asset_type: type_name.TypeName,
        auth_voting_power: bcs.u64(),
        unstaking_cooldown: bcs.u64(),
        voting_rule: bcs.u8(),
        max_voting_power: bcs.u64(),
        minimum_votes: bcs.u64(),
        voting_quorum: bcs.u64()
    } });
export const ConfigWitness = new MoveTuple({ name: `${$moduleName}::ConfigWitness`, fields: [bcs.bool()] });
export const Registry = new MoveStruct({ name: `${$moduleName}::Registry`, fields: {
        id: object.UID,
        daos: table.Table
    } });
export const Votes = new MoveStruct({ name: `${$moduleName}::Votes`, fields: {
        start_time: bcs.u64(),
        end_time: bcs.u64(),
        results: vec_map.VecMap(bcs.u8(), bcs.u64())
    } });
export function Adapter<Asset extends BcsType<any>>(...typeParameters: [
    Asset
]) {
    return new MoveEnum({ name: `${$moduleName}::Adapter<${typeParameters[0].name as Asset['name']}>`, fields: {
            Fungible: typeParameters[0],
            NonFungible: bcs.vector(typeParameters[0])
        } });
}
/** Staked asset, can be unstaked after the vote ends, according to the DAO cooldown */
export function Staked<Asset extends BcsType<any>>(...typeParameters: [
    Asset
]) {
    return new MoveStruct({ name: `${$moduleName}::Staked<${typeParameters[0].name as Asset['name']}>`, fields: {
            id: object.UID,
            dao_addr: bcs.Address,
            value: bcs.u64(),
            unstaked: bcs.option(bcs.u64()),
            asset: Adapter(typeParameters[0])
        } });
}
/**
 * Object wrapping the staked assets used for voting in a specific dao Staked
 * assets cannot be retrieved during the voting period
 */
export function Vote<Asset extends BcsType<any>>(...typeParameters: [
    Asset
]) {
    return new MoveStruct({ name: `${$moduleName}::Vote<${typeParameters[0].name as Asset['name']}>`, fields: {
            id: object.UID,
            dao_addr: bcs.Address,
            intent_key: bcs.string(),
            answer: bcs.option(bcs.u8()),
            power: bcs.u64(),
            vote_end: bcs.u64(),
            staked: Staked(typeParameters[0])
        } });
}
export interface NewAccountArguments {
    registry: RawTransactionArgument<string>;
    extensions: RawTransactionArgument<string>;
    authVotingPower: RawTransactionArgument<number | bigint>;
    unstakingCooldown: RawTransactionArgument<number | bigint>;
    votingRule: RawTransactionArgument<number>;
    maxVotingPower: RawTransactionArgument<number | bigint>;
    minimumVotes: RawTransactionArgument<number | bigint>;
    votingQuorum: RawTransactionArgument<number | bigint>;
}
export interface NewAccountOptions {
    package?: string;
    arguments: NewAccountArguments | [
        registry: RawTransactionArgument<string>,
        extensions: RawTransactionArgument<string>,
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
/** Init and returns a new Account object */
export function newAccount(options: NewAccountOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Registry`,
        '0xce60a8a677814b1aae0aca19b49ccf35859dc5522aa407a74aaa55f28b0e641f::extensions::Extensions',
        'u64',
        'u64',
        'u8',
        'u64',
        'u64',
        'u64'
    ] satisfies string[];
    const parameterNames = ["registry", "extensions", "authVotingPower", "unstakingCooldown", "votingRule", "maxVotingPower", "minimumVotes", "votingQuorum"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'new_account',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface AddMetadataArguments {
    account: RawTransactionArgument<string>;
    keys: RawTransactionArgument<string[]>;
    values: RawTransactionArgument<string[]>;
}
export interface AddMetadataOptions {
    package?: string;
    arguments: AddMetadataArguments | [
        account: RawTransactionArgument<string>,
        keys: RawTransactionArgument<string[]>,
        values: RawTransactionArgument<string[]>
    ];
}
/**
 * Takes the Account by value (only possible before sharing) to add metadata
 * without requiring auth
 */
export function addMetadata(options: AddMetadataOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `0xb4cb9bfc37d340519e834165d6fc791ec279f756c2d3a3e2086ec22e09c04d3b::account::Account<${packageAddress}::dao::Dao>`,
        'vector<0x0000000000000000000000000000000000000000000000000000000000000001::string::String>',
        'vector<0x0000000000000000000000000000000000000000000000000000000000000001::string::String>'
    ] satisfies string[];
    const parameterNames = ["account", "keys", "values"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'add_metadata',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface AuthenticateArguments {
    staked: RawTransactionArgument<string>;
    account: RawTransactionArgument<string>;
}
export interface AuthenticateOptions {
    package?: string;
    arguments: AuthenticateArguments | [
        staked: RawTransactionArgument<string>,
        account: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Authenticates the caller as a member (!= participant) of the DAO */
export function authenticate(options: AuthenticateOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Staked<${options.typeArguments[0]}>`,
        `0xb4cb9bfc37d340519e834165d6fc791ec279f756c2d3a3e2086ec22e09c04d3b::account::Account<${packageAddress}::dao::Dao>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["staked", "account"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'authenticate',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface EmptyVotesOutcomeArguments {
    startTime: RawTransactionArgument<number | bigint>;
    endTime: RawTransactionArgument<number | bigint>;
}
export interface EmptyVotesOutcomeOptions {
    package?: string;
    arguments: EmptyVotesOutcomeArguments | [
        startTime: RawTransactionArgument<number | bigint>,
        endTime: RawTransactionArgument<number | bigint>
    ];
}
/** Creates a new outcome to initiate a proposal */
export function emptyVotesOutcome(options: EmptyVotesOutcomeOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        'u64',
        'u64',
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["startTime", "endTime"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'empty_votes_outcome',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface NewStakedCoinArguments {
    account: RawTransactionArgument<string>;
}
export interface NewStakedCoinOptions {
    package?: string;
    arguments: NewStakedCoinArguments | [
        account: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Stakes a coin and get its value */
export function newStakedCoin(options: NewStakedCoinOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `0xb4cb9bfc37d340519e834165d6fc791ec279f756c2d3a3e2086ec22e09c04d3b::account::Account<${packageAddress}::dao::Dao>`
    ] satisfies string[];
    const parameterNames = ["account"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'new_staked_coin',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface NewStakedObjectArguments {
    account: RawTransactionArgument<string>;
}
export interface NewStakedObjectOptions {
    package?: string;
    arguments: NewStakedObjectArguments | [
        account: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Stakes the asset and adds 1 as value */
export function newStakedObject(options: NewStakedObjectOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `0xb4cb9bfc37d340519e834165d6fc791ec279f756c2d3a3e2086ec22e09c04d3b::account::Account<${packageAddress}::dao::Dao>`
    ] satisfies string[];
    const parameterNames = ["account"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'new_staked_object',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface StakeCoinArguments {
    staked: RawTransactionArgument<string>;
    coin: RawTransactionArgument<string>;
}
export interface StakeCoinOptions {
    package?: string;
    arguments: StakeCoinArguments | [
        staked: RawTransactionArgument<string>,
        coin: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function stakeCoin(options: StakeCoinOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Staked<0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<${options.typeArguments[0]}>>`,
        `0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["staked", "coin"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'stake_coin',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface StakeObjectArguments<Asset extends BcsType<any>> {
    staked: RawTransactionArgument<string>;
    asset: RawTransactionArgument<Asset>;
}
export interface StakeObjectOptions<Asset extends BcsType<any>> {
    package?: string;
    arguments: StakeObjectArguments<Asset> | [
        staked: RawTransactionArgument<string>,
        asset: RawTransactionArgument<Asset>
    ];
    typeArguments: [
        string
    ];
}
export function stakeObject<Asset extends BcsType<any>>(options: StakeObjectOptions<Asset>) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Staked<${options.typeArguments[0]}>`,
        `${options.typeArguments[0]}`
    ] satisfies string[];
    const parameterNames = ["staked", "asset"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'stake_object',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface MergeStakedCoinArguments {
    staked: RawTransactionArgument<string>;
    toMerge: RawTransactionArgument<string>;
}
export interface MergeStakedCoinOptions {
    package?: string;
    arguments: MergeStakedCoinArguments | [
        staked: RawTransactionArgument<string>,
        toMerge: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function mergeStakedCoin(options: MergeStakedCoinOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Staked<0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<${options.typeArguments[0]}>>`,
        `${packageAddress}::dao::Staked<0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<${options.typeArguments[0]}>>`
    ] satisfies string[];
    const parameterNames = ["staked", "toMerge"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'merge_staked_coin',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface MergeStakedObjectArguments {
    staked: RawTransactionArgument<string>;
    toMerge: RawTransactionArgument<string>;
}
export interface MergeStakedObjectOptions {
    package?: string;
    arguments: MergeStakedObjectArguments | [
        staked: RawTransactionArgument<string>,
        toMerge: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function mergeStakedObject(options: MergeStakedObjectOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Staked<${options.typeArguments[0]}>`,
        `${packageAddress}::dao::Staked<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["staked", "toMerge"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'merge_staked_object',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface SplitStakedCoinArguments {
    staked: RawTransactionArgument<string>;
    toSplit: RawTransactionArgument<number | bigint>;
}
export interface SplitStakedCoinOptions {
    package?: string;
    arguments: SplitStakedCoinArguments | [
        staked: RawTransactionArgument<string>,
        toSplit: RawTransactionArgument<number | bigint>
    ];
    typeArguments: [
        string
    ];
}
export function splitStakedCoin(options: SplitStakedCoinOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Staked<0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<${options.typeArguments[0]}>>`,
        'u64'
    ] satisfies string[];
    const parameterNames = ["staked", "toSplit"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'split_staked_coin',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface SplitStakedObjectArguments {
    staked: RawTransactionArgument<string>;
    toSplit: RawTransactionArgument<string[]>;
}
export interface SplitStakedObjectOptions {
    package?: string;
    arguments: SplitStakedObjectArguments | [
        staked: RawTransactionArgument<string>,
        toSplit: RawTransactionArgument<string[]>
    ];
    typeArguments: [
        string
    ];
}
export function splitStakedObject(options: SplitStakedObjectOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Staked<${options.typeArguments[0]}>`,
        'vector<0x0000000000000000000000000000000000000000000000000000000000000002::object::ID>'
    ] satisfies string[];
    const parameterNames = ["staked", "toSplit"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'split_staked_object',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface UnstakeArguments {
    staked: RawTransactionArgument<string>;
    account: RawTransactionArgument<string>;
}
export interface UnstakeOptions {
    package?: string;
    arguments: UnstakeArguments | [
        staked: RawTransactionArgument<string>,
        account: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Starts cooldown for the staked asset */
export function unstake(options: UnstakeOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Staked<${options.typeArguments[0]}>`,
        `0xb4cb9bfc37d340519e834165d6fc791ec279f756c2d3a3e2086ec22e09c04d3b::account::Account<${packageAddress}::dao::Dao>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["staked", "account"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'unstake',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface ClaimCoinArguments {
    staked: RawTransactionArgument<string>;
}
export interface ClaimCoinOptions {
    package?: string;
    arguments: ClaimCoinArguments | [
        staked: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Retrieves the coin after cooldown */
export function claimCoin(options: ClaimCoinOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Staked<0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<${options.typeArguments[0]}>>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["staked"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'claim_coin',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface ClaimObjectsArguments {
    staked: RawTransactionArgument<string>;
}
export interface ClaimObjectsOptions {
    package?: string;
    arguments: ClaimObjectsArguments | [
        staked: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Retrieves the objects after cooldown */
export function claimObjects(options: ClaimObjectsOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Staked<${options.typeArguments[0]}>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["staked"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'claim_objects',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface ClaimAndKeepArguments {
    staked: RawTransactionArgument<string>;
}
export interface ClaimAndKeepOptions {
    package?: string;
    arguments: ClaimAndKeepArguments | [
        staked: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/** Retrieves the staked asset after cooldown */
export function claimAndKeep(options: ClaimAndKeepOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Staked<${options.typeArguments[0]}>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["staked"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'claim_and_keep',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface NewVoteArguments {
    account: RawTransactionArgument<string>;
    intentKey: RawTransactionArgument<string>;
    staked: RawTransactionArgument<string>;
}
export interface NewVoteOptions {
    package?: string;
    arguments: NewVoteArguments | [
        account: RawTransactionArgument<string>,
        intentKey: RawTransactionArgument<string>,
        staked: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function newVote(options: NewVoteOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `0xb4cb9bfc37d340519e834165d6fc791ec279f756c2d3a3e2086ec22e09c04d3b::account::Account<${packageAddress}::dao::Dao>`,
        '0x0000000000000000000000000000000000000000000000000000000000000001::string::String',
        `${packageAddress}::dao::Staked<${options.typeArguments[0]}>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["account", "intentKey", "staked"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'new_vote',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface VoteArguments {
    vote: RawTransactionArgument<string>;
    account: RawTransactionArgument<string>;
    answer: RawTransactionArgument<number>;
}
export interface VoteOptions {
    package?: string;
    arguments: VoteArguments | [
        vote: RawTransactionArgument<string>,
        account: RawTransactionArgument<string>,
        answer: RawTransactionArgument<number>
    ];
    typeArguments: [
        string
    ];
}
/** Votes or changes vote on a proposal */
export function vote(options: VoteOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Vote<${options.typeArguments[0]}>`,
        `0xb4cb9bfc37d340519e834165d6fc791ec279f756c2d3a3e2086ec22e09c04d3b::account::Account<${packageAddress}::dao::Dao>`,
        'u8',
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["vote", "account", "answer"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'vote',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface DestroyVoteArguments {
    vote: RawTransactionArgument<string>;
}
export interface DestroyVoteOptions {
    package?: string;
    arguments: DestroyVoteArguments | [
        vote: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function destroyVote(options: DestroyVoteOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Vote<${options.typeArguments[0]}>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["vote"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'destroy_vote',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface ExecuteVotesIntentArguments {
    account: RawTransactionArgument<string>;
    key: RawTransactionArgument<string>;
}
export interface ExecuteVotesIntentOptions {
    package?: string;
    arguments: ExecuteVotesIntentArguments | [
        account: RawTransactionArgument<string>,
        key: RawTransactionArgument<string>
    ];
}
export function executeVotesIntent(options: ExecuteVotesIntentOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `0xb4cb9bfc37d340519e834165d6fc791ec279f756c2d3a3e2086ec22e09c04d3b::account::Account<${packageAddress}::dao::Dao>`,
        '0x0000000000000000000000000000000000000000000000000000000000000001::string::String',
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["account", "key"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'execute_votes_intent',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ValidateVotesOutcomeArguments {
    outcome: RawTransactionArgument<string>;
    dao: RawTransactionArgument<string>;
}
export interface ValidateVotesOutcomeOptions {
    package?: string;
    arguments: ValidateVotesOutcomeArguments | [
        outcome: RawTransactionArgument<string>,
        dao: RawTransactionArgument<string>
    ];
}
export function validateVotesOutcome(options: ValidateVotesOutcomeOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Votes`,
        `${packageAddress}::dao::Dao`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["outcome", "dao"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'validate_votes_outcome',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface JoinArguments {
    user: RawTransactionArgument<string>;
    account: RawTransactionArgument<string>;
}
export interface JoinOptions {
    package?: string;
    arguments: JoinArguments | [
        user: RawTransactionArgument<string>,
        account: RawTransactionArgument<string>
    ];
}
/** Inserts account_id in User, aborts if already joined */
export function join(options: JoinOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        '0xb4cb9bfc37d340519e834165d6fc791ec279f756c2d3a3e2086ec22e09c04d3b::user::User',
        `0xb4cb9bfc37d340519e834165d6fc791ec279f756c2d3a3e2086ec22e09c04d3b::account::Account<${packageAddress}::dao::Dao>`
    ] satisfies string[];
    const parameterNames = ["user", "account"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'join',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface LeaveArguments {
    user: RawTransactionArgument<string>;
    account: RawTransactionArgument<string>;
}
export interface LeaveOptions {
    package?: string;
    arguments: LeaveArguments | [
        user: RawTransactionArgument<string>,
        account: RawTransactionArgument<string>
    ];
}
/** Removes account_id from User, aborts if not joined */
export function leave(options: LeaveOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        '0xb4cb9bfc37d340519e834165d6fc791ec279f756c2d3a3e2086ec22e09c04d3b::user::User',
        `0xb4cb9bfc37d340519e834165d6fc791ec279f756c2d3a3e2086ec22e09c04d3b::account::Account<${packageAddress}::dao::Dao>`
    ] satisfies string[];
    const parameterNames = ["user", "account"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'leave',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface AssertHasAuthPowerArguments {
    dao: RawTransactionArgument<string>;
    staked: RawTransactionArgument<string>;
}
export interface AssertHasAuthPowerOptions {
    package?: string;
    arguments: AssertHasAuthPowerArguments | [
        dao: RawTransactionArgument<string>,
        staked: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function assertHasAuthPower(options: AssertHasAuthPowerOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Dao`,
        `${packageAddress}::dao::Staked<${options.typeArguments[0]}>`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["dao", "staked"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'assert_has_auth_power',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface AddrArguments {
    vote: RawTransactionArgument<string>;
}
export interface AddrOptions {
    package?: string;
    arguments: AddrArguments | [
        vote: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function addr(options: AddrOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Vote<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["vote"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'addr',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface AssetTypeArguments {
    dao: RawTransactionArgument<string>;
}
export interface AssetTypeOptions {
    package?: string;
    arguments: AssetTypeArguments | [
        dao: RawTransactionArgument<string>
    ];
}
export function assetType(options: AssetTypeOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Dao`
    ] satisfies string[];
    const parameterNames = ["dao"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'asset_type',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface AuthVotingPowerArguments {
    dao: RawTransactionArgument<string>;
}
export interface AuthVotingPowerOptions {
    package?: string;
    arguments: AuthVotingPowerArguments | [
        dao: RawTransactionArgument<string>
    ];
}
export function authVotingPower(options: AuthVotingPowerOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Dao`
    ] satisfies string[];
    const parameterNames = ["dao"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'auth_voting_power',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface UnstakingCooldownArguments {
    dao: RawTransactionArgument<string>;
}
export interface UnstakingCooldownOptions {
    package?: string;
    arguments: UnstakingCooldownArguments | [
        dao: RawTransactionArgument<string>
    ];
}
export function unstakingCooldown(options: UnstakingCooldownOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Dao`
    ] satisfies string[];
    const parameterNames = ["dao"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'unstaking_cooldown',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface VotingRuleArguments {
    dao: RawTransactionArgument<string>;
}
export interface VotingRuleOptions {
    package?: string;
    arguments: VotingRuleArguments | [
        dao: RawTransactionArgument<string>
    ];
}
export function votingRule(options: VotingRuleOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Dao`
    ] satisfies string[];
    const parameterNames = ["dao"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'voting_rule',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface MaxVotingPowerArguments {
    dao: RawTransactionArgument<string>;
}
export interface MaxVotingPowerOptions {
    package?: string;
    arguments: MaxVotingPowerArguments | [
        dao: RawTransactionArgument<string>
    ];
}
export function maxVotingPower(options: MaxVotingPowerOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Dao`
    ] satisfies string[];
    const parameterNames = ["dao"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'max_voting_power',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface VotingQuorumArguments {
    dao: RawTransactionArgument<string>;
}
export interface VotingQuorumOptions {
    package?: string;
    arguments: VotingQuorumArguments | [
        dao: RawTransactionArgument<string>
    ];
}
export function votingQuorum(options: VotingQuorumOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Dao`
    ] satisfies string[];
    const parameterNames = ["dao"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'voting_quorum',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface MinimumVotesArguments {
    dao: RawTransactionArgument<string>;
}
export interface MinimumVotesOptions {
    package?: string;
    arguments: MinimumVotesArguments | [
        dao: RawTransactionArgument<string>
    ];
}
export function minimumVotes(options: MinimumVotesOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Dao`
    ] satisfies string[];
    const parameterNames = ["dao"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'minimum_votes',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface IsCoinArguments {
    dao: RawTransactionArgument<string>;
}
export interface IsCoinOptions {
    package?: string;
    arguments: IsCoinArguments | [
        dao: RawTransactionArgument<string>
    ];
}
export function isCoin(options: IsCoinOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Dao`
    ] satisfies string[];
    const parameterNames = ["dao"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'is_coin',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface StartTimeArguments {
    outcome: RawTransactionArgument<string>;
}
export interface StartTimeOptions {
    package?: string;
    arguments: StartTimeArguments | [
        outcome: RawTransactionArgument<string>
    ];
}
export function startTime(options: StartTimeOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Votes`
    ] satisfies string[];
    const parameterNames = ["outcome"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'start_time',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface EndTimeArguments {
    outcome: RawTransactionArgument<string>;
}
export interface EndTimeOptions {
    package?: string;
    arguments: EndTimeArguments | [
        outcome: RawTransactionArgument<string>
    ];
}
export function endTime(options: EndTimeOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Votes`
    ] satisfies string[];
    const parameterNames = ["outcome"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'end_time',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ResultsArguments {
    outcome: RawTransactionArgument<string>;
}
export interface ResultsOptions {
    package?: string;
    arguments: ResultsArguments | [
        outcome: RawTransactionArgument<string>
    ];
}
export function results(options: ResultsOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Votes`
    ] satisfies string[];
    const parameterNames = ["outcome"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'results',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface StakedDaoAddrArguments {
    staked: RawTransactionArgument<string>;
}
export interface StakedDaoAddrOptions {
    package?: string;
    arguments: StakedDaoAddrArguments | [
        staked: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function stakedDaoAddr(options: StakedDaoAddrOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Staked<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["staked"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'staked_dao_addr',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface ValueArguments {
    staked: RawTransactionArgument<string>;
}
export interface ValueOptions {
    package?: string;
    arguments: ValueArguments | [
        staked: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function value(options: ValueOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Staked<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["staked"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'value',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface UnstakedArguments {
    staked: RawTransactionArgument<string>;
}
export interface UnstakedOptions {
    package?: string;
    arguments: UnstakedArguments | [
        staked: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function unstaked(options: UnstakedOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Staked<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["staked"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'unstaked',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface AssetArguments {
    staked: RawTransactionArgument<string>;
}
export interface AssetOptions {
    package?: string;
    arguments: AssetArguments | [
        staked: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function asset(options: AssetOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Staked<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["staked"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'asset',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface VoteDaoAddrArguments {
    vote: RawTransactionArgument<string>;
}
export interface VoteDaoAddrOptions {
    package?: string;
    arguments: VoteDaoAddrArguments | [
        vote: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function voteDaoAddr(options: VoteDaoAddrOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Vote<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["vote"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'vote_dao_addr',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface IntentKeyArguments {
    vote: RawTransactionArgument<string>;
}
export interface IntentKeyOptions {
    package?: string;
    arguments: IntentKeyArguments | [
        vote: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function intentKey(options: IntentKeyOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Vote<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["vote"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'intent_key',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface AnswerArguments {
    vote: RawTransactionArgument<string>;
}
export interface AnswerOptions {
    package?: string;
    arguments: AnswerArguments | [
        vote: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function answer(options: AnswerOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Vote<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["vote"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'answer',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface PowerArguments {
    vote: RawTransactionArgument<string>;
}
export interface PowerOptions {
    package?: string;
    arguments: PowerArguments | [
        vote: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function power(options: PowerOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Vote<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["vote"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'power',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface VoteEndArguments {
    vote: RawTransactionArgument<string>;
}
export interface VoteEndOptions {
    package?: string;
    arguments: VoteEndArguments | [
        vote: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function voteEnd(options: VoteEndOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Vote<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["vote"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'vote_end',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface StakedArguments {
    vote: RawTransactionArgument<string>;
}
export interface StakedOptions {
    package?: string;
    arguments: StakedArguments | [
        vote: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
export function staked(options: StakedOptions) {
    const packageAddress = options.package ?? '@account/dao';
    const argumentsTypes = [
        `${packageAddress}::dao::Vote<${options.typeArguments[0]}>`
    ] satisfies string[];
    const parameterNames = ["vote"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'dao',
        function: 'staked',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}