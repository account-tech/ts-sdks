import { MultisigClient } from "../../src/multisig-client";
import { MULTISIG, NETWORK, testKeypair } from "./utils";

(async () => {
    const ms = await MultisigClient.init(
        NETWORK,
        testKeypair.toSuiAddress(),
        MULTISIG
    )
    console.log(ms.getOwnedObjects());
    
    await ms.switchMultisig("0xa360c7d2fef1bab53d586d92102c43cb434e3c771d923deffd7c210be1f44174");
    console.log(ms.getOwnedObjects());
})();