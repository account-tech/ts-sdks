export enum ACCOUNT_MULTISIG {
    V1 = "0x5dc85f69022101e075affe09af643b8bdd99c50fd1e4611a3660621c5c63de6a",
}
// Types
export const MULTISIG_CONFIG_TYPE = `${ACCOUNT_MULTISIG.V1}::multisig::Multisig`;
export const MULTISIG_GENERICS: [string, string] = [`${ACCOUNT_MULTISIG.V1}::multisig::Multisig`, `${ACCOUNT_MULTISIG.V1}::multisig::Approvals`];
// Shared objects
export const MULTISIG_FEES = "0xc2d2fc347d1a2661b7ed13a216755fe9efaaf534390eee6099f91be412923ccc";

// Payment
export enum ACCOUNT_PAYMENT {
    V1 = "0x441919d12ddcce18f31e0d71ee9eda78ae2b89bfc722b0c9b9cc11fed78b497e",
}
// Types
export const PAYMENT_CONFIG_TYPE = `${ACCOUNT_PAYMENT.V1}::payment::Payment`;
export const PAYMENT_GENERICS: [string, string] = [`${ACCOUNT_PAYMENT.V1}::payment::Payment`, `${ACCOUNT_PAYMENT.V1}::payment::Pending`];
// Shared objects
export const PAYMENT_FEES = "0x4e9a9ff14455bd238a80fa6cd5cf15bc819a48d469df78de24b76c00cd6be6be";

