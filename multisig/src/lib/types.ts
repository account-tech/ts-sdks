import { ACCOUNT_MULTISIG } from "./constants";
import { AccountData, ActionsRoles, Profile, ProtocolRoles } from "@account.tech/core";

export type DepStatus = {
    name: string;
    currentAddr: string;
    currentVersion: number;
    latestAddr: string;
    latestVersion: number;
}

export type IntentRole =
    | typeof ProtocolRoles[keyof typeof ProtocolRoles]
    | typeof ActionsRoles[keyof typeof ActionsRoles]
    | typeof MultisigRoles[keyof typeof MultisigRoles];

export const MultisigRoles = {
    MultisigConfig: `${ACCOUNT_MULTISIG.V1.slice(2)}::config`,
} as const;

export const MultisigIntentTypes = {
    ConfigMultisig: `${ACCOUNT_MULTISIG.V1}::config::ConfigMultisigIntent`,
} as const;

export type MultisigData = AccountData & {
    global: Role;
    roles: Record<string, Role>;
    members: MemberProfile[];
}

export type Role = {
    threshold: number,
    totalWeight: number,
}

export type Threshold = {
    name: string,
    threshold: number,
}

export type Member = {
    address: string,
    weight: number,
    roles: string[],
};

export type MemberProfile = Member & Profile;

export type ConfigMultisigArgs = {
    members?: Member[];
    thresholds?: { global: number, roles: Threshold[] };
}