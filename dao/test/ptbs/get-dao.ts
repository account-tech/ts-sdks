import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { DaoClient } from "../../src/dao-client";
import { DAO, NETWORK, testKeypair } from "./utils";
import { Dao } from "../../src/lib/account";

(async () => {
    const dao = await DaoClient.init(
        NETWORK,
        testKeypair.toSuiAddress(),
        "0x94a7c4278399b995219f34b3b2f5173635b5d146641cd7b1f1988075255250ff"
    )
    console.log(dao.getIntentStatus("please-work"));
})();