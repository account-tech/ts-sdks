import { Transaction, TransactionResult } from "@mysten/sui/transactions";
import { approveIntent, disapproveIntent, executeIntent } from "../.gen/account-payment/payment/functions";
import { Pending as PendingRaw } from "../.gen/account-payment/payment/structs";

import { Outcome, CLOCK } from "@account.tech/core";
import { ACCOUNT_PAYMENT } from "./constants";

export class Pending implements Outcome {
    static type = `${ACCOUNT_PAYMENT.V1}::payment::Pending`;

    account: string;
    key: string;
    // Approvals Data
    approved_by: string | null;

    constructor(accountId: string, key: string, fields: any) {
        let pending = PendingRaw.fromFieldsWithTypes(fields);
        this.account = accountId;
        this.key = key;
        this.approved_by = pending.approvedBy;
    }

    // returns if the payment has been approved (optionally by a specific address)
    hasApproved(addr?: string): boolean {
        if (!addr) {
            return this.approved_by !== null;
        }
        return this.approved_by === addr;
    }

    approve(tx: Transaction): TransactionResult {
        return approveIntent(tx, { account: this.account, key: this.key });
    }

    maybeApprove(tx: Transaction, caller: string) {
        if (!this.hasApproved(caller)) {
            this.approve(tx);
        }
    }

    disapprove(tx: Transaction): TransactionResult {
        return disapproveIntent(tx, { account: this.account, key: this.key });
    }

    execute(tx: Transaction): TransactionResult {
        return executeIntent(tx, { account: this.account, key: this.key, clock: CLOCK });
    }
}
