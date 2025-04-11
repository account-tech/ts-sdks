import { Transaction } from "@mysten/sui/transactions";
import { MultisigClient } from "../../src/multisig-client";
import { NETWORK, MULTISIG, testKeypair, executeTx } from "./utils";
import { ACCOUNT_ACTIONS, ACCOUNT_PROTOCOL } from "@account.tech/core";
import { ACCOUNT_MULTISIG } from "../../src/lib/constants";

(async () => {
    const ms = await MultisigClient.init(
        NETWORK,
        testKeypair.toSuiAddress(),
        MULTISIG
    );
    const tx = new Transaction();

    ms.requestConfigDeps(
        tx,
        {key: "Deps"},
        [
            {
                name: "AccountProtocol",
                addr: ACCOUNT_PROTOCOL.V1,
                version: 1
            },
            {
                name: "AccountMultisig",
                addr: ACCOUNT_MULTISIG.V1,
                version: 1
            },
            {
                name: "AccountActions",
                addr: ACCOUNT_ACTIONS.V1,
                version: 1
            },
            {
                name: "ExternalTest",
                addr: "0x0",
                version: 1
            }
        ]
    );
    
    executeTx(tx);
})();