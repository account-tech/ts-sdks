import { PaymentClient } from "../../src/payment-client";
import { ACCOUNT, NETWORK, testKeypair } from "./utils";

(async () => {
    const paymentClient = await PaymentClient.init(
        NETWORK,
        testKeypair.toSuiAddress(),
    );

    const userAccounts = paymentClient.getUserPaymentAccounts(); // merchant accounts for this user
    const accountId = userAccounts.find(a => a.name == "MyShop")?.id; // pick the one you want according to the name
    await paymentClient.switchAccount(accountId);

    console.log(paymentClient.paymentAccount);
})();