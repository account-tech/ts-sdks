import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { DaoClient } from "../../src/dao-client";
import { DAO, NETWORK, testKeypair } from "./utils";
import { Dao } from "../../src/lib/account";

(async () => {
    const dao = await DaoClient.init(
        NETWORK,
        testKeypair.toSuiAddress(),
        DAO
    )
    console.log(dao.dao.getData());
})();