import { Transaction } from "@mysten/sui/transactions";
import { PaymentClient } from "../../src/payment-client";
import { ACCOUNT, executeTx, NETWORK, testKeypair } from "./utils";

(async () => {
    const paymentClient = await PaymentClient.init(
        NETWORK,
        testKeypair.toSuiAddress(),
        ACCOUNT
    );

    const tx = new Transaction();
    tx.setGasBudget(1000000000); // on the dapp, leave this to wallet https://docs.sui.io/guides/developer/dev-cheat-sheet#apps

    paymentClient.initiateWithdraw(tx, "withdraw", "0x2::sui::SUI", 1000n, testKeypair.toSuiAddress());
    // paymentClient.completeWithdraw(tx, "withdraw");

    const result = await paymentClient.client.signAndExecuteTransaction({
        signer: testKeypair,
        transaction: tx,
        options: { showEffects: true, showEvents: true },
        requestType: "WaitForLocalExecution"
    });

    if (result.effects?.status.status != "success") {
        console.log(result.effects?.status.error);
    }
    console.log(result.effects?.status.status);
})();

