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

    ms.requestWithdrawAndAirdropObjects(
        tx,
        {key: "airdrop-objects"},
        [
            {
                objectId: "0x05512c281bedc823d25cb1f6547e8fa9b034b64d96afbc79b0ca5dc610d22725",
                recipient: testKeypair.toSuiAddress(),
            },
            {
                objectId: "0xdb1a9dbea68c845f41a89a7685d2674474ddd3c8e0b7f40557cadd937fcb1b0c",
                recipient: testKeypair.toSuiAddress(),
            },
        ],
    );
    
    executeTx(tx);
})();