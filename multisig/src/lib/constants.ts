export enum ACCOUNT_MULTISIG {
    V1 = "0x460632ef4e9e708658788229531b99f1f3285de06e1e50e98a22633c7e494867",
}
// Types
export const MULTISIG_CONFIG_TYPE = `${ACCOUNT_MULTISIG.V1}::multisig::Multisig`;
export const MULTISIG_GENERICS: [string, string] = [`${ACCOUNT_MULTISIG.V1}::multisig::Multisig`, `${ACCOUNT_MULTISIG.V1}::multisig::Approvals`];
// Shared objects
export const MULTISIG_FEES = "0xc27762578a0b1f37224550dcfd0442f37dc82744b802d3517822d1bd2718598f";