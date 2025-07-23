import { Transaction } from "@mysten/sui/transactions";
import { P2PRampClient } from "../../src/client/p2p-ramp-client";
import { executeTx, NETWORK, testKeypair } from "./utils";

(async () => {
    const p2pramp = await P2PRampClient.init(
        NETWORK,
        testKeypair.toSuiAddress(),
    );

    const tx = new Transaction();

    p2pramp.createAccount(tx, "test");

    executeTx(tx);
})();