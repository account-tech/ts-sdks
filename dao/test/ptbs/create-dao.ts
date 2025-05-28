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
        10n, // authVotingPower
        0n, // unstakingCooldown
        0, // votingRule
        500n, // maxVotingPower
        1n, // minimumVotes
        10n, // votingQuorum
        "Account.tech",
        "Best Move framework for building on Sui",
        "https://pbs.twimg.com/profile_images/1895901990133039104/mnVx46Lt_400x400.jpg",
        "https://x.com/accountdottech",
        "telegram",
        "discord",
        "https://github.com/account-tech",
        "https://account.tech",
    );

    executeTx(tx);
})();