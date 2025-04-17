import {PUBLISHED_AT} from "..";
import {String} from "../../_dependencies/source/0x1/string/structs";
import {GenericArg, generic, obj, pure} from "../../_framework/util";
import {Transaction, TransactionArgument, TransactionObjectInput} from "@mysten/sui/transactions";

export function addr( tx: Transaction, typeArg: string, vote: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::addr`, typeArguments: [typeArg], arguments: [ obj(tx, vote) ], }) }

export function answer( tx: Transaction, typeArg: string, vote: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::answer`, typeArguments: [typeArg], arguments: [ obj(tx, vote) ], }) }

export interface AssertHasAuthPowerArgs { dao: TransactionObjectInput; staked: TransactionObjectInput; clock: TransactionObjectInput }

export function assertHasAuthPower( tx: Transaction, typeArg: string, args: AssertHasAuthPowerArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::assert_has_auth_power`, typeArguments: [typeArg], arguments: [ obj(tx, args.dao), obj(tx, args.staked), obj(tx, args.clock) ], }) }

export function asset( tx: Transaction, typeArg: string, staked: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::asset`, typeArguments: [typeArg], arguments: [ obj(tx, staked) ], }) }

export function assetType( tx: Transaction, dao: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::asset_type`, arguments: [ obj(tx, dao) ], }) }

export function authVotingPower( tx: Transaction, dao: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::auth_voting_power`, arguments: [ obj(tx, dao) ], }) }

export interface AuthenticateArgs { staked: TransactionObjectInput; account: TransactionObjectInput; clock: TransactionObjectInput }

export function authenticate( tx: Transaction, typeArg: string, args: AuthenticateArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::authenticate`, typeArguments: [typeArg], arguments: [ obj(tx, args.staked), obj(tx, args.account), obj(tx, args.clock) ], }) }

export interface ClaimArgs { staked: TransactionObjectInput; account: TransactionObjectInput; clock: TransactionObjectInput }

export function claim( tx: Transaction, typeArg: string, args: ClaimArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::claim`, typeArguments: [typeArg], arguments: [ obj(tx, args.staked), obj(tx, args.account), obj(tx, args.clock) ], }) }

export function configMut( tx: Transaction, account: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::config_mut`, arguments: [ obj(tx, account) ], }) }

export interface DestroyVoteArgs { vote: TransactionObjectInput; clock: TransactionObjectInput }

export function destroyVote( tx: Transaction, typeArg: string, args: DestroyVoteArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::destroy_vote`, typeArguments: [typeArg], arguments: [ obj(tx, args.vote), obj(tx, args.clock) ], }) }

export interface EmptyVotesOutcomeArgs { startTime: bigint | TransactionArgument; endTime: bigint | TransactionArgument; clock: TransactionObjectInput }

export function emptyVotesOutcome( tx: Transaction, args: EmptyVotesOutcomeArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::empty_votes_outcome`, arguments: [ pure(tx, args.startTime, `u64`), pure(tx, args.endTime, `u64`), obj(tx, args.clock) ], }) }

export function endTime( tx: Transaction, outcome: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::end_time`, arguments: [ obj(tx, outcome) ], }) }

export interface ExecuteVotesIntentArgs { account: TransactionObjectInput; key: string | TransactionArgument; clock: TransactionObjectInput }

export function executeVotesIntent( tx: Transaction, args: ExecuteVotesIntentArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::execute_votes_intent`, arguments: [ obj(tx, args.account), pure(tx, args.key, `${String.$typeName}`), obj(tx, args.clock) ], }) }

export interface GetVotingPowerArgs { staked: TransactionObjectInput; dao: TransactionObjectInput; clock: TransactionObjectInput }

export function getVotingPower( tx: Transaction, typeArg: string, args: GetVotingPowerArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::get_voting_power`, typeArguments: [typeArg], arguments: [ obj(tx, args.staked), obj(tx, args.dao), obj(tx, args.clock) ], }) }

