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

    ms.requestUpdateMetadata (
        tx,
        {key: "update-metadata" },
        "0x4b19cbec59f1e5835de1fad038a7af4e4e7034d2815ffeb8d3f4c65cb357467::coin::COIN",
        "New Name",
        "New Symbol",
        "New Description",
        "New Icon",
    );
    
    executeTx(tx);
})();