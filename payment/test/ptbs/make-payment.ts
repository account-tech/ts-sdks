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

    paymentClient.makePayment(
        tx,
        "b3810752c7f754e69c9c0de2ac5c794c30c6c00dfb37aa0290a8a1f4633dac47", // payment id
        1n, // tip amount
    );

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

    const data = (result.events?.[0]?.parsedJson as any);
    const [paymentId, timestamp, paidAmount, tipAmount, issuedBy] = [data.payment_id, data.timestamp, data.amount, data.tip, data.issued_by];
    // use this!
    console.log(paymentId, timestamp, paidAmount, tipAmount, issuedBy);
})();

