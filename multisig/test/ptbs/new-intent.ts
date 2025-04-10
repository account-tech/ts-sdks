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

    ms.requestWithdrawAndAirdropCoins(
        tx,
        {key: "Withdraw and airdrop"},
        "0x2::sui::SUI",
        [
            {recipient: "0x86d6c90d7c6aafa3dcde015b9651cbd5754c8299c3881a67a37ba6f5e09e277a", amount: 10n},
            { recipient: "0x852e4a8df17f4fd200a62f201b4b521fc9078468525d9e1b4903d756fe365a3f", amount: 20n},
        ]
    );
    
    executeTx(tx);
})();