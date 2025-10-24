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
        "Main3", 
        { username: "devstr0ke", profilePicture: "https://example.com/avatar.png" }, 
        ["0x3f50ede2b1e41f3515f03be51be68befea18fc20e22166406e584bf73c62c85c", "0x30839f0ac9a87a39313af0bf0611032d7a910c2c850fb77d766ee283cf75f3a0", "0x7f592298170577d32f7d5322a9998d5eefe9d49420d32ef0eff9c684d992a890"],
        2
    );
    
    executeTx(tx);
})();