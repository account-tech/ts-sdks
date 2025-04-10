export enum ACCOUNT_MULTISIG {
    V1 = "0x86d6c90d7c6aafa3dcde015b9651cbd5754c8299c3881a67a37ba6f5e09e277a",
}
// Types
export const MULTISIG_CONFIG_TYPE = `${ACCOUNT_MULTISIG.V1}::multisig::Multisig`;
export const MULTISIG_GENERICS: [string, string] = [`${ACCOUNT_MULTISIG.V1}::multisig::Multisig`, `${ACCOUNT_MULTISIG.V1}::multisig::Approvals`];
// Shared objects
export const MULTISIG_FEES = "0xa396313ecac3bcf0e1849ee336a8ff74b43d7071427daba95f83d12bc72900fa";

// Payment
export enum ACCOUNT_PAYMENT {
    V1 = "0xc418f180bab4e29a1eef66676499e9aad4fda16ee72f95b8d5675a5e742f2b37",
}
// Types
export const PAYMENT_CONFIG_TYPE = `${ACCOUNT_PAYMENT.V1}::payment::Payment`;
export const PAYMENT_GENERICS: [string, string] = [`${ACCOUNT_PAYMENT.V1}::payment::Payment`, `${ACCOUNT_PAYMENT.V1}::payment::Pending`];
// Shared objects
export const PAYMENT_FEES = "0xf18870f08967b61f89d6484f4f4b4353f701dcc2ecc6373e842f2414caa379fa";

