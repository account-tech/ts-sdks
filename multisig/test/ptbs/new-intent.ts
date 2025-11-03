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

    ms.requestConfigDeps(
        tx,
        { key: "config-deps" },
        [
            {
                name: "account_protocol",
                addr: "0xb4cb9bfc37d340519e834165d6fc791ec279f756c2d3a3e2086ec22e09c04d3b",
                version: 1,
            },
            {
                name: "account_multisig",
                addr: "0xae205528b66901ceee822d9a932f0c14d2e0999eb13fbfa3403efff1afc5ea5e",
                version: 1,
            },
        ]
    )
    
    executeTx(tx);
})();