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
    
    paymentClient.setRecoveryAddress(
        tx,
        "0x197e6b7bb5607a333cc442849dc35a81149e0eb2559278d644cdcc3db50ffc91",
    );

    executeTx(tx);
})();