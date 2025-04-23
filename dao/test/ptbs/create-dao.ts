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
        "0xab5755f407ab5bae7174ab207b4b1ebcdaeeaa2746914e637cdf81d4710e76a6::my_hero::Hero",
        1n,
        10000n,
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