import { Transaction } from "@mysten/sui/transactions";
import { MultisigClient } from "../../src/multisig-client";
import { NETWORK, MULTISIG, testKeypair, executeTx } from "./utils";
import { ACCOUNT_ACTIONS, ACCOUNT_PROTOCOL } from "@account.tech/core";
import { ACCOUNT_MULTISIG } from "../../src/lib/constants";

(async () => {
    const ms = await MultisigClient.init(
        NETWORK,
        testKeypair.toSuiAddress(),
        MULTISIG
    );
    const tx = new Transaction();

    ms.requestWithdrawAndVest(
        tx,
        {key: "vest-coin-objects"},
        "0x2::sui::SUI",
        100n,
        1744620096000n,
        1744620196000n,
        testKeypair.toSuiAddress(),
    );
    
    executeTx(tx);
})();