import { ACCOUNT_PAYMENT } from "./constants";
import { ACCOUNT_ACTIONS, ACCOUNT_PROTOCOL, AccountData, Profile } from "@account.tech/core";

export type DepStatus = {
    name: string;
    currentAddr: string;
    currentVersion: number;
    latestAddr: string;
    latestVersion: number;
}

export const IntentTypes = {
    ConfigPayment: `${ACCOUNT_PAYMENT.V1}::config::ConfigPaymentIntent`,
    Pay: `${ACCOUNT_PAYMENT.V1}::pay::PayIntent`,
    // add more
} as const;

export const Roles = {
    Pay: `${ACCOUNT_PAYMENT.V1.slice(2)}::pay`,
    Config: `${ACCOUNT_PROTOCOL.V1.slice(2)}::config`,
    Owned: `${ACCOUNT_ACTIONS.V1.slice(2)}::owned_intents`,
    // add more
} as const;

export type PaymentData = AccountData & {
    members: MemberProfile[];
}

export type Member = {
    address: string,
    roles: string[],
};

export type MemberProfile = Member & Profile;

export type ConfigPaymentArgs = {
    members: Member[];
}

export type PayArgs = {
    coinType: string;
    amount: bigint;
    issuedBy: string;
}