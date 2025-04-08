import { Transaction } from "@mysten/sui/transactions";
import { MultisigClient } from "../../src/multisig-client";
import { NETWORK, MULTISIG, testKeypair, executeTx } from "./utils";

(async () => {
    const ms = await MultisigClient.init(
        NETWORK,
        testKeypair.toSuiAddress(),
        MULTISIG
    );
    const tx = new Transaction();

    ms.requestWithdrawAndTransferToVault(
        tx,
        {key: "Withdraw and transfer to vault"},
        "0x2::sui::SUI",
        10n,
        "chosen"
    );
    
    executeTx(tx);
})();