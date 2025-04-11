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
        "Shop",
        undefined,
        // ["0x3f50ede2b1e41f3515f03be51be68befea18fc20e22166406e584bf73c62c85c"],
        { username: "Thouny", profilePicture: "https://example.com/avatar.png" },
        // 2
    );

    executeTx(tx);
})();