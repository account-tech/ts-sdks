import { Transaction, TransactionArgument, TransactionObjectInput, TransactionResult } from "@mysten/sui/transactions";
import { Account as AccountRaw } from "../.gen/account-protocol/account/structs";
import { destroyEmptyIntent, confirmExecution } from "../.gen/account-protocol/account/functions";
import * as config from "../.gen/account-protocol/config/functions";
import { destroyEmptyExpired } from "../.gen/account-protocol/intents/functions";
import { DepFields } from "../.gen/account-protocol/deps/structs";

import { User, Account, Intent, Dep, ConfigDepsArgs, ACCOUNT_PROTOCOL, CLOCK, EXTENSIONS, SUI_FRAMEWORK, TransactionPureInput } from "@account.tech/core";
import { DAO_GENERICS, DAO_CONFIG_TYPE, ACCOUNT_DAO, DAO_REGISTRY } from "./constants";
import { ConfigDaoArgs, DaoData } from "./types";

export class Dao extends Account implements DaoData {
    static type = DAO_CONFIG_TYPE;

    assetType: string = "";
    authVotingPower: bigint = 0n;
    unstakingCooldown: bigint = 0n;
    votingRule: number = 0;
    maxVotingPower: bigint = 0n;
    minimumVotes: bigint = 0n;
    votingQuorum: bigint = 0n;

    async init(id?: string): Promise<void> {
        if (id) {
            this.id = id;
            await this.refresh();
        }
    }

    async fetch(id: string = this.id)/*: Promise<DaoData> */ {
        if (!id && !this.id) {
            throw new Error("No address provided to refresh multisig");
        }

        const daoAccount = await this.client.getObject({
            id: this.id,
            options: { showContent: true },
        });

        // // get metadata
        // const metadata = multisigAccount.metadata.inner.contents.map((m: any) => ({ key: m.key, value: m.value }));

        // // get deps
        // const deps: Dep[] = multisigAccount.deps.inner.map((dep: DepFields) => {
        //     return { name: dep.name, addr: dep.addr, version: Number(dep.version) };
        // });

        // return {
        //     id: multisigAccount.id,
        //     metadata,
        //     deps,
        //     unverifiedDepsAllowed: multisigAccount.deps.unverifiedAllowed,
        //     lockedObjects: multisigAccount.intents.locked.contents,
        //     intentsBagId: multisigAccount.intents.inner.id,
        //     assetType,
        //     authVotingPower,
        //     unstakingCooldown,
        //     votingRule,
        //     maxVotingPower,
        //     minimumVotes,
        //     votingQuorum,
        // }
    }

    // async fetchFees(): Promise<bigint> {
    //     const fees = await FeesRaw.fetch(this.client, MULTISIG_FEES);
    //     return fees.amount;
    // }

    async refresh(id: string = this.id) {
        this.setData(await this.fetch(id));
        // this.fees = await this.fetchFees();
    }

    setData(dao: DaoData) {
        this.id = dao.id;
        this.metadata = dao.metadata;
        this.deps = dao.deps;
        this.unverifiedDepsAllowed = dao.unverifiedDepsAllowed;
        this.lockedObjects = dao.lockedObjects;
        this.intentsBagId = dao.intentsBagId;
        this.assetType = dao.assetType;
        this.authVotingPower = dao.authVotingPower;
        this.unstakingCooldown = dao.unstakingCooldown;
        this.votingRule = dao.votingRule;
        this.maxVotingPower = dao.maxVotingPower;
        this.minimumVotes = dao.minimumVotes;
        this.votingQuorum = dao.votingQuorum;
    }

