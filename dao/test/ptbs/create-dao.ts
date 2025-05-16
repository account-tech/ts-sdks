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
        "0x2::coin::Coin<0xe49f9e753f7ae8ad968ec98bd89cd0b0dfb9bab8e86f1f421323350f8d180e1c::sity::SITY>",
        10n, // authVotingPower
        10000n, // unstakingCooldown
        0, // votingRule
        500n, // maxVotingPower
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
    );

    executeTx(tx);
})();