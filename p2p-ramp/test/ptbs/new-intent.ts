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
        {key: "config-dao-2", startTime: BigInt(Math.floor(Date.now()) + 1000), endTime: BigInt(Math.floor(Date.now() + 10000))},
        "0x2::sui::SUI",
        0n,
        0n,
        1,
        10n,
        0n,
        1n
    );
    
    executeTx(tx);
})();