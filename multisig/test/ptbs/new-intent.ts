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

    ms.requestBorrowCap(
        tx,
        {key: "borrow-cap"},
        "0x2::display::Display<0x4ac609fe6e1f82e568f49e2abd00944bf30790fb9446f9838aadfd619d56bef1::my_hero::Hero>",
    );
    
    executeTx(tx);
})();