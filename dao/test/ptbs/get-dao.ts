import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { MultisigClient } from "../../src/dao-client";
import { MULTISIG, NETWORK, testKeypair } from "./utils";
import { Dao } from "../../src/lib/account";

(async () => {
    // const ms = await MultisigClient.init(
    //     NETWORK,
    //     testKeypair.toSuiAddress(),
    //     MULTISIG
    // )
    // console.log(ms.getIntent("upgrade-package"));

    const dao = new Dao(new SuiClient({ url: getFullnodeUrl(NETWORK) }));
    await dao.init();
})();