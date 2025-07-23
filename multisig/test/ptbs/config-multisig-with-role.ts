import { Transaction } from "@mysten/sui/transactions";
import { MultisigClient } from "../../src/multisig-client";
import { NETWORK, MULTISIG, testKeypair, executeTx } from "./utils";
import { ACCOUNT_ACTIONS, ACCOUNT_PROTOCOL, ActionsRoles } from "@account.tech/core";
import { ACCOUNT_MULTISIG } from "../../src/lib/constants";

(async () => {
    const ms = await MultisigClient.init(
        NETWORK,
        testKeypair.toSuiAddress(),
        MULTISIG
    );
    const tx = new Transaction();

    ms.requestConfigMultisig(
        tx,
        { key: "config-multisig" },
        2, // keep the current global threshold
        [{ name: ms.constructRole(ActionsRoles.Vault, "Investment"), threshold: 1 }],
        [
            { address: testKeypair.toSuiAddress(), weight: 1, roles: [ms.constructRole(ActionsRoles.Vault, "Investment")] },
            { address: "0x564c04d68f90ee093d7e2ab3014e4c602eadad24d09a51d21541510d43b946ac", weight: 1, roles: [] }
        ],
    );

    executeTx(tx);
})();