export function init( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::init`, arguments: [ ], }) }

export function intentKey( tx: Transaction, typeArg: string, vote: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::intent_key`, typeArguments: [typeArg], arguments: [ obj(tx, vote) ], }) }

export function isCoin( tx: Transaction, dao: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::is_coin`, arguments: [ obj(tx, dao) ], }) }

export interface JoinArgs { user: TransactionObjectInput; account: TransactionObjectInput }

export function join( tx: Transaction, args: JoinArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::join`, arguments: [ obj(tx, args.user), obj(tx, args.account) ], }) }

export interface LeaveArgs { user: TransactionObjectInput; account: TransactionObjectInput }

export function leave( tx: Transaction, args: LeaveArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::leave`, arguments: [ obj(tx, args.user), obj(tx, args.account) ], }) }

export function maxVotingPower( tx: Transaction, dao: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::max_voting_power`, arguments: [ obj(tx, dao) ], }) }

export interface MergeStakedCoinArgs { staked: TransactionObjectInput; toMerge: TransactionObjectInput }

export function mergeStakedCoin( tx: Transaction, typeArg: string, args: MergeStakedCoinArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::merge_staked_coin`, typeArguments: [typeArg], arguments: [ obj(tx, args.staked), obj(tx, args.toMerge) ], }) }

export interface MergeStakedObjectArgs { staked: TransactionObjectInput; toMerge: TransactionObjectInput }

export function mergeStakedObject( tx: Transaction, typeArg: string, args: MergeStakedObjectArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::merge_staked_object`, typeArguments: [typeArg], arguments: [ obj(tx, args.staked), obj(tx, args.toMerge) ], }) }

export function minimumVotes( tx: Transaction, dao: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::minimum_votes`, arguments: [ obj(tx, dao) ], }) }

export interface NewAccountArgs { registry: TransactionObjectInput; extensions: TransactionObjectInput; authVotingPower: bigint | TransactionArgument; unstakingCooldown: bigint | TransactionArgument; votingRule: number | TransactionArgument; maxVotingPower: bigint | TransactionArgument; votingQuorum: bigint | TransactionArgument; minimumVotes: bigint | TransactionArgument }

export function newAccount( tx: Transaction, typeArg: string, args: NewAccountArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::new_account`, typeArguments: [typeArg], arguments: [ obj(tx, args.registry), obj(tx, args.extensions), pure(tx, args.authVotingPower, `u64`), pure(tx, args.unstakingCooldown, `u64`), pure(tx, args.votingRule, `u8`), pure(tx, args.maxVotingPower, `u64`), pure(tx, args.votingQuorum, `u64`), pure(tx, args.minimumVotes, `u64`) ], }) }

export interface NewConfigArgs { authVotingPower: bigint | TransactionArgument; unstakingCooldown: bigint | TransactionArgument; votingRule: number | TransactionArgument; maxVotingPower: bigint | TransactionArgument; minimumVotes: bigint | TransactionArgument; votingQuorum: bigint | TransactionArgument }

export function newConfig( tx: Transaction, typeArg: string, args: NewConfigArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::new_config`, typeArguments: [typeArg], arguments: [ pure(tx, args.authVotingPower, `u64`), pure(tx, args.unstakingCooldown, `u64`), pure(tx, args.votingRule, `u8`), pure(tx, args.maxVotingPower, `u64`), pure(tx, args.minimumVotes, `u64`), pure(tx, args.votingQuorum, `u64`) ], }) }

export function newStakedCoin( tx: Transaction, typeArg: string, account: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::new_staked_coin`, typeArguments: [typeArg], arguments: [ obj(tx, account) ], }) }

