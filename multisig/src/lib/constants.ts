export enum ACCOUNT_MULTISIG {
    V1 = "0xfd992a8249bdee643e003c05930caeb9d7262def7af7a49413de94d61e27e142",
}
// Types
export const MULTISIG_CONFIG_TYPE = `${ACCOUNT_MULTISIG.V1}::multisig::Multisig`;
export const MULTISIG_GENERICS: [string, string] = [`${ACCOUNT_MULTISIG.V1}::multisig::Multisig`, `${ACCOUNT_MULTISIG.V1}::multisig::Approvals`];
// Shared objects
export const MULTISIG_FEES = "0x8a751dd2c8f074cb06ec5c95094036a4a71ec2a508fcd4b8037fcc7dbe9c1e47";