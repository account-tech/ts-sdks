import { ACCOUNT_DAO } from "./constants";
import { AccountData, IntentArgs } from "@account.tech/core";

export type DepStatus = {
    name: string;
    currentAddr: string;
    currentVersion: number;
    latestAddr: string;
    latestVersion: number;
}

export type IntentStatus = {
    stage: 'pending' | 'open' | 'closed' | 'executable'; // vote not open > voting time > vote closed > executable
    deletable: boolean; // can be deleted because expiration time reached, (can still be resolved or executed)
}

export const DaoIntentTypes = {
    ConfigDao: `${ACCOUNT_DAO.V1.slice(2)}::config::ConfigDaoIntent`,
} as const;

export type VoteIntentArgs = IntentArgs & {
    startTime: bigint;
    endTime: bigint;
}

// account.ts

export type DaoData = AccountData & {
    // object type allowed for voting
    assetType: string,
    // voting power required to authenticate as a member (submit proposal, open vault, etc)
    authVotingPower: bigint,
    // cooldown when unstaking, voting power decreases linearly over time
    unstakingCooldown: bigint,
    // type of voting mechanism, u8 so we can add more in the future
    votingRule: number,
    // maximum voting power that can be used in a single vote (can be max_u64)
    maxVotingPower: bigint,
    // minimum number of votes needed to pass a proposal (can be 0 if not important)
    minimumVotes: bigint,
    // global voting threshold between (0, 1e9], If 50% votes needed, then should be > 500_000_000
    votingQuorum: bigint, 
}

export type DaoMetadata = {
    name: string,
    description: string,
    image: string,
    twitter: string,
    telegram: string,
    discord: string,
    github: string,
    website: string,
}

// user.ts

export type Vote = {
    id: string;
    daoAddr: string;
    intentKey: string;
    answer: number;
    power: bigint;
    voteEnd: bigint;
    staked: Staked;
}

export type Staked = {
    id: string;
    daoAddr: string;
    value: bigint;
    unstaked: bigint | null;
    assetType: string;
}

// config.ts

export type ConfigDaoArgs = {
    assetType: string;
    authVotingPower: bigint;
    unstakingCooldown: bigint;
    votingRule: number;
    maxVotingPower: bigint;
    minimumVotes: bigint;
    votingQuorum: bigint;
}