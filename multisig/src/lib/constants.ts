export enum ACCOUNT_MULTISIG {
    V1 = "0x5dc85f69022101e075affe09af643b8bdd99c50fd1e4611a3660621c5c63de6a",
}
// Types
export const MULTISIG_CONFIG_TYPE = `${ACCOUNT_MULTISIG.V1}::multisig::Multisig`;
export const MULTISIG_GENERICS: [string, string] = [`${ACCOUNT_MULTISIG.V1}::multisig::Multisig`, `${ACCOUNT_MULTISIG.V1}::multisig::Approvals`];
// Shared objects
export const MULTISIG_FEES = "0xc2d2fc347d1a2661b7ed13a216755fe9efaaf534390eee6099f91be412923ccc";