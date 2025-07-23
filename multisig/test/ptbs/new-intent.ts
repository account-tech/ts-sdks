import { Transaction } from "@mysten/sui/transactions";
import { MultisigClient } from "../../src/multisig-client";
import { NETWORK, MULTISIG, testKeypair, executeTx } from "./utils";

(async () => {
    const ms = await MultisigClient.init(
        NETWORK,
        testKeypair.toSuiAddress(),
        MULTISIG
    );
    const tx = new Transaction();

    // const coin = tx.splitCoins(tx.gas, [5n]);
    // tx.transferObjects([coin], "0xfdad7ba77f88e7d082787cb8a3d517bc58b533bee5950024ae4c7a5799a8979f");

    ms.requestWithdrawAndBurn (
        tx,
        {key: "spend" },
        "0x2::sui::SUI",
        5n
    );
    
    executeTx(tx);
})();