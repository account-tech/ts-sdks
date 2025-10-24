import { Transaction } from "@mysten/sui/transactions";
import { approveIntent, disapproveIntent, executeIntent, Approvals as ApprovalsRaw } from "../packages/account_multisig/multisig";

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
        let approvals = ApprovalsRaw.fromBase64(fields);
        this.multisig = multisigId;
        this.key = key;
        this.totalWeight = Number(approvals.total_weight);
        this.roleWeight = Number(approvals.role_weight);
        this.approved = approvals.approved.contents;
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
