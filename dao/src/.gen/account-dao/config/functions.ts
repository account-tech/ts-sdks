import {PUBLISHED_AT} from "..";
import {obj, pure} from "../../_framework/util";
import {Transaction, TransactionArgument, TransactionObjectInput} from "@mysten/sui/transactions";

export interface RequestConfigDaoArgs { auth: TransactionObjectInput; account: TransactionObjectInput; params: TransactionObjectInput; outcome: TransactionObjectInput; authVotingPower: bigint | TransactionArgument; unstakingCooldown: bigint | TransactionArgument; votingRule: number | TransactionArgument; maxVotingPower: bigint | TransactionArgument; minimumVotes: bigint | TransactionArgument; votingQuorum: bigint | TransactionArgument }

export function requestConfigDao( tx: Transaction, typeArg: string, args: RequestConfigDaoArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::config::request_config_dao`, typeArguments: [typeArg], arguments: [ obj(tx, args.auth), obj(tx, args.account), obj(tx, args.params), obj(tx, args.outcome), pure(tx, args.authVotingPower, `u64`), pure(tx, args.unstakingCooldown, `u64`), pure(tx, args.votingRule, `u8`), pure(tx, args.maxVotingPower, `u64`), pure(tx, args.minimumVotes, `u64`), pure(tx, args.votingQuorum, `u64`) ], }) }

export interface ExecuteConfigDaoArgs { executable: TransactionObjectInput; account: TransactionObjectInput }

export function executeConfigDao( tx: Transaction, args: ExecuteConfigDaoArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::config::execute_config_dao`, arguments: [ obj(tx, args.executable), obj(tx, args.account) ], }) }

export function deleteConfigDao( tx: Transaction, expired: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::config::delete_config_dao`, arguments: [ obj(tx, expired) ], }) }
