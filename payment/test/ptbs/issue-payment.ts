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

    paymentClient.issuePayment(
        tx,
        "large coffee",
        "0x2::sui::SUI", // or "0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC" for testnet
        10n,
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
    const [paymentId, amount, issuedBy] = [data.payment_id, data.amount, data.issued_by];
    // use this!
    console.log(paymentId, amount, issuedBy);

})();

// "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC" on mainnet