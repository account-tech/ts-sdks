import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { P2PRampClient } from "../../src/p2p-ramp-client";
import { ACCOUNT, NETWORK, testKeypair } from "./utils";

(async () => {
    const p2pramp = await P2PRampClient.init(
        NETWORK,
        testKeypair.toSuiAddress(),
        ACCOUNT,
    )
    // console.log(p2pramp.getIntent("fill-buy").outcome);
    console.log(p2pramp.registry?.accounts);
})();