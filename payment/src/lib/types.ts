import { ACCOUNT_PAYMENT } from "./constants";
import { AccountData, Profile } from "@account.tech/core";

export type DepStatus = {
    name: string;
    currentAddr: string;
    currentVersion: number;
    latestAddr: string;
    latestVersion: number;
}

export const IntentTypes = {
    ConfigPayment: `${ACCOUNT_PAYMENT.V1.slice(2)}::config::ConfigPaymentIntent`,
    Pay: `${ACCOUNT_PAYMENT.V1.slice(2)}::pay::PayIntent`,
    // add more
} as const;

export const Roles = {
    Pay: `${ACCOUNT_PAYMENT.V1.slice(2)}::pay`,
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
    members?: Member[];
}

export type PayArgs = {
    coinType: string;
    amount: bigint;
    issuedBy: string;
}