import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Transaction } from "@mysten/sui/transactions";

export const NETWORK = "testnet";
export const testKeypair = Ed25519Keypair.fromSecretKey(Uint8Array.from(Buffer.from("AM06bExREdFceWiExfSacTJ+64AQtFl7SRkSiTmAqh6F", "base64")).slice(1));;

export const DAO = "0x77530a0a4cc9da5b4b0a7882d69ce6c96487c97d8ef29945aeabd2a4b435828c";

export async function executeTx(tx: Transaction) {
    const client = new SuiClient({ url: getFullnodeUrl(NETWORK) });

    tx.setGasBudget(1000000000);
    const result = await client.signAndExecuteTransaction({
        signer: testKeypair,
        transaction: tx,
        options: { showEffects: true, showObjectChanges: true },
        requestType: "WaitForLocalExecution"
    });

    if (result.effects?.status.status != "success") {
        console.log(result.effects?.status.error);
    }

    console.log(result.effects?.status.status);
    console.log(result.effects?.created);
}