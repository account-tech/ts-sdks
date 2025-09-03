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
        ["0x3c00d56434d581fdfd6e280626f7c8ee75cc9dac134d84290491e65f9b8b7161"],
        // 2
    );
    
    executeTx(tx);
})();