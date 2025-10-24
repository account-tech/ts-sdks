/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/


/**
 * This module defines a Multisig configuration for an Account. It also defines a
 * new Outcome type for the intents.
 * 
 * Config consists of members, roles and thresholds. Members have a weight and can
 * have multiple roles. There is a global threshold and a threshold for each role.
 * 
 * Intent resolution is done by checking the global and role intent weight against
 * the thresholds. If any of the role or global thresholds is reached, the intent
 * can be executed.
 */

import { MoveStruct, MoveTuple, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as vec_set from './deps/sui/vec_set.js';
const $moduleName = '@account/multisig::multisig';
export const Member = new MoveStruct({ name: `${$moduleName}::Member`, fields: {
        addr: bcs.Address,
        weight: bcs.u64(),
        roles: vec_set.VecSet(bcs.string())
    } });
export const Role = new MoveStruct({ name: `${$moduleName}::Role`, fields: {
        name: bcs.string(),
        threshold: bcs.u64()
    } });
export const Multisig = new MoveStruct({ name: `${$moduleName}::Multisig`, fields: {
        members: bcs.vector(Member),
        global: bcs.u64(),
        roles: bcs.vector(Role)
    } });
export const ConfigWitness = new MoveTuple({ name: `${$moduleName}::ConfigWitness`, fields: [bcs.bool()] });
export const Approvals = new MoveStruct({ name: `${$moduleName}::Approvals`, fields: {
        total_weight: bcs.u64(),
        role_weight: bcs.u64(),
        approved: vec_set.VecSet(bcs.Address)
    } });
export interface NewAccountArguments {
    extensions: RawTransactionArgument<string>;
    fees: RawTransactionArgument<string>;
    coin: RawTransactionArgument<string>;
}
export interface NewAccountOptions {
    package?: string;
    arguments: NewAccountArguments | [
        extensions: RawTransactionArgument<string>,
        fees: RawTransactionArgument<string>,
        coin: RawTransactionArgument<string>
    ];
}
/**
 * Init and returns a new Account object. Creator is added by default with weight
 * and global threshold of 1. AccountProtocol, AccountMultisig and AccountActions
 * are added as dependencies.
 */
export function newAccount(options: NewAccountOptions) {
    const packageAddress = options.package ?? '@account/multisig';
    const argumentsTypes = [
        '0x1fe0f14fab4da458fde0de69980b3e3f38930f793540546c76a4b64a0dd87b31::extensions::Extensions',
        `${packageAddress}::fees::Fees`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI>'
    ] satisfies string[];
    const parameterNames = ["extensions", "fees", "coin"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'multisig',
        function: 'new_account',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface AuthenticateArguments {
    account: RawTransactionArgument<string>;
}
export interface AuthenticateOptions {
    package?: string;
    arguments: AuthenticateArguments | [
        account: RawTransactionArgument<string>
    ];
}
/** Authenticates the caller as a member of the multisig. */
export function authenticate(options: AuthenticateOptions) {
    const packageAddress = options.package ?? '@account/multisig';
    const argumentsTypes = [
        `0x56b160354dba79f03cd31dcfcde9ad93e70dedc23466bf6fa942c251de5e9d60::account::Account<${packageAddress}::multisig::Multisig>`
    ] satisfies string[];
    const parameterNames = ["account"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'multisig',
        function: 'authenticate',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface EmptyOutcomeOptions {
    package?: string;
    arguments?: [
    ];
}
/** Creates a new outcome to initiate an intent. */
export function emptyOutcome(options: EmptyOutcomeOptions = {}) {
    const packageAddress = options.package ?? '@account/multisig';
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'multisig',
        function: 'empty_outcome',
    });
}
export interface ApproveIntentArguments {
    account: RawTransactionArgument<string>;
    key: RawTransactionArgument<string>;
}
export interface ApproveIntentOptions {
    package?: string;
    arguments: ApproveIntentArguments | [
        account: RawTransactionArgument<string>,
        key: RawTransactionArgument<string>
    ];
}
/** Approves an intent increasing the outcome weight and optionally the role weight. */
export function approveIntent(options: ApproveIntentOptions) {
    const packageAddress = options.package ?? '@account/multisig';
    const argumentsTypes = [
        `0x56b160354dba79f03cd31dcfcde9ad93e70dedc23466bf6fa942c251de5e9d60::account::Account<${packageAddress}::multisig::Multisig>`,
        '0x0000000000000000000000000000000000000000000000000000000000000001::string::String'
    ] satisfies string[];
    const parameterNames = ["account", "key"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'multisig',
        function: 'approve_intent',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface DisapproveIntentArguments {
    account: RawTransactionArgument<string>;
    key: RawTransactionArgument<string>;
}
export interface DisapproveIntentOptions {
    package?: string;
    arguments: DisapproveIntentArguments | [
        account: RawTransactionArgument<string>,
        key: RawTransactionArgument<string>
    ];
}
/**
 * Disapproves an intent decreasing the outcome weight and optionally the role
 * weight.
 */
export function disapproveIntent(options: DisapproveIntentOptions) {
    const packageAddress = options.package ?? '@account/multisig';
    const argumentsTypes = [
        `0x56b160354dba79f03cd31dcfcde9ad93e70dedc23466bf6fa942c251de5e9d60::account::Account<${packageAddress}::multisig::Multisig>`,
        '0x0000000000000000000000000000000000000000000000000000000000000001::string::String'
    ] satisfies string[];
    const parameterNames = ["account", "key"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'multisig',
        function: 'disapprove_intent',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ExecuteIntentArguments {
    account: RawTransactionArgument<string>;
    key: RawTransactionArgument<string>;
}
export interface ExecuteIntentOptions {
    package?: string;
    arguments: ExecuteIntentArguments | [
        account: RawTransactionArgument<string>,
        key: RawTransactionArgument<string>
    ];
}
/**
 * Returns an executable if the number of signers is >= (global || role) threshold.
 * Anyone can execute an intent, this allows to automate the execution of intents.
 */
export function executeIntent(options: ExecuteIntentOptions) {
    const packageAddress = options.package ?? '@account/multisig';
    const argumentsTypes = [
        `0x56b160354dba79f03cd31dcfcde9ad93e70dedc23466bf6fa942c251de5e9d60::account::Account<${packageAddress}::multisig::Multisig>`,
        '0x0000000000000000000000000000000000000000000000000000000000000001::string::String',
        '0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock'
    ] satisfies string[];
    const parameterNames = ["account", "key"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'multisig',
        function: 'execute_intent',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ValidateOutcomeArguments {
    outcome: RawTransactionArgument<string>;
    multisig: RawTransactionArgument<string>;
    role: RawTransactionArgument<string>;
}
export interface ValidateOutcomeOptions {
    package?: string;
    arguments: ValidateOutcomeArguments | [
        outcome: RawTransactionArgument<string>,
        multisig: RawTransactionArgument<string>,
        role: RawTransactionArgument<string>
    ];
}
export function validateOutcome(options: ValidateOutcomeOptions) {
    const packageAddress = options.package ?? '@account/multisig';
    const argumentsTypes = [
        `${packageAddress}::multisig::Approvals`,
        `${packageAddress}::multisig::Multisig`,
        '0x0000000000000000000000000000000000000000000000000000000000000001::string::String'
    ] satisfies string[];
    const parameterNames = ["outcome", "multisig", "role"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'multisig',
        function: 'validate_outcome',
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
/** Inserts account_id in User, aborts if already joined. */
export function join(options: JoinOptions) {
    const packageAddress = options.package ?? '@account/multisig';
    const argumentsTypes = [
        '0x56b160354dba79f03cd31dcfcde9ad93e70dedc23466bf6fa942c251de5e9d60::user::User',
        `0x56b160354dba79f03cd31dcfcde9ad93e70dedc23466bf6fa942c251de5e9d60::account::Account<${packageAddress}::multisig::Multisig>`
    ] satisfies string[];
    const parameterNames = ["user", "account"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'multisig',
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
/** Removes account_id from User, aborts if not joined. */
export function leave(options: LeaveOptions) {
    const packageAddress = options.package ?? '@account/multisig';
    const argumentsTypes = [
        '0x56b160354dba79f03cd31dcfcde9ad93e70dedc23466bf6fa942c251de5e9d60::user::User',
        `0x56b160354dba79f03cd31dcfcde9ad93e70dedc23466bf6fa942c251de5e9d60::account::Account<${packageAddress}::multisig::Multisig>`
    ] satisfies string[];
    const parameterNames = ["user", "account"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'multisig',
        function: 'leave',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface SendInviteArguments {
    account: RawTransactionArgument<string>;
    recipient: RawTransactionArgument<string>;
}
export interface SendInviteOptions {
    package?: string;
    arguments: SendInviteArguments | [
        account: RawTransactionArgument<string>,
        recipient: RawTransactionArgument<string>
    ];
}
/** Invites can be sent by a Multisig member when added to the Multisig. */
export function sendInvite(options: SendInviteOptions) {
    const packageAddress = options.package ?? '@account/multisig';
    const argumentsTypes = [
        `0x56b160354dba79f03cd31dcfcde9ad93e70dedc23466bf6fa942c251de5e9d60::account::Account<${packageAddress}::multisig::Multisig>`,
        'address'
    ] satisfies string[];
    const parameterNames = ["account", "recipient"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'multisig',
        function: 'send_invite',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface AddressesArguments {
    multisig: RawTransactionArgument<string>;
}
export interface AddressesOptions {
    package?: string;
    arguments: AddressesArguments | [
        multisig: RawTransactionArgument<string>
    ];
}
/** Returns the addresses of the members. */
export function addresses(options: AddressesOptions) {
    const packageAddress = options.package ?? '@account/multisig';
    const argumentsTypes = [
        `${packageAddress}::multisig::Multisig`
    ] satisfies string[];
    const parameterNames = ["multisig"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'multisig',
        function: 'addresses',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface MemberArguments {
    multisig: RawTransactionArgument<string>;
    addr: RawTransactionArgument<string>;
}
export interface MemberOptions {
    package?: string;
    arguments: MemberArguments | [
        multisig: RawTransactionArgument<string>,
        addr: RawTransactionArgument<string>
    ];
}
/** Returns the member associated with the address. */
export function member(options: MemberOptions) {
    const packageAddress = options.package ?? '@account/multisig';
    const argumentsTypes = [
        `${packageAddress}::multisig::Multisig`,
        'address'
    ] satisfies string[];
    const parameterNames = ["multisig", "addr"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'multisig',
        function: 'member',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface GetMemberIdxArguments {
    multisig: RawTransactionArgument<string>;
    addr: RawTransactionArgument<string>;
}
export interface GetMemberIdxOptions {
    package?: string;
    arguments: GetMemberIdxArguments | [
        multisig: RawTransactionArgument<string>,
        addr: RawTransactionArgument<string>
    ];
}
/** Returns the index of the member associated with the address. */
export function getMemberIdx(options: GetMemberIdxOptions) {
    const packageAddress = options.package ?? '@account/multisig';
    const argumentsTypes = [
        `${packageAddress}::multisig::Multisig`,
        'address'
    ] satisfies string[];
    const parameterNames = ["multisig", "addr"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'multisig',
        function: 'get_member_idx',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface IsMemberArguments {
    multisig: RawTransactionArgument<string>;
    addr: RawTransactionArgument<string>;
}
export interface IsMemberOptions {
    package?: string;
    arguments: IsMemberArguments | [
        multisig: RawTransactionArgument<string>,
        addr: RawTransactionArgument<string>
    ];
}
/** Returns true if the address is a member. */
export function isMember(options: IsMemberOptions) {
    const packageAddress = options.package ?? '@account/multisig';
    const argumentsTypes = [
        `${packageAddress}::multisig::Multisig`,
        'address'
    ] satisfies string[];
    const parameterNames = ["multisig", "addr"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'multisig',
        function: 'is_member',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface AssertIsMemberArguments {
    multisig: RawTransactionArgument<string>;
}
export interface AssertIsMemberOptions {
    package?: string;
    arguments: AssertIsMemberArguments | [
        multisig: RawTransactionArgument<string>
    ];
}
/** Asserts that the caller is a member. */
export function assertIsMember(options: AssertIsMemberOptions) {
    const packageAddress = options.package ?? '@account/multisig';
    const argumentsTypes = [
        `${packageAddress}::multisig::Multisig`
    ] satisfies string[];
    const parameterNames = ["multisig"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'multisig',
        function: 'assert_is_member',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface WeightArguments {
    member: RawTransactionArgument<string>;
}
export interface WeightOptions {
    package?: string;
    arguments: WeightArguments | [
        member: RawTransactionArgument<string>
    ];
}
/** Returns the weight of the member. */
export function weight(options: WeightOptions) {
    const packageAddress = options.package ?? '@account/multisig';
    const argumentsTypes = [
        `${packageAddress}::multisig::Member`
    ] satisfies string[];
    const parameterNames = ["member"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'multisig',
        function: 'weight',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface RolesArguments {
    member: RawTransactionArgument<string>;
}
export interface RolesOptions {
    package?: string;
    arguments: RolesArguments | [
        member: RawTransactionArgument<string>
    ];
}
/** Returns the roles of the member. */
export function roles(options: RolesOptions) {
    const packageAddress = options.package ?? '@account/multisig';
    const argumentsTypes = [
        `${packageAddress}::multisig::Member`
    ] satisfies string[];
    const parameterNames = ["member"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'multisig',
        function: 'roles',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface HasRoleArguments {
    member: RawTransactionArgument<string>;
    role: RawTransactionArgument<string>;
}
export interface HasRoleOptions {
    package?: string;
    arguments: HasRoleArguments | [
        member: RawTransactionArgument<string>,
        role: RawTransactionArgument<string>
    ];
}
/** Returns true if the member has the role. */
export function hasRole(options: HasRoleOptions) {
    const packageAddress = options.package ?? '@account/multisig';
    const argumentsTypes = [
        `${packageAddress}::multisig::Member`,
        '0x0000000000000000000000000000000000000000000000000000000000000001::string::String'
    ] satisfies string[];
    const parameterNames = ["member", "role"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'multisig',
        function: 'has_role',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface GetGlobalThresholdArguments {
    multisig: RawTransactionArgument<string>;
}
export interface GetGlobalThresholdOptions {
    package?: string;
    arguments: GetGlobalThresholdArguments | [
        multisig: RawTransactionArgument<string>
    ];
}
/** Returns the global threshold. */
export function getGlobalThreshold(options: GetGlobalThresholdOptions) {
    const packageAddress = options.package ?? '@account/multisig';
    const argumentsTypes = [
        `${packageAddress}::multisig::Multisig`
    ] satisfies string[];
    const parameterNames = ["multisig"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'multisig',
        function: 'get_global_threshold',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface GetRoleThresholdArguments {
    multisig: RawTransactionArgument<string>;
    name: RawTransactionArgument<string>;
}
export interface GetRoleThresholdOptions {
    package?: string;
    arguments: GetRoleThresholdArguments | [
        multisig: RawTransactionArgument<string>,
        name: RawTransactionArgument<string>
    ];
}
/** Returns the threshold of the role. */
export function getRoleThreshold(options: GetRoleThresholdOptions) {
    const packageAddress = options.package ?? '@account/multisig';
    const argumentsTypes = [
        `${packageAddress}::multisig::Multisig`,
        '0x0000000000000000000000000000000000000000000000000000000000000001::string::String'
    ] satisfies string[];
    const parameterNames = ["multisig", "name"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'multisig',
        function: 'get_role_threshold',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface GetRoleIdxArguments {
    multisig: RawTransactionArgument<string>;
    name: RawTransactionArgument<string>;
}
export interface GetRoleIdxOptions {
    package?: string;
    arguments: GetRoleIdxArguments | [
        multisig: RawTransactionArgument<string>,
        name: RawTransactionArgument<string>
    ];
}
/** Returns the index of the role. */
export function getRoleIdx(options: GetRoleIdxOptions) {
    const packageAddress = options.package ?? '@account/multisig';
    const argumentsTypes = [
        `${packageAddress}::multisig::Multisig`,
        '0x0000000000000000000000000000000000000000000000000000000000000001::string::String'
    ] satisfies string[];
    const parameterNames = ["multisig", "name"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'multisig',
        function: 'get_role_idx',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface RoleExistsArguments {
    multisig: RawTransactionArgument<string>;
    name: RawTransactionArgument<string>;
}
export interface RoleExistsOptions {
    package?: string;
    arguments: RoleExistsArguments | [
        multisig: RawTransactionArgument<string>,
        name: RawTransactionArgument<string>
    ];
}
/** Returns true if the role exists in the multisig. */
export function roleExists(options: RoleExistsOptions) {
    const packageAddress = options.package ?? '@account/multisig';
    const argumentsTypes = [
        `${packageAddress}::multisig::Multisig`,
        '0x0000000000000000000000000000000000000000000000000000000000000001::string::String'
    ] satisfies string[];
    const parameterNames = ["multisig", "name"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'multisig',
        function: 'role_exists',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface TotalWeightArguments {
    outcome: RawTransactionArgument<string>;
}
export interface TotalWeightOptions {
    package?: string;
    arguments: TotalWeightArguments | [
        outcome: RawTransactionArgument<string>
    ];
}
/** Returns the total weight of the outcome. */
export function totalWeight(options: TotalWeightOptions) {
    const packageAddress = options.package ?? '@account/multisig';
    const argumentsTypes = [
        `${packageAddress}::multisig::Approvals`
    ] satisfies string[];
    const parameterNames = ["outcome"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'multisig',
        function: 'total_weight',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface RoleWeightArguments {
    outcome: RawTransactionArgument<string>;
}
export interface RoleWeightOptions {
    package?: string;
    arguments: RoleWeightArguments | [
        outcome: RawTransactionArgument<string>
    ];
}
/** Returns the role weight of the outcome. */
export function roleWeight(options: RoleWeightOptions) {
    const packageAddress = options.package ?? '@account/multisig';
    const argumentsTypes = [
        `${packageAddress}::multisig::Approvals`
    ] satisfies string[];
    const parameterNames = ["outcome"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'multisig',
        function: 'role_weight',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ApprovedArguments {
    outcome: RawTransactionArgument<string>;
}
export interface ApprovedOptions {
    package?: string;
    arguments: ApprovedArguments | [
        outcome: RawTransactionArgument<string>
    ];
}
/** Returns the addresses of the members who approved the outcome. */
export function approved(options: ApprovedOptions) {
    const packageAddress = options.package ?? '@account/multisig';
    const argumentsTypes = [
        `${packageAddress}::multisig::Approvals`
    ] satisfies string[];
    const parameterNames = ["outcome"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'multisig',
        function: 'approved',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}