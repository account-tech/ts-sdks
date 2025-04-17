import { ACCOUNT_DAO } from "./constants";
import { AccountData } from "@account.tech/core";

export type DepStatus = {
    name: string;
    currentAddr: string;
    currentVersion: number;
    latestAddr: string;
    latestVersion: number;
}

export const DAO_INTENT_TYPES = {
    ConfigDao: `${ACCOUNT_DAO.V1.slice(2)}::config::ConfigDaoIntent`,
} as const;

// account.ts

export type DaoData = AccountData & {
    // object type allowed for voting
    assetType: string,
    // voting power required to authenticate as a member (submit proposal, open vault, etc)
    authVotingPower: bigint,
    // cooldown when unstaking, voting power decreases linearly over time
    unstakingCooldown: bigint,
    // type of voting mechanism, u8 so we can add more in the future
    votingRule: bigint,
    // maximum voting power that can be used in a single vote (can be max_u64)
    maxVotingPower: bigint,
    // minimum number of votes needed to pass a proposal (can be 0 if not important)
    minimumVotes: bigint,
    // global voting threshold between (0, 1e9], If 50% votes needed, then should be > 500_000_000
    votingQuorum: bigint, 
}

// user.ts

export type Vote = {
    id: string;
    daoAddr: string;
    intentKey: string;
    answer: string;
    power: bigint;
    voteEnd: bigint;
    staked: Staked;
}

export type Staked = {
    id: string;
    daoAddr: string;
    value: bigint;
    unstaked: bigint;
    assetType: string;
}

// config.ts

export type ConfigDaoArgs = {
    assetType: string;
    authVotingPower: bigint;
    unstakingCooldown: bigint;
    votingRule: bigint;
    maxVotingPower: bigint;
    minimumVotes: bigint;
    votingQuorum: bigint;
}