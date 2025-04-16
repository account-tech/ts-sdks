import { Transaction } from "@mysten/sui/transactions";
import { MultisigClient } from "../../src/multisig-client";
import { executeTx, NETWORK, MULTISIG, testKeypair } from "./utils";
import { Approvals } from "../../src/lib/outcome";
import { MULTISIG_GENERICS } from "../../src/lib/constants";
import { BorrowCapIntent } from "@account.tech/core";

/// Example showing how to borrow a cap and use it

(async () => {
    const ms = await MultisigClient.init(
        NETWORK,
        testKeypair.toSuiAddress(),
        MULTISIG,
    );

    const intentKey = "borrow-cap";
    const tx = new Transaction();
    
    const intent = ms.intents?.intents[intentKey] as BorrowCapIntent;
    if (!intent) throw new Error("Intent not found");
    // approve if necessary
    (intent.outcome as Approvals).maybeApprove(tx, testKeypair.toSuiAddress());
    
    // borrow the cap
    const executable = ms.multisig.executeIntent(tx, intentKey);
    let result = intent.execute(tx, MULTISIG_GENERICS, executable);

    /* add your code using the cap here */

    // return the cap
    intent.returnCap(tx, MULTISIG_GENERICS, tx.object(ms.multisig.id), executable, result);
    intent.completeExecution(tx, MULTISIG_GENERICS, executable);
    // if no more executions scheduled after this one, destroy intent
    if (intent.fields.executionTimes.length == 1) {
        intent.clearEmpty(tx, MULTISIG_GENERICS, ms.multisig.id, intentKey);
    }

    executeTx(tx);
})();