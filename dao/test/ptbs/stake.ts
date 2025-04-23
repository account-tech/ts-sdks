import { Transaction } from "@mysten/sui/transactions";
import { DaoClient } from "../../src/dao-client";
import { executeTx, NETWORK, testKeypair, DAO } from "./utils";

(async () => {
    const dao = await DaoClient.init(
        NETWORK,
        testKeypair.toSuiAddress(),
        DAO
    );

    const tx = new Transaction();

    dao.claim(tx, [
        "0x702ee1ba208aa00ef56c3e3559cd74557aa7a982c5da7b1e38bb3d9479a0354a",
        // "0xd2713cbef3f6097d11d58339b6d458b378ecf6a2f8d6d7c7d5e65f89efc48200"
    ]);

    executeTx(tx);
})();