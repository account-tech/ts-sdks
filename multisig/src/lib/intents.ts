import { Transaction, TransactionArgument } from "@mysten/sui/transactions";
import * as config from "../packages/account_multisig/config";
import * as accountProtocol from "../packages/account_protocol/account";
import * as intents from "../packages/account_protocol/intents";

import { ConfigMultisigArgs, MultisigIntentTypes } from "./types";
import { Intent } from "@account.tech/core/lib/intents";

export class ConfigMultisigIntent extends Intent {
    static type = MultisigIntentTypes.ConfigMultisig;
    declare args: ConfigMultisigArgs;

    async init() {
        const actions = await this.fetchActions(this.fields.actionsId);
        const configMultisigAction = config.ConfigMultisigAction.fromBase64(actions[0]);

        this.args = {
            members: configMultisigAction.config.members.map((member) => ({
                address: member.addr,
                weight: Number(member.weight),
                roles: member.roles.contents,
            })),
            thresholds: {
                global: Number(configMultisigAction.config.global),
                roles: configMultisigAction.config.roles.map((role) => ({
                    name: role.name,
                    threshold: Number(role.threshold),
                })),
            },
        };
    }

    request(
        tx: Transaction,
        _accountGenerics: [string, string], // can be anything, this is just to respect the interface
        auth: TransactionArgument,
        account: string,
        params: TransactionArgument,
        outcome: TransactionArgument,
        actionArgs: ConfigMultisigArgs,
    ) {
        let addresses: string[] = [];
        let weights: bigint[] = [];
        let roles: string[][] = [];
        if (actionArgs.members) {
            actionArgs.members.forEach((member) => {
                addresses.push(member.address);
                weights.push(BigInt(member.weight));
                roles.push(member.roles);
            });
        }

        let global = 0n;
        let roleNames: string[] = [];
        let roleThresholds: bigint[] = [];
        if (actionArgs.thresholds) {
            global = BigInt(actionArgs.thresholds.global);
            actionArgs.thresholds.roles.forEach((role) => {
                roleNames.push(role.name);
                roleThresholds.push(BigInt(role.threshold));
            });
        }

        tx.add(
            config.requestConfigMultisig({
                arguments: {
                    auth,
                    account,
                    params,
                    outcome,
                    addresses,
                    weights,
                    roles,
                    global,
                    roleNames,
                    roleThresholds,
                }
            })
        );
    }

    execute(
        tx: Transaction,
        _accountGenerics: [string, string], // can be anything, this is just to respect the interface
        executable: TransactionArgument,
    ) {
        return tx.add(
            config.executeConfigMultisig({
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
            config.deleteConfigMultisig({
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
            config.deleteConfigMultisig({
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