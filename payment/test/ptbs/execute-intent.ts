import { Transaction } from "@mysten/sui/transactions";
import { PaymentClient } from "../../src/payment-client";
import { executeTx, NETWORK, testKeypair, ACCOUNT } from "./utils";

(async () => {
    const paymentClient = await PaymentClient.init(
        NETWORK,
        testKeypair.toSuiAddress(),
        ACCOUNT
    );

    const tx = new Transaction();
    paymentClient.execute(tx, "config");

    executeTx(tx);
})();