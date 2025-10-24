export enum ACCOUNT_MULTISIG {
    V1 = "0xe882c2c4a91d27f385f763e2f3de8388d67c2cd17f39f49cd5845de4fc3701cf",
}
// Types
export const MULTISIG_CONFIG_TYPE = `${ACCOUNT_MULTISIG.V1}::multisig::Multisig`;
export const MULTISIG_GENERICS: [string, string] = [`${ACCOUNT_MULTISIG.V1}::multisig::Multisig`, `${ACCOUNT_MULTISIG.V1}::multisig::Approvals`];
// Shared objects
export const MULTISIG_FEES = "0x51d909ffc040b9ed00fc5d06a0ccaf8464453476e7f11014242eca9a06c611ec";