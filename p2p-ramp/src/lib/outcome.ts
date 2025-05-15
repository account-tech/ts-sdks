import { Transaction, TransactionArgument } from "@mysten/sui/transactions";
import { Outcome } from "@account.tech/core";
import { P2P_RAMP } from "./constants";
import { HandshakeStatus } from "./types";

export class Approved implements Outcome {
    static type = `${P2P_RAMP.V1}::p2p_ramp::Approved`;

    constructor(
        public approved: boolean,
    ) {}
}

export class Handshake implements Outcome {
    static type = `${P2P_RAMP.V1}::p2p_ramp::Handshake`;

    accountId: string;
    key: string;

    fiatSender: string;
    coinSender: string;
    status: HandshakeStatus;

    constructor(accountId: string, key: string, fields: any) {
        this.accountId = accountId;
        this.key = key;
        this.fiatSender = fields.fields.fiat_sender;
        this.coinSender = fields.fields.coin_sender;
        this.status = fields.fields.status.variant;
    }

    flagAsPaid(
        tx: Transaction,
        key: string,
        account: string | TransactionArgument,
    ) {
        if (this.status !== "Requested") {
            throw new Error("Handshake is not requested");
        }
        return tx.moveCall({
            target: `${P2P_RAMP.V1}::p2p_ramp::flag_as_paid`,
            arguments: [
                typeof account === "string" ? tx.object(account) : account,
                tx.pure.string(key),
            ]
        });
    }

    flagAsSettled(
        tx: Transaction,
        key: string,
        account: string | TransactionArgument,
    ) {
        if (this.status !== "Paid") {
            throw new Error("Handshake is not paid");
        }
        return tx.moveCall({
            target: `${P2P_RAMP.V1}::p2p_ramp::flag_as_settled`,
            arguments: [
                typeof account === "string" ? tx.object(account) : account,
                tx.pure.string(key),
            ]
        });
    }

    flagAsDisputed(
        tx: Transaction,
        key: string,
        account: string | TransactionArgument,
    ) {
        if (this.status === "Disputed") {
            throw new Error("Handshake is already disputed");
        }
        return tx.moveCall({
            target: `${P2P_RAMP.V1}::p2p_ramp::flag_as_disputed`,
            arguments: [
                typeof account === "string" ? tx.object(account) : account,
                tx.pure.string(key),
            ]
        });
    }
}
