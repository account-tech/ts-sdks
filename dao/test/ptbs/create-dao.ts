import { Transaction } from "@mysten/sui/transactions";
import { DaoClient } from "../../src/dao-client";
import { executeTx, NETWORK, testKeypair } from "./utils";

(async () => {
    const dao = await DaoClient.init(
        NETWORK,
        testKeypair.toSuiAddress(),
    );

    const tx = new Transaction();

    dao.createDao(
        tx,
        "0x2::coin::Coin<0x2::sui::SUI>",
        1n,
        0n,
        1,
        5n,
        1n,
        10n,
        "Accelerate",
        "description",
        "image",
        "twitter",
        "telegram",
        "discord",
        "github",
        "website",
        { username: "Thouny", profilePicture: "https://example.com/avatar.png" },
    );

    executeTx(tx);
})();