import { Transaction, TransactionArgument } from "@mysten/sui/transactions";
import * as accountProtocol from "../packages/account_protocol/account";
import * as config from "../packages/account_dao/config";
import * as intents from "../packages/account_protocol/intents";

import { Intent } from "@account.tech/core/lib/intents";
import { ConfigDaoArgs, DaoIntentTypes } from "./types";

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
        auth: TransactionArgument,
        account: string,
        params: TransactionArgument,
        outcome: TransactionArgument,
        actionArgs: ConfigDaoArgs,
    ) {
        tx.add(
            config.requestConfigDao({
                typeArguments: [actionArgs.assetType],
                arguments: {
                    auth,
                    account,
                    params,
                    outcome,
                    authVotingPower: actionArgs.authVotingPower,
                    unstakingCooldown: actionArgs.unstakingCooldown,
                    votingRule: actionArgs.votingRule,
                    maxVotingPower: actionArgs.maxVotingPower,
                    minimumVotes: actionArgs.minimumVotes,
                    votingQuorum: actionArgs.votingQuorum,
                }
            })
        );
    }

    execute(
        tx: Transaction,
        _accountGenerics: null,
        executable: TransactionArgument,
    ) {
        tx.add(
            config.executeConfigDao({
                arguments: {
                    executable,
                    account: this.account,
                }
            })
        );
    }

    clearEmpty(
        tx: Transaction,
        accountGenerics: [string, string],
        key: string,
    ) {
        const expired = tx.add(
            accountProtocol.destroyEmptyIntent({
                typeArguments: accountGenerics,
                arguments: {
                    account: this.account,
                    key,
                }
            })
        );
        tx.add(
            config.deleteConfigDao({
                arguments: { expired }
            })
        );
        tx.add(
            intents.destroyEmptyExpired({
                arguments: { expired }
            })
        );
    }

    deleteExpired(
        tx: Transaction,
        accountGenerics: [string, string],
        key: string,
    ) {
        const expired = tx.add(
            accountProtocol.deleteExpiredIntent({
                typeArguments: accountGenerics,
                arguments: {
                    account: this.account,
                    key,
                }
            })
        );
        tx.add(
            config.deleteConfigDao({
                arguments: { expired }
            })
        );
        tx.add(
            intents.destroyEmptyExpired({
                arguments: { expired }
            })
        );
    }
}