import { Transaction, TransactionResult, TransactionObjectInput } from "@mysten/sui/transactions";
import * as accountProtocol from "../.gen/account-protocol/account/functions";
import * as intents from "../.gen/account-protocol/intents/functions";

import { Intent } from "@account.tech/core/lib/intents";
import { ConfigDaoArgs, DaoIntentTypes } from "./types";
import { ACCOUNT_DAO } from "./constants";

export class ConfigDaoIntent extends Intent {
    static type = DaoIntentTypes.ConfigDao;
    declare args: ConfigDaoArgs;

    async init() {
        const actions = await this.fetchActions(this.fields.actionsId);
        const configDaoAction = actions[0].fields;

        this.args = {
            assetType: configDaoAction.config.fields.asset_type.fields.name,
            authVotingPower: BigInt(configDaoAction.config.fields.auth_voting_power),
            unstakingCooldown: BigInt(configDaoAction.config.fields.unstaking_cooldown),
            votingRule: Number(configDaoAction.config.fields.voting_rule),
            maxVotingPower: BigInt(configDaoAction.config.fields.max_voting_power),
            minimumVotes: BigInt(configDaoAction.config.fields.minimum_votes),
            votingQuorum: BigInt(configDaoAction.config.fields.voting_quorum),
        };
    }

    request(
        tx: Transaction,
        _accountGenerics: null, 
        auth: TransactionObjectInput,
        account: string,
        params: TransactionObjectInput,
        outcome: TransactionObjectInput,
        actionArgs: ConfigDaoArgs,
    ): TransactionResult {

        return tx.moveCall(
            {
                target: `${ACCOUNT_DAO.V1}::config::request_config_dao`,
                typeArguments: [actionArgs.assetType],
                arguments: [
                    tx.object(auth),
                    tx.object(account),
                    tx.object(params),
                    tx.object(outcome),
                    tx.pure.u64(actionArgs.authVotingPower),
                    tx.pure.u64(actionArgs.unstakingCooldown),
                    tx.pure.u8(actionArgs.votingRule),
                    tx.pure.u64(actionArgs.maxVotingPower),
                    tx.pure.u64(actionArgs.minimumVotes),
                    tx.pure.u64(actionArgs.votingQuorum)
                ],
            }
        );
    }

    execute(
        tx: Transaction,
        _accountGenerics: null,
        executable: TransactionObjectInput,
    ): TransactionResult {
        return tx.moveCall({
            target: `${ACCOUNT_DAO.V1}::config::execute_config_dao`,
            arguments: [
                tx.object(executable),
                tx.object(this.account),
            ],
        });
    }

    clearEmpty(
        tx: Transaction,
        accountGenerics: [string, string],
        key: string,
    ): TransactionResult {
        const expired = accountProtocol.destroyEmptyIntent(
            tx,
            accountGenerics,
            {
                account: this.account,
                key,
            }
        );
        tx.moveCall({
            target: `${ACCOUNT_DAO.V1}::config::delete_config_dao`,
            arguments: [
                expired,
            ],
        });
        return intents.destroyEmptyExpired(
            tx,
            expired,
        );
    }

    deleteExpired(
        tx: Transaction,
        accountGenerics: [string, string],
        key: string,
    ): TransactionResult {
        const expired = accountProtocol.deleteExpiredIntent(
            tx,
            accountGenerics,
            {
                account: this.account,
                key,
                clock: tx.object.clock,
            }
        );
        tx.moveCall({
            target: `${ACCOUNT_DAO.V1}::config::delete_config_dao`,
            arguments: [
                expired,
            ],
        });
        return intents.destroyEmptyExpired(
            tx,
            expired,
        );
    }
}