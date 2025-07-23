import { Transaction } from "@mysten/sui/transactions";
import { PaymentClient } from "../../src/payment-client";
import { executeTx, NETWORK, testKeypair } from "./utils";

(async () => {
    const paymentClient = await PaymentClient.init(
        NETWORK,
        testKeypair.toSuiAddress(),
    );

    const tx = new Transaction();

    paymentClient.createPaymentAccount(
        tx,
        "MyShop", // dynamic input
        { username: "", profilePicture: "" },
    );

    executeTx(tx);
})();