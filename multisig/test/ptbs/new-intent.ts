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

    ms.requestConfigMultisig(
        tx,
        {key: "config-multisig" },
        1,
        [],
        [
            {
                address: "0x3c00d56434d581fdfd6e280626f7c8ee75cc9dac134d84290491e65f9b8b7161",
                weight: 1,
                roles: []
            },
            {
                address: "0x08e133f696af486466f3b95b677448a7f00fa1e0236443348ed22eb0506d7622",
                weight: 1,
                roles: []
            },
        ]
    );
    
    executeTx(tx);
})();