export enum ACCOUNT_MULTISIG {
    V1 = "0x5b249579964953a3f49ed605ff0329302c0c218e1603fbb9921e19bfacb901a8",
}
// Types
export const MULTISIG_CONFIG_TYPE = `${ACCOUNT_MULTISIG.V1}::multisig::Multisig`;
export const MULTISIG_GENERICS: [string, string] = [`${ACCOUNT_MULTISIG.V1}::multisig::Multisig`, `${ACCOUNT_MULTISIG.V1}::multisig::Approvals`];
// Shared objects
export const MULTISIG_FEES = "0x7f2fbf8b52a1324fbf36aceea947cd3c0a65d5ff56d409daa75a2339adf5a880";

// Payment
export enum ACCOUNT_PAYMENT {
    V1 = "0x9ccc8527361cfb3215f6044a148b9356de3c72d673278df3f4167ee84259e8c5",
}
// Types
export const PAYMENT_CONFIG_TYPE = `${ACCOUNT_PAYMENT.V1}::payment::Payment`;
export const PAYMENT_GENERICS: [string, string] = [`${ACCOUNT_PAYMENT.V1}::payment::Payment`, `${ACCOUNT_PAYMENT.V1}::payment::Pending`];
// Shared objects
export const PAYMENT_FEES = "0xd51ee9ab336496900a7c976bdbf625f2a6360ae2345fb70023aa58e3ae427785";

