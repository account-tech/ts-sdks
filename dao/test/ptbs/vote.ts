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

    dao.vote(tx, "spend-and-vest", "yes");

    executeTx(tx);
})();