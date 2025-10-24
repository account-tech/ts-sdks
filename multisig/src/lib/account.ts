import { Transaction, TransactionArgument, TransactionResult } from "@mysten/sui/transactions";
import { Account as AccountRaw, destroyEmptyIntent, confirmExecution } from "../packages/account_protocol/account";
import { Multisig as MultisigRaw, newAccount } from "../packages/account_multisig/multisig";
import * as configMultisig from "../packages/account_multisig/config";
import * as config from "../packages/account_protocol/config";
import { approveIntent, disapproveIntent, executeIntent, authenticate, emptyOutcome, sendInvite, join, leave } from "../packages/account_multisig/multisig";
import { destroyEmptyExpired } from "../packages/account_protocol/intents";
import { Fees as FeesRaw } from "../packages/account_multisig/fees";

import { Account, Dep } from "@account.tech/core/lib/account";
import { ACCOUNT_PROTOCOL, EXTENSIONS, SUI_FRAMEWORK } from "@account.tech/core/types";
import { Intent, ConfigDepsArgs } from "@account.tech/core/lib/intents";
import { User } from "@account.tech/core/lib/user";
import { Role, MemberProfile, MultisigData, ConfigMultisigArgs } from "./types";
import { MULTISIG_FEES, MULTISIG_GENERICS, MULTISIG_CONFIG_TYPE } from "./constants";
import { RawTransactionArgument } from "src/packages/utils";

export class Multisig extends Account implements MultisigData {
    static type = MULTISIG_CONFIG_TYPE;

    global: Role = { threshold: 0, totalWeight: 0 };
    roles: Record<string, Role> = {};
    members: MemberProfile[] = [];
    fees: bigint = 0n;

    async init(id?: string): Promise<void> {
        if (id) {
            this.id = id;
            await this.refresh();
        } else {
            this.fees = await this.fetchFees();
        }
    }

    async fetch(id: string = this.id): Promise<MultisigData> {
        if (!id && !this.id) {
            throw new Error("No address provided to refresh multisig");
        }

        const multisigObj = await this.client.getObject({
            id,
            options: { showBcs: true },
        });
        if (multisigObj.data?.bcs?.dataType !== 'moveObject') {
            throw new Error('Expected a move object')
        }

        const multisigAccount = AccountRaw(MultisigRaw).fromBase64(multisigObj.data.bcs.bcsBytes);
        // get metadata
        const metadata = multisigAccount.metadata.inner.contents.map((m: any) => ({ key: m.key, value: m.value }));

        // get deps
        const deps: Dep[] = multisigAccount.deps.inner.map(dep => {
            return { name: dep.name, addr: dep.addr, version: Number(dep.version) };
        });

        // get all members" data (from account and member)
        const membersAddress: string[] = multisigAccount.config.members.map(member => member.addr);
        const members = await Promise.all(membersAddress.map(async address => {
            const weight = multisigAccount.config.members.find(m => m.addr == address)?.weight;
            const roles = multisigAccount.config.members.find(m => m.addr == address)?.roles.contents;
            const user = await User.init(this.client, MULTISIG_CONFIG_TYPE);
            const { username, avatar } = await user.fetchProfile(address);
            return {
                address,
                username,
                avatar, 
                weight: Number(weight)!,
                roles: roles!
            }
        }));

        // calculate total weights
        const globalWeight = members.reduce((acc, member) => acc + member.weight, 0);
        // Calculate total weights for each role
        const roleWeights: Record<string, number> = {};
        members.forEach(member => {
            member.roles.forEach(role => {
                const currentWeight = roleWeights[role] || 0;
                roleWeights[role] = currentWeight + member.weight;
            });
        });
        // get thresholds
        const global = { threshold: Number(multisigAccount.config.global), totalWeight: globalWeight };
        const roles: Record<string, Role> = {};
        multisigAccount.config.roles.forEach(role => {
            roles[role.name] = { threshold: Number(role.threshold), totalWeight: roleWeights[role.name] || 0 };
        });

        return {
            id: multisigAccount.id.id,
            metadata,
            deps,
            unverifiedDepsAllowed: multisigAccount.deps.unverified_allowed,
            intentsBagId: multisigAccount.intents.inner.id.id,
            global,
            roles,
            members,
        }
    }

    async fetchFees(): Promise<bigint> {
        const feesObj = await this.client.getObject({
            id: MULTISIG_FEES,
            options: { showBcs: true },
        });
        if (feesObj.data?.bcs?.dataType !== 'moveObject') {
            throw new Error('Expected a move object')
        }

        const fees = FeesRaw.fromBase64(feesObj.data.bcs.bcsBytes);
        return BigInt(fees.amount);
    }

