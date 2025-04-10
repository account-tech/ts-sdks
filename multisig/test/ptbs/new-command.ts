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
    
    // ms.depositCap(tx, "0x7279fd3958b4fbf93066f14325e58f8d320fff99538c0b00c310d683c14eccf3::nft::Nft", "0x22adc90d80a6fbf1e94325d1638ff01ac50cf39e4cfa6403c01aead78840c99c");
    // ms.modifyName(tx, "New Name");
    // ms.depositTreasuryCap(tx, "0xc030a69eb0c5345e9e376a7b348a69996c40476bbec14907eda0bfaaa6ac516d::coin::COIN", "0xd18ba2e65ab881bc339a5f57aeaa416defba9b70d124c2bfd3f91c86cd12a667");
    // ms.openKiosk(tx, "Degen");
    // ms.placeInKiosk(tx, "0x852e4a8df17f4fd200a62f201b4b521fc9078468525d9e1b4903d756fe365a3f::nft::Nft", "0xb64714742d206812c9d1e4d7cd471d176cc170752a90e8848b38a0f0c1fbbeb0", "0x5ba19e3ed3deca1db86d9a0b5ba9fdab878a037d66e70c3d62f9b2cd3c3e6c28", "Degen", "0x48361aa19c2ffb51581168b985bec4dcf7be23fd60249874bc6de62dd9cd82b1");
    // TODO: test kiosk commands
    // ms.openVault(tx, "Empty");
    // const coin = tx.splitCoins(tx.gas, [100000000]);
    // ms.depositFromWallet(tx, "0x2::sui::SUI", "Investment", coin);
    // ms.depositUpgradeCap(tx, "TestPackage", "0x51255a3e455d753b40ffe65ef33113a74798a17d2b065ee3d9279f66c8e7b80f");

    executeTx(tx);
})();