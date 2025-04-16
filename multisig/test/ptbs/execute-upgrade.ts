import { Transaction } from "@mysten/sui/transactions";
import { MultisigClient } from "../../src/multisig-client";
import { executeTx, NETWORK, MULTISIG, testKeypair } from "./utils";
import { Approvals } from "../../src/lib/outcome";
import { MULTISIG_GENERICS } from "../../src/lib/constants";
import { BorrowCapIntent, UpgradePackageIntent } from "@account.tech/core";

/// Example showing how to borrow a cap and use it

(async () => {
    const ms = await MultisigClient.init(
        NETWORK,
        testKeypair.toSuiAddress(),
        MULTISIG,
    );

    const intentKey = "upgrade-package-2";
    const packageId = ms.getPackages().assets["anotherTest"].packageId;
    const tx = new Transaction();

    const intent = ms.getIntent(intentKey) as UpgradePackageIntent;
    // approve if necessary
    (intent.outcome as Approvals).maybeApprove(tx, testKeypair.toSuiAddress());

    // borrow the cap
    const executable = ms.multisig.executeIntent(tx, intentKey);
    let ticket = intent.execute(tx, MULTISIG_GENERICS, executable);

    // upgrade the package
    const receipt = tx.upgrade({
        modules: ["oRzrCwYAAAAKAQAOAg4iAzA2BGYOBXRrB98B+gEI2QNgBrkEpAIK3QYZDPYG3wEAEAEYAgkCFAIVAhkCGgABDAAAAgIAAAMMAAEFBwACAAwBCAEDBwQABAQMAAYGAgAADQABAAAOAgMAAA8EAQABHAYHAAITCwwBCAIbDQEBCAMSEhMABAgJCgECBRYQAQEMBhcODwAHCAQDBQMICggRCBQIAwIIAQcIBwADCAMIAwcIBwEIAAIFBwgHBAsEAQgACggDCAYKCAMBCgIBCAMBCAECCQAHCAcBCAYEBggGCggDCggDBwgHAQsEAQkAAQcLBAEJAAEGCAcBBQIJAAUBCwQBCAABBwgHAQgFAQgCB0Rpc3BsYXkESGVybwdNWV9IRVJPBk9iamVjdAlQdWJsaXNoZXIGU3RyaW5nCVR4Q29udGV4dANVSUQFY2xhaW0HZGlzcGxheQtkdW1teV9maWVsZAJpZAlpbWFnZV91cmwEaW5pdARtaW50EW1pbnRfYW5kX3RyYW5zZmVyB215X2hlcm8EbmFtZQNuZXcPbmV3X3dpdGhfZmllbGRzBm9iamVjdAdwYWNrYWdlD3B1YmxpY190cmFuc2ZlcgZzZW5kZXIGc3RyaW5nCHRyYW5zZmVyCnR4X2NvbnRleHQOdXBkYXRlX3ZlcnNpb24EdXRmOAV2YWx1ZQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgoCBQRuYW1lCgIFBGxpbmsKAgoJaW1hZ2VfdXJsCgIMC2Rlc2NyaXB0aW9uCgIMC3Byb2plY3RfdXJsCgIIB2NyZWF0b3IKAgcGe25hbWV9CgIgH2h0dHBzOi8vc3VpLWhlcm9lcy5pby9oZXJvL3tpZH0KAhMSaXBmczovL3tpbWFnZV91cmx9CgIiIUEgdHJ1ZSBIZXJvIG9mIHRoZSBTdWkgZWNvc3lzdGVtIQoCFhVodHRwczovL3N1aS1oZXJvZXMuaW8KAhAPVW5rbm93biBTdWkgRmFuBSA/UO3iseQfNRXwO+Ub5ovv6hj8IOIhZkBuWEv3PGLIXAoCBQRIZXJvCgIdHGh0dHBzOi8vc3VpLWhlcm9lcy5pby9oZXJvLzEAAgMLCAURCAMMCAMBAgEKAQICAgsIBR0DAAAAAAVLBwARAwcBEQMHAhEDBwMRAwcEEQMHBREDQAcGAAAAAAAAAAwDBwYRAwcHEQMHCBEDBwkRAwcKEQMHCxEDQAcGAAAAAAAAAAwFCwAKATgADAQOBAsDCwUKATgBDAINAjgCCwQKAS4RCTgDCwIKAS4RCTgEBwwKARECBwwKARECBwwKARECBwwKARECCgERBgZaAAAAAAAAABICBww4BQsBEQYGBwAAAAAAAAASAgcMOAUCAQEAAAEGCwIRBgsACwESAAICAQQAAQkHDREDBw4RAwsBEQELADgGAgA="],
        dependencies: ["0x0000000000000000000000000000000000000000000000000000000000000001", "0x0000000000000000000000000000000000000000000000000000000000000002"],
        package: packageId,
        ticket,
    });

    // return the cap
    intent.commit(tx, MULTISIG_GENERICS, executable, receipt);
    intent.completeExecution(tx, MULTISIG_GENERICS, executable);
    // if no more executions scheduled after this one, destroy intent
    if (intent.fields.executionTimes.length == 1) {
        intent.clearEmpty(tx, MULTISIG_GENERICS, intentKey);
    }

    executeTx(tx);
})();