    async refresh(id: string = this.id) {
        this.setData(await this.fetch(id));
        this.fees = await this.fetchFees();
    }

    setData(multisig: MultisigData) {
        this.id = multisig.id;
        this.metadata = multisig.metadata;
        this.deps = multisig.deps;
        this.unverifiedDepsAllowed = multisig.unverifiedDepsAllowed;
        this.intentsBagId = multisig.intentsBagId;
        this.global = multisig.global;
        this.roles = multisig.roles;
        this.members = multisig.members;
    }

    getData(): MultisigData {
        return {
            id: this.id,
            metadata: this.metadata,
            deps: this.deps,
            unverifiedDepsAllowed: this.unverifiedDepsAllowed,
            intentsBagId: this.intentsBagId,
            global: this.global,
            roles: this.roles,
            members: this.members,
        }
    }

    member(addr: string): MemberProfile {
        const member = this.members?.find(m => m.address == addr);
        if (!member) {
            throw new Error(`Member with address ${addr} not found.`);
        }
        return member;
    }

    newMultisig(
        tx: Transaction,
        coin: RawTransactionArgument<string>,
    ): TransactionResult {
        return tx.add(
            newAccount({
                arguments: {
                    extensions: EXTENSIONS,
                    fees: MULTISIG_FEES,
                    coin,
                }
            })
        );
    }

    shareMultisig(
        tx: Transaction,
        account: TransactionArgument,
    ) {
        tx.moveCall({
            target: `${SUI_FRAMEWORK}::transfer::public_share_object`,
            typeArguments: [`${ACCOUNT_PROTOCOL.V1}::account::Account<${MULTISIG_GENERICS[0]}>`],
            arguments: [account],
        });
    }

    joinMultisig(
        tx: Transaction,
        user: RawTransactionArgument<string>,
        account: RawTransactionArgument<string> = this.id,
    ) {
        if (!account) {
            throw new Error("No account available: this.id is not set and no account was provided");
        }
        tx.add(
            join({ arguments: { user, account } })
        );
    }

    leaveMultisig(
        tx: Transaction,
        user: RawTransactionArgument<string>,
        account: RawTransactionArgument<string> = this.id,
    ) {
        if (!account) {
            throw new Error("No account available: this.id is not set and no account was provided");
        }
        tx.add(
            leave({ arguments: { user, account } })
        );
    }

    sendInvite(
        tx: Transaction,
        recipient: string,
        account: RawTransactionArgument<string> = this.id,
    ) {
        if (!account) {
            throw new Error("No account available: this.id is not set and no account was provided");
        }
        tx.add(
            sendInvite({ arguments: { account, recipient } })
        );
    }

    authenticate(
        tx: Transaction,
        account: RawTransactionArgument<string> = this.id,
    ): TransactionResult {
        if (!account) {
            throw new Error("No account available: this.id is not set and no account was provided");
        }
        return tx.add(
            authenticate({ arguments: { account } })
        );
    }

    emptyApprovalsOutcome(tx: Transaction): TransactionResult {
        return tx.add(
            emptyOutcome()
        );
    }

    approveIntent(
        tx: Transaction,
        key: string,
        account: RawTransactionArgument<string> = this.id,
    ) {
        if (!account) {
            throw new Error("No account available: this.id is not set and no account was provided");
        }
        tx.add(
            approveIntent({ arguments: { account, key } })
        );
    }

    disapproveIntent(
        tx: Transaction,
        key: string,
        account: RawTransactionArgument<string> = this.id,
    ) {
        if (!account) {
            throw new Error("No account available: this.id is not set and no account was provided");
        }
        tx.add(
            disapproveIntent({ arguments: { account, key } })
        );
    }

    executeIntent(
        tx: Transaction,
        key: string,
        account: RawTransactionArgument<string> = this.id,
    ): TransactionResult {
        if (!account) {
            throw new Error("No account available: this.id is not set and no account was provided");
        }
        return tx.add(
            executeIntent({ arguments: { account, key } })
        );
    }

    // === Atomic Intents ===

