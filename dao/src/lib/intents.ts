import { Transaction, TransactionArgument, TransactionResult } from "@mysten/sui/transactions";
import * as accountProtocol from "../.gen/account-protocol/account/functions";
import * as intents from "../.gen/account-protocol/intents/functions";

import { ConfigDaoArgs, DaoIntentTypes } from "./types";
import { Intent, CLOCK } from "@account.tech/core";
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
        _accountGenerics: [string, string], // can be anything, this is just to respect the interface
        auth: TransactionArgument,
        account: string,
        params: TransactionArgument,
        outcome: TransactionArgument,
        actionArgs: ConfigDaoArgs,
    ): TransactionResult {

        return tx.moveCall(
            {
                target: `${ACCOUNT_DAO.V1}::config::request_config_dao`,
                typeArguments: [actionArgs.assetType],
                arguments: [
                    auth,
                    tx.object(account),
                    params,
                    outcome,
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
        _accountGenerics: [string, string], // can be anything, this is just to respect the interface
        executable: TransactionArgument,
    ): TransactionResult {
        return tx.moveCall({
            target: `${ACCOUNT_DAO.V1}::config::execute_config_dao`,
            arguments: [
                executable,
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
                clock: CLOCK,
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