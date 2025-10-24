export enum ACCOUNT_MULTISIG {
    V1 = "0xae205528b66901ceee822d9a932f0c14d2e0999eb13fbfa3403efff1afc5ea5e",
}
// Types
export const MULTISIG_CONFIG_TYPE = `${ACCOUNT_MULTISIG.V1}::multisig::Multisig`;
export const MULTISIG_GENERICS: [string, string] = [`${ACCOUNT_MULTISIG.V1}::multisig::Multisig`, `${ACCOUNT_MULTISIG.V1}::multisig::Approvals`];
// Shared objects
export const MULTISIG_FEES = "0x82b6494d6b1b30bd9e039a8af4edff1498fa7dc01ab0dd59cfeed6ffb932281b";