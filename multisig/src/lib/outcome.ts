import { Transaction } from "@mysten/sui/transactions";
import { approveIntent, disapproveIntent, executeIntent } from "../packages/account_multisig/multisig";

import { Outcome } from "@account.tech/core/lib/intents";
import { ACCOUNT_MULTISIG } from "./constants";

export class Approvals implements Outcome {
    static type = `${ACCOUNT_MULTISIG.V1}::multisig::Approvals`;

    multisig: string;
    key: string;
    // Approvals Data
    totalWeight: number;
    roleWeight: number;
    approved: string[];

    constructor(multisigId: string, key: string, fields: any) {
        this.multisig = multisigId;
        this.key = key;
        this.totalWeight = Number(fields.fields.total_weight);
        this.roleWeight = Number(fields.fields.role_weight);
        this.approved = fields.fields.approved.fields.contents;
    }

    hasApproved(addr: string): boolean {
        return this.approved!.includes(addr);
    }

    approve(tx: Transaction) {
        tx.add(
            approveIntent({ arguments: { account: this.multisig, key: this.key } })
        );
    }

    maybeApprove(tx: Transaction, caller: string) {
        if (!this.hasApproved(caller)) {
            this.approve(tx);
        }
    }

    disapprove(tx: Transaction) {
        tx.add(
            disapproveIntent({ arguments: { account: this.multisig, key: this.key } })
        );
    }

    execute(tx: Transaction) {
        tx.add(
            executeIntent({ arguments: { account: this.multisig, key: this.key } })
        );
    }
}
