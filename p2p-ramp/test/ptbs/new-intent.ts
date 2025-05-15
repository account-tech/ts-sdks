import { Transaction } from "@mysten/sui/transactions";
import { P2PRampClient } from "../../src/p2p-ramp-client";
import { NETWORK, ACCOUNT, testKeypair, executeTx } from "./utils";

(async () => {
    const p2pramp = await P2PRampClient.init(
        NETWORK,
        testKeypair.toSuiAddress(),
        ACCOUNT,
    );
    const tx = new Transaction();

    p2pramp.requestFillBuy(
        tx,
        { key: "fill-buy" },
        "0x0cfb6ff2b2b5dac100e065d8dca5e03fb3637a6e737c419ac58b74997f5ef41d",
        "0x2::sui::SUI",
        100n,
    );
    
    executeTx(tx);
})();