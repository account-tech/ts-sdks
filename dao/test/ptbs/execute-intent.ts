import { Transaction } from "@mysten/sui/transactions";
import { DaoClient } from "../../src/dao-client";
import { executeTx, NETWORK, DAO, testKeypair } from "./utils";

(async () => {
    const dao = await DaoClient.init(
        NETWORK,
        testKeypair.toSuiAddress(),
        DAO,
    );

    const tx = new Transaction();
    dao.execute(tx, "spend-and-vest");

    executeTx(tx);
})();