    atomicConfigMultisig(
        tx: Transaction,
        actionsArgs: ConfigMultisigArgs,
        account: RawTransactionArgument<string> = this.id,
    ) {
        if (!account) {
            throw new Error("No account available: this.id is not set and no account was provided");
        }

        let addresses: string[] = [];
        let weights: bigint[] = [];
        let roles: string[][] = [];
        if (actionsArgs.members) {
            actionsArgs.members.forEach((member) => {
                addresses.push(member.address);
                weights.push(BigInt(member.weight));
                roles.push(member.roles);
            });
        }

        let global = 0n;
        let roleNames: string[] = [];
        let roleThresholds: bigint[] = [];
        if (actionsArgs.thresholds) {
            global = BigInt(actionsArgs.thresholds.global);
            actionsArgs.thresholds.roles.forEach((role) => {
                roleNames.push(role.name);
                roleThresholds.push(BigInt(role.threshold));
            });
        }

        const auth = this.authenticate(tx, account);
        const params = Intent.createParams(tx, { key: "config-multisig" });
        const outcome = this.emptyApprovalsOutcome(tx);

        tx.add(
            configMultisig.requestConfigMultisig({
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

        this.approveIntent(tx, "config-multisig", account);
        const executable = this.executeIntent(tx, "config-multisig", account);
        tx.add(
            configMultisig.executeConfigMultisig({
                arguments: {
                    executable,
                    account,
                }
            })
        );
        tx.add(
            confirmExecution({
                typeArguments: MULTISIG_GENERICS,
                arguments: {
                    account,
                    executable,
                }
            })
        );

        const expired = tx.add(
            destroyEmptyIntent({
                typeArguments: MULTISIG_GENERICS,
                arguments: {
                    account,
                    key: "config-multisig",
                }
            })
        );
        tx.add(
            configMultisig.deleteConfigMultisig({ arguments: { expired } })
        );
        tx.add(
            destroyEmptyExpired({ arguments: { expired } })
        );
    }

    atomicToggleUnverifiedDepsAllowed(
        tx: Transaction,
        account: RawTransactionArgument<string> = this.id,
    ) {
        if (!account) {
            throw new Error("No account available: this.id is not set and no account was provided");
        }
        const auth = this.authenticate(tx, account);
        const params = Intent.createParams(tx, { key: "toggle-unverified-deps" });
        const outcome = this.emptyApprovalsOutcome(tx);

        tx.add(
            config.requestToggleUnverifiedAllowed({
                typeArguments: MULTISIG_GENERICS,
                arguments: { auth, account, params, outcome }
            })
        );
        
        this.approveIntent(tx, "toggle-unverified-deps", account);
        const executable = this.executeIntent(tx, "toggle-unverified-deps", account);
        tx.add(
            config.executeToggleUnverifiedAllowed({ 
                typeArguments: MULTISIG_GENERICS,
                arguments: { executable, account },
            })
        );
        tx.add(
            confirmExecution({
                typeArguments: MULTISIG_GENERICS,
                arguments: { account, executable }
            })
        );

        const expired = tx.add(
            destroyEmptyIntent({ 
                typeArguments: MULTISIG_GENERICS, 
                arguments: { account, key: "toggle-unverified-deps" } 
            })
        );
        tx.add(
            config.deleteToggleUnverifiedAllowed({ arguments: { expired } })
        );
        tx.add(
            destroyEmptyExpired({ arguments: { expired } })
        );
    }

    atomicConfigDeps(
        tx: Transaction,
        actionsArgs: ConfigDepsArgs,
        account: RawTransactionArgument<string> = this.id,
    ) {
        if (!account) {
            throw new Error("No account available: this.id is not set and no account was provided");
        }

        const names: string[] = [];
        const addresses: string[] = [];
        const versions: bigint[] = [];
        actionsArgs.deps.forEach((dep) => {
            names.push(dep.name);
            addresses.push(dep.addr);
            versions.push(BigInt(dep.version));
        });

        const auth = this.authenticate(tx, account);
        const params = Intent.createParams(tx, { key: "config-deps" });
        const outcome = this.emptyApprovalsOutcome(tx);

        tx.add(
            config.requestConfigDeps({
                typeArguments: MULTISIG_GENERICS,
                arguments: {
                    auth,
                    account,
                    params,
                    outcome,
                    extensions: EXTENSIONS,
                    names,
                    addresses,
                    versions,
                }
            })
        );

        this.approveIntent(tx, "config-deps", account);
        const executable = this.executeIntent(tx, "config-deps", account);

        tx.add(
            config.executeConfigDeps({
                typeArguments: MULTISIG_GENERICS,
                arguments: { executable, account }
            })
        );
        tx.add(
            confirmExecution({
                typeArguments: MULTISIG_GENERICS,
                arguments: { account, executable }
            })
        );
        
        const expired = tx.add(
            destroyEmptyIntent({
                typeArguments: MULTISIG_GENERICS,
                arguments: { account, key: "config-deps" }
            })
        );
        tx.add(
            config.deleteConfigDeps({ arguments: { expired } })
        );
        tx.add(
            destroyEmptyExpired({ arguments: { expired } })
        );
    }
}

