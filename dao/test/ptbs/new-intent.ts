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

    dao.requestWithdrawAndTransfer(
        tx,
        {key: "test", startTime: BigInt(Math.floor(Date.now()) + 1000), endTime: BigInt(Math.floor(Date.now() + 10000))},
        [{coinType: "0x2::sui::SUI", coinAmount: 50n}],
        [],
        "0xfcd5f2eee4ca6d81d49c85a1669503b7fc8e641b406fe7cdb696a67ef861492c",
    );
    
    executeTx(tx);
})();