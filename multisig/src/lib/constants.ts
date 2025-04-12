export enum ACCOUNT_MULTISIG {
    V1 = "0x45473e7747b0f740c3cdf51cc255f3dc5ff9a628da6899860865b7ff82afcc1a",
}
// Types
export const MULTISIG_CONFIG_TYPE = `${ACCOUNT_MULTISIG.V1}::multisig::Multisig`;
export const MULTISIG_GENERICS: [string, string] = [`${ACCOUNT_MULTISIG.V1}::multisig::Multisig`, `${ACCOUNT_MULTISIG.V1}::multisig::Approvals`];
// Shared objects
export const MULTISIG_FEES = "0x5734015b943d5e16528518b9cf9536f139b3c2e36c5443e65a8a450ce570a5ac";