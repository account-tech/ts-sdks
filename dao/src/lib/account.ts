import { Transaction, TransactionArgument, TransactionResult } from "@mysten/sui/transactions";
import { normalizeStructTag } from "@mysten/sui/utils";

import { Account, Dep, ACCOUNT_PROTOCOL, EXTENSIONS, SUI_FRAMEWORK } from "@account.tech/core";
import { DAO_GENERICS, DAO_CONFIG_TYPE, ACCOUNT_DAO, DAO_REGISTRY } from "./constants";
import { DaoData } from "./types";

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
        const fields = (daoAccount.data?.content as any).fields

        const metadata = fields.metadata.fields.inner.fields.contents.map((m: any) => ({ key: m.fields.key, value: m.fields.value }));

        const deps: Dep[] = fields.deps.fields.inner.map((dep: any) => {
            return { name: dep.fields.name, addr: dep.fields.addr, version: Number(dep.fields.version) };
        });

        return {
            id,
            metadata,
            deps,
            unverifiedDepsAllowed: fields.deps.fields.unverified_allowed,
            lockedObjects: fields.intents.fields.locked.fields.contents,
            intentsBagId: fields.intents.fields.inner.fields.id.id,
            assetType: normalizeStructTag(fields.config.fields.asset_type.fields.name),
            authVotingPower: BigInt(fields.config.fields.auth_voting_power),
            unstakingCooldown: BigInt(fields.config.fields.unstaking_cooldown),
            votingRule: Number(fields.config.fields.voting_rule),
            maxVotingPower: BigInt(fields.config.fields.max_voting_power),
            minimumVotes: BigInt(fields.config.fields.minimum_votes),
            votingQuorum: BigInt(fields.config.fields.voting_quorum),
        }
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

    // only callable before sharing
    addMetadata(
        tx: Transaction,
        dao: TransactionArgument,
        name: string,
        description: string,
        image: string,
        twitter: string,
        telegram: string,
        discord: string,
        github: string,
        website: string,
    ): TransactionResult {
        return tx.moveCall({
            target: `${ACCOUNT_DAO.V1}::dao::add_metadata`,
            arguments: [
                dao,
                tx.pure.vector("string", ["name", "description", "image", "twitter", "telegram", "discord", "github", "website"]),
                tx.pure.vector("string", [name, description, image, twitter, telegram, discord, github, website]),
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
        staked: string | TransactionArgument,
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

