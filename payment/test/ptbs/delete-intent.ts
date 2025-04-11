import { Transaction } from "@mysten/sui/transactions";
import { PaymentClient } from "../../src/payment-client";
import { executeTx, NETWORK, ACCOUNT, testKeypair } from "./utils";

(async () => {
    const paymentClient = await PaymentClient.init(
        NETWORK,
        testKeypair.toSuiAddress(),
        ACCOUNT,
    );

    const tx = new Transaction();
    paymentClient.delete(tx, "config");

    executeTx(tx);
})();