import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { ACCOUNT, NETWORK, testKeypair } from "./utils";
import { PaymentClient } from "../../src/payment-client";

(async () => {
    const paymentClient = await PaymentClient.init(
        NETWORK,
        testKeypair.toSuiAddress(),
        ACCOUNT
    );
    console.log(paymentClient.getOwnedObjects());
})();
