import { Transaction } from "@mysten/sui/transactions";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { executeTx, NETWORK, testKeypair } from "./utils";
import { MultisigClient } from "../../src/multisig-client";

(async () => {
    const client = new SuiClient({ url: getFullnodeUrl(NETWORK) });

    const tx = new Transaction();

    let multisigClient = await MultisigClient.init(NETWORK, testKeypair.toSuiAddress());
    multisigClient.user.deleteUser(tx, multisigClient.user.id);

    executeTx(tx);
})();