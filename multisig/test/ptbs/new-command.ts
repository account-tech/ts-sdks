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
    
    ms.depositCap(tx, "0x2::package::Publisher", "0xcb3aa7b851838c71739afd70eb42613c20afc0c04a4b27fe514bfb9865f277a1");
    // ms.modifyName(tx, "New Name");
    // ms.depositTreasuryCap(tx, "0x4b19cbec59f1e5835de1fad038a7af4e4e7034d2815ffeb8d3f4c65cb357467::coin::COIN", "0xdfc76a1831924b8df709d2629b98329f6c89a80097a37e184ba66a02010d4601");
    // ms.openKiosk(tx, "NFTs");
    // ms.placeInKiosk(tx, "0x6e2fac21fdfa68d5852a5674e138437d7a300ef00436c1f888b868038f4c0b10::nft::Nft", "0xd9bf8ca49bbbf45147bd6f9e7419f345c2006a9f7cb20e506f8649282adcfc70", "0x2215fd0e2b968e6ebf851c2d13d01abd00993b1b670d706e097da9ec01fff298", "Degen", "0x07bf72ba078e447503d1fe16f5a891abcedc87122edfc67b764af0bd06a067bc");
    // TODO: test kiosk commands
    // ms.openVault(tx, "Investment");
    // const coin = tx.splitCoins(tx.gas, [100]);
    // ms.depositFromWallet(tx, "0x2::sui::SUI", "Investment", coin);
    // ms.depositUpgradeCap(tx, "TestPackage", "0x02841bb0e1f9dc34572513660b2fc71b6398a5ee695f55be184e5088ab15f3cb");

    executeTx(tx);
})();