import { Transaction } from "@mysten/sui/transactions";
import { MultisigClient } from "../../src/multisig-client";
import { executeTx, NETWORK, testKeypair } from "./utils";

(async () => {
    const ms = await MultisigClient.init(
        NETWORK,
        testKeypair.toSuiAddress(),
    );

    const tx = new Transaction();

    ms.createMultisig(
        tx, 
        "Main", 
        { username: "Thouny", profilePicture: "https://example.com/avatar.png" }, 
        ["0x564c04d68f90ee093d7e2ab3014e4c602eadad24d09a51d21541510d43b946ac"],
        // 2
    );
    
    executeTx(tx);
})();