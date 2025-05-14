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

    constructor(
        public fiatSender: string,
        public coinSender: string,
        public status: HandshakeStatus,
    ) {}

    flagAsPaid(
        tx: Transaction,
        key: string,
        account: string | TransactionArgument,
    ) {
        if (this.status !== HandshakeStatus.Requested) {
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
        if (this.status !== HandshakeStatus.Paid) {
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
        if (this.status === HandshakeStatus.Disputed) {
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