    getData(): DaoData {
        return {
            id: this.id,
            metadata: this.metadata,
            deps: this.deps,
            unverifiedDepsAllowed: this.unverifiedDepsAllowed,
            lockedObjects: this.lockedObjects,
            intentsBagId: this.intentsBagId,
            assetType: this.assetType,
            authVotingPower: this.authVotingPower,
            unstakingCooldown: this.unstakingCooldown,
            votingRule: this.votingRule,
            maxVotingPower: this.maxVotingPower,
            minimumVotes: this.minimumVotes,
            votingQuorum: this.votingQuorum,
        }
    }


    newDao(
        tx: Transaction,
        assetType: string,
        authVotingPower: bigint,
        unstakingCooldown: bigint,
        votingRule: number,
        maxVotingPower: bigint,
        minimumVotes: bigint,
        votingQuorum: bigint,
    ): TransactionResult {
        return tx.moveCall({
            target: `${ACCOUNT_DAO.V1}::dao::new_account`,
            typeArguments: [assetType],
            arguments: [
                tx.object(DAO_REGISTRY),
                tx.object(EXTENSIONS),
                tx.pure.u64(authVotingPower),
                tx.pure.u64(unstakingCooldown),
                tx.pure.u8(votingRule),
                tx.pure.u64(maxVotingPower),
                tx.pure.u64(minimumVotes),
                tx.pure.u64(votingQuorum),
            ],
        });
    }

    shareDao(
        tx: Transaction,
        account: TransactionArgument,
    ): TransactionResult {
        return tx.moveCall({
            package: SUI_FRAMEWORK,
            module: "transfer",
            function: "public_share_object",
            typeArguments: [`${ACCOUNT_PROTOCOL.V1}::account::Account<${DAO_GENERICS[0]}>`],
            arguments: [account],
        });
    }

    joinDao(
        tx: Transaction,
        user: string | TransactionArgument,
        account: string | TransactionArgument = this.id,
    ): TransactionResult {
        if (!account) {
            throw new Error("No account available: this.id is not set and no account was provided");
        }
        return tx.moveCall({
            target: `${ACCOUNT_DAO.V1}::dao::join`,
            arguments: [
                typeof user === "string" ? tx.object(user) : user,
                typeof account === "string" ? tx.object(account) : account,
            ],
        });
    }

    leaveDao(
        tx: Transaction,
        user: string,
        account: string = this.id,
    ): TransactionResult {
        if (!account) {
            throw new Error("No account available: this.id is not set and no account was provided");
        }
        return tx.moveCall({
            target: `${ACCOUNT_DAO.V1}::dao::leave`,
            arguments: [
                tx.object(user),
                tx.object(account),
            ],
        });
    }

    authenticate(
        tx: Transaction,
        staked: string | TransactionArgument = this.id,
        account: string | TransactionArgument = this.id,
    ): TransactionResult {
        if (!account) {
            throw new Error("No account available: this.id is not set and no account was provided");
        }
        return tx.moveCall({
            target: `${ACCOUNT_DAO.V1}::dao::authenticate`,
            typeArguments: [this.assetType],
            arguments: [
                typeof staked === "string" ? tx.object(staked) : staked,
                typeof account === "string" ? tx.object(account) : account,
                tx.object.clock
            ],
        });
    }

    emptyVotesOutcome(
        tx: Transaction,
        startTime: bigint,
        endTime: bigint,
    ): TransactionResult {
        return tx.moveCall({
            target: `${ACCOUNT_DAO.V1}::dao::empty_votes_outcome`,
            arguments: [
                tx.pure.u64(startTime),
                tx.pure.u64(endTime),
                tx.object.clock,
            ],
        });
    }

    executeVotesIntent(
        tx: Transaction,
        key: string,
        account: string | TransactionArgument = this.id,
    ): TransactionResult {
        if (!account) {
            throw new Error("No account available: this.id is not set and no account was provided");
        }
        return tx.moveCall({
            target: `${ACCOUNT_DAO.V1}::dao::execute_votes_intent`,
            arguments: [
                typeof account === "string" ? tx.object(account) : account,
                tx.pure.string(key),
                tx.object.clock,
            ],
        });
    }
}

