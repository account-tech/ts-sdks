import { Transaction } from "@mysten/sui/transactions";
import { MultisigClient } from "../../src/multisig-client";
import { emptyKeypair, executeTx, MULTISIG, NETWORK, testKeypair } from "./utils";

(async () => {
    const ms = await MultisigClient.init(
        NETWORK,
        emptyKeypair.toSuiAddress(),
        MULTISIG,
    );

    const tx = new Transaction();
    
    ms.acceptInvite(tx, "0x7582562ac75d977bbca971a81edb10b385fd9e17aa25e26a85c476e81fe7ff43");

    executeTx(tx);
})();