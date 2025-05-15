import { P2P_RAMP } from "./constants";
import { AccountData } from "@account.tech/core";

export type DepStatus = {
    name: string;
    currentAddr: string;
    currentVersion: number;
    latestAddr: string;
    latestVersion: number;
}

export type HandshakeStatus = "Requested" | "Paid" | "Settled" | "Disputed";

export const P2PRampIntentTypes = {
    ConfigP2PRamp: `${P2P_RAMP.V1}::config::ConfigP2PRampIntent`,
    FillBuyIntent: `${P2P_RAMP.V1}::orders::FillBuyIntent`,
    FillSellIntent: `${P2P_RAMP.V1}::orders::FillSellIntent`,
} as const;

// account.ts

export type P2PRampData = AccountData & {
    members: string[];
}

// intents.ts

export type ConfigP2PRampArgs = {
    members: string[];
}

export type FillBuyArgs = {
    orderId: string;
    coinType: string;
    coinAmount: bigint;
}

export type FillSellArgs = {
    orderId: string;
    coinType: string;
    fiatAmount: bigint;
}

// dynamic-fields.ts

export type Order = {
    coinType: string;
    isBuy: boolean;
    minFill: bigint;
    maxFill: bigint;
    fiatAmount: bigint;
    fiatCode: string;
    coinAmount: bigint;
    coinBalance: any;
    pendingFill: bigint;
}