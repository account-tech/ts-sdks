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

    dao.requestSpendAndVest(
        tx,
        {key: "spend-and-vest", startTime: BigInt(Math.floor(Date.now()) + 1000), endTime: BigInt(Math.floor(Date.now() + 10000))},
        "Investment",
        "0x2::sui::SUI",
        10n,
        BigInt(Math.floor(Date.now())),
        BigInt(Math.floor(Date.now() + 100000)),
        "0x3c00d56434d581fdfd6e280626f7c8ee75cc9dac134d84290491e65f9b8b7161",
    );
    
    executeTx(tx);
})();