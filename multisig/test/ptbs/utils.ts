import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Transaction } from "@mysten/sui/transactions";

export const NETWORK = "testnet";
export const testKeypair = Ed25519Keypair.fromSecretKey(Uint8Array.from(Buffer.from("AM06bExREdFceWiExfSacTJ+64AQtFl7SRkSiTmAqh6F", "base64")).slice(1));;
export const emptyKeypair = Ed25519Keypair.fromSecretKey(Uint8Array.from(Buffer.from("ABN7Bo15Y05TeedGTxSM6F/PgLngu/QLJFH0NLG1yyZ5", "base64")).slice(1));;

export const MULTISIG = "0xc07a31f31427a57bb18135d8591b8e19d116cf581ed05323e9bd0ff4f504bcba";

export async function executeTx(tx: Transaction) {
    const client = new SuiClient({ url: getFullnodeUrl(NETWORK) });

    tx.setGasBudget(90000000);
    const result = await client.signAndExecuteTransaction({
        signer: emptyKeypair,
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