export function newStakedObject( tx: Transaction, typeArg: string, account: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::new_staked_object`, typeArguments: [typeArg], arguments: [ obj(tx, account) ], }) }

export interface NewVoteArgs { account: TransactionObjectInput; intentKey: string | TransactionArgument; staked: TransactionObjectInput; clock: TransactionObjectInput }

export function newVote( tx: Transaction, typeArg: string, args: NewVoteArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::new_vote`, typeArguments: [typeArg], arguments: [ obj(tx, args.account), pure(tx, args.intentKey, `${String.$typeName}`), obj(tx, args.staked), obj(tx, args.clock) ], }) }

export function power( tx: Transaction, typeArg: string, vote: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::power`, typeArguments: [typeArg], arguments: [ obj(tx, vote) ], }) }

export function results( tx: Transaction, outcome: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::results`, arguments: [ obj(tx, outcome) ], }) }

export interface StakeCoinArgs { staked: TransactionObjectInput; coin: TransactionObjectInput }

export function stakeCoin( tx: Transaction, typeArg: string, args: StakeCoinArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::stake_coin`, typeArguments: [typeArg], arguments: [ obj(tx, args.staked), obj(tx, args.coin) ], }) }

export interface StakeObjectArgs { staked: TransactionObjectInput; asset: GenericArg }

export function stakeObject( tx: Transaction, typeArg: string, args: StakeObjectArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::stake_object`, typeArguments: [typeArg], arguments: [ obj(tx, args.staked), generic(tx, `${typeArg}`, args.asset) ], }) }

export function staked( tx: Transaction, typeArg: string, vote: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::staked`, typeArguments: [typeArg], arguments: [ obj(tx, vote) ], }) }

export function stakedDaoAddr( tx: Transaction, typeArg: string, staked: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::staked_dao_addr`, typeArguments: [typeArg], arguments: [ obj(tx, staked) ], }) }

export function startTime( tx: Transaction, outcome: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::start_time`, arguments: [ obj(tx, outcome) ], }) }

export interface UnstakeArgs { staked: TransactionObjectInput; clock: TransactionObjectInput }

export function unstake( tx: Transaction, typeArg: string, args: UnstakeArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::unstake`, typeArguments: [typeArg], arguments: [ obj(tx, args.staked), obj(tx, args.clock) ], }) }

export function unstaked( tx: Transaction, typeArg: string, staked: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::unstaked`, typeArguments: [typeArg], arguments: [ obj(tx, staked) ], }) }

export function unstakingCooldown( tx: Transaction, dao: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::unstaking_cooldown`, arguments: [ obj(tx, dao) ], }) }

export interface ValidateVotesOutcomeArgs { outcome: TransactionObjectInput; dao: TransactionObjectInput; clock: TransactionObjectInput }

export function validateVotesOutcome( tx: Transaction, args: ValidateVotesOutcomeArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::validate_votes_outcome`, arguments: [ obj(tx, args.outcome), obj(tx, args.dao), obj(tx, args.clock) ], }) }

export function value( tx: Transaction, typeArg: string, staked: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::value`, typeArguments: [typeArg], arguments: [ obj(tx, staked) ], }) }

export interface VoteArgs { vote: TransactionObjectInput; account: TransactionObjectInput; answer: number | TransactionArgument; clock: TransactionObjectInput }

export function vote( tx: Transaction, typeArg: string, args: VoteArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::vote`, typeArguments: [typeArg], arguments: [ obj(tx, args.vote), obj(tx, args.account), pure(tx, args.answer, `u8`), obj(tx, args.clock) ], }) }

export function voteDaoAddr( tx: Transaction, typeArg: string, vote: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::vote_dao_addr`, typeArguments: [typeArg], arguments: [ obj(tx, vote) ], }) }

export function voteEnd( tx: Transaction, typeArg: string, vote: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::vote_end`, typeArguments: [typeArg], arguments: [ obj(tx, vote) ], }) }

export function votingQuorum( tx: Transaction, dao: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::voting_quorum`, arguments: [ obj(tx, dao) ], }) }

export function votingRule( tx: Transaction, dao: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::dao::voting_rule`, arguments: [ obj(tx, dao) ], }) }
