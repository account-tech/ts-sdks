import { PaymentClient } from "../../src/payment-client";
import { ACCOUNT, NETWORK, testKeypair } from "./utils";

(async () => {
    const paymentClient = await PaymentClient.init(
        NETWORK,
        testKeypair.toSuiAddress(),
        ACCOUNT
    );

    console.log(paymentClient.getPendingPayments());
})();