import { Transaction } from "@mysten/sui/transactions";
import { MultisigClient } from "../../src/multisig-client";
import { executeTx, MULTISIG, NETWORK, testKeypair } from "./utils";

(async () => {
    const ms = await MultisigClient.init(
        NETWORK,
        testKeypair.toSuiAddress(),
        MULTISIG,
    );

    const tx = new Transaction();

    // ms.reorderMultisigs(tx, ["0x8e7c0b44b9552e2a25c53254c797f69e8cceed71745bca8e39daaad7796fa8f2", "0xd4ab6ea7a1ee3f277b1056d35595a4f2f1ef0fe1a98ed53f176cc545978e9ddb", "0x14c5ea70611c54558ce1b807064a27881cd85241e3b454cb75aef6fa611a96a7"]);
    
    // ms.depositCap(tx, "0x2::package::Publisher", "0x290574ad812957bd511a5e2ac642ccbf999ebc25a7d38314723de7b1f5617814");
    // ms.modifyName(tx, "New Name");
    // ms.depositTreasuryCap(tx, "0xfbf823f1aedf4de4f54508c8dceaf2c7cdfb6f7471a3f614bec079bba31f7e3c::coin::COIN", "0x062c12fb7dc4ba81a314b1acd9dd4f0d19e21e777a690c24b965bb8a7d7c7ab6");
    // ms.openKiosk(tx, "Degen");
    // ms.placeInKiosk(tx, "0x4f6158db4544fe52bd07dbd4568f3ac2ef81068c85cf0b54cca0282a7fe231b2::nft::Nft", "0x8e7706875b9d6cb37f477ca8218999d33c5820b3f2113fd2743dea53ccc96738", "0xc829373e317fe146cacbe44c186a210695e3870a941e104d2f9cb36dbec680b4", "Degen", "0x3a1f86f97f2622769a5ca881a83b5395795e81390a7e566095dcb82ff853a397");
    // TODO: test kiosk commands
    ms.openVault(tx, "Empty");
    // const coin = tx.splitCoins(tx.gas, [100000000]);
    // ms.depositFromWallet(tx, "0x2::sui::SUI", "Investment", coin);
    // ms.depositUpgradeCap(tx, "TestPackage", "0x29d8954730ba29c0b66534c60fc121bd14771639d0f502d1cddc85473943fd7f");

    executeTx(tx);
})();