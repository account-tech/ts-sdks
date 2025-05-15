import { Transaction } from "@mysten/sui/transactions";
import { P2PRampClient } from "../../src/p2p-ramp-client";
import { executeTx, ACCOUNT, NETWORK, testKeypair } from "./utils";

(async () => {
    const p2pramp = await P2PRampClient.init(
        NETWORK,
        testKeypair.toSuiAddress(),
        ACCOUNT,
    );

    const tx = new Transaction();

    p2pramp.createOrder(
        tx,
        true,
        100000n, // 1000.00 USD
        "USD",
        200000000n, // 0.200000000 SUI
        "0x2::sui::SUI",
        0n,
        100n,
    );

    executeTx(tx);
})();