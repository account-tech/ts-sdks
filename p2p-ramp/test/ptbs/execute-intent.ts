import { Transaction } from "@mysten/sui/transactions";
import { P2PRampClient } from "../../src/p2p-ramp-client";
import { executeTx, NETWORK, ACCOUNT, testKeypair } from "./utils";

(async () => {
    const p2pramp = await P2PRampClient.init(
        NETWORK,
        testKeypair.toSuiAddress(),
        ACCOUNT,
    );

    const tx = new Transaction();
    p2pramp.executeHandshake(tx, "fill-buy");

    executeTx(tx);
})();