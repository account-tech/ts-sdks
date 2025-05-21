import { Transaction } from "@mysten/sui/transactions";
import { DaoClient } from "../../src/dao-client";
import { NETWORK, DAO, testKeypair, executeTx } from "./utils";

(async () => {
    const dao = await DaoClient.init(
        NETWORK,
        testKeypair.toSuiAddress(),
        DAO
    );
    const tx = new Transaction();

    dao.requestConfigDao(
        tx,
        {key: "test", startTime: BigInt(Math.floor(Date.now()) + 1000), endTime: BigInt(Math.floor(Date.now() + 10000))},
        "0x2::coin::Coin<0x2::sui::SUI>",
        50n,
        0n,
        0,
        200n,
        1n,
        500000000n
    );
    
    executeTx(tx);
})();