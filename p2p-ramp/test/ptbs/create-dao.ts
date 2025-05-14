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
        1n, // authVotingPower
        10000n, // unstakingCooldown
        0, // votingRule
        5n, // maxVotingPower
        1n, // minimumVotes
        10n, // votingQuorum
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