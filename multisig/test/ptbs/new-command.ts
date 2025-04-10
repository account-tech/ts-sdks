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
    
    // ms.depositCap(tx, "0xa69dd3d103a65115fa1149ab1c8a89d2e73255fb2300030b1c5572631046603d::nft::Nft", "0x243cc8a7d9004b31c649e6c254601c463ef08f1490038b6189ddadec61c70b5a");
    // ms.modifyName(tx, "New Name");
    // ms.depositTreasuryCap(tx, "0x380feff4380a2389c4ebcda5475c5815299a3f4bf1264addbd02b8bcfc3e3609::coin::COIN", "0x4a827d635abe3b53450db29613ecfd8a59a38dd304c001649610e31bb13a5999");
    // ms.openKiosk(tx, "Degen");
    // ms.placeInKiosk(tx, "0x6e2fac21fdfa68d5852a5674e138437d7a300ef00436c1f888b868038f4c0b10::nft::Nft", "0xd9bf8ca49bbbf45147bd6f9e7419f345c2006a9f7cb20e506f8649282adcfc70", "0x2215fd0e2b968e6ebf851c2d13d01abd00993b1b670d706e097da9ec01fff298", "Degen", "0x07bf72ba078e447503d1fe16f5a891abcedc87122edfc67b764af0bd06a067bc");
    // TODO: test kiosk commands
    // ms.openVault(tx, "Investment");
    // const coin = tx.splitCoins(tx.gas, [100000000]);
    // ms.depositFromWallet(tx, "0x2::sui::SUI", "Investment", coin);
    ms.depositUpgradeCap(tx, "TestPackage", "0x30605ba22693aedfde512f93c84af7f228cc97c6b8c72dad9e0d0bf896730512");

    executeTx(tx);
})();