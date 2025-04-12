import { Transaction } from "@mysten/sui/transactions";
import { PaymentClient } from "../../src/payment-client";
import { NETWORK, ACCOUNT, testKeypair, executeTx } from "./utils";
import { ACCOUNT_ACTIONS, ACCOUNT_PROTOCOL } from "@account.tech/core";
import { ACCOUNT_PAYMENT } from "../../src/lib/constants";

(async () => {
    const paymentClient = await PaymentClient.init(
        NETWORK,
        testKeypair.toSuiAddress(),
        ACCOUNT
    );
    const tx = new Transaction();
    
    paymentClient.setOwnerAddress(
        tx,
        testKeypair.toSuiAddress(),
    );

    executeTx(tx);
})();