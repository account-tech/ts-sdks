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

    ms.requestUpgradePackage(
        tx,
        {key: "upgrade-package-2", executionTimes: [BigInt(Math.floor(Date.now() + 1000))]},
        "anotherTest",
        [144, 134, 44, 16, 18, 52, 249, 248, 191, 49, 180, 111, 230, 42, 247, 7, 54, 152, 199, 129, 151, 192, 162, 135, 164, 40, 19, 174, 34, 122, 125, 214]
    );
    
    executeTx(tx);
})();