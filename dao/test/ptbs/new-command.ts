import { Transaction } from "@mysten/sui/transactions";
import { DaoClient } from "../../src/dao-client";
import { executeTx, DAO, NETWORK, testKeypair } from "./utils";

(async () => {
    const dao = await DaoClient.init(
        NETWORK,
        testKeypair.toSuiAddress(),
        DAO,
    );

    const tx = new Transaction();

    // ms.reorderMultisigs(tx, ["0x8e7c0b44b9552e2a25c53254c797f69e8cceed71745bca8e39daaad7796fa8f2", "0xd4ab6ea7a1ee3f277b1056d35595a4f2f1ef0fe1a98ed53f176cc545978e9ddb", "0x14c5ea70611c54558ce1b807064a27881cd85241e3b454cb75aef6fa611a96a7"]);
    
    // ms.depositCap(tx, "0x2::display::Display<0x4ac609fe6e1f82e568f49e2abd00944bf30790fb9446f9838aadfd619d56bef1::my_hero::Hero>", "0x0004c2736bd34352788611e40cbab05b536344d7345a5b86b3f99a41155fb5ff");
    // dao.modifyMetadata(tx, "New Name", "New Description", "New Image", "New Twitter", "New Telegram", "New Discord", "New Github", "New Website");
    // ms.depositTreasuryCap(tx, "0xecf1cd577b79c3c03d9ac7e41b4c5403bad969d675928dc0ca8f5be7cc735b85::coin::COIN", "0xd76fb37863a62057ba22d9ecee77f1de1249cb133c8345ef5400d7dd426251f1");
    // ms.openKiosk(tx, "Degen");
    // ms.placeInKiosk(tx, "0x6e2fac21fdfa68d5852a5674e138437d7a300ef00436c1f888b868038f4c0b10::nft::Nft", "0xd9bf8ca49bbbf45147bd6f9e7419f345c2006a9f7cb20e506f8649282adcfc70", "0x2215fd0e2b968e6ebf851c2d13d01abd00993b1b670d706e097da9ec01fff298", "Degen", "0x07bf72ba078e447503d1fe16f5a891abcedc87122edfc67b764af0bd06a067bc");
    // TODO: test kiosk commands
    dao.openVault(tx, "Investment");
    dao.depositFromWallet(tx, "0x2::sui::SUI", "Investment", tx.splitCoins(tx.gas, [10000]));
    // const coin = tx.splitCoins(tx.gas, [100000000]);
    // ms.depositFromWallet(tx, "0x2::sui::SUI", "Investment", coin);
    // ms.depositUpgradeCap(tx, "TestPackage", "0x02841bb0e1f9dc34572513660b2fc71b6398a5ee695f55be184e5088ab15f3cb");

    executeTx(tx);
})();