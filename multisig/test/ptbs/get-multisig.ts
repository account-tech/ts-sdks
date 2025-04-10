import { MultisigClient } from "@account.tech/multisig";
import { MULTISIG, NETWORK, testKeypair } from "./utils";

(async () => {
    const ms = await MultisigClient.init(
        NETWORK,
        testKeypair.toSuiAddress(),
        MULTISIG
    )
    console.log(ms.getIntent("Restrict"));
})();