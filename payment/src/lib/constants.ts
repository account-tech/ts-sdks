export enum ACCOUNT_PAYMENT {
    V1 = "0x841fd25185f32719f2003fe80a34e934b00fd06ae393a96c8043eeddb0c134d9",
}
// Types
export const PAYMENT_CONFIG_TYPE = `${ACCOUNT_PAYMENT.V1}::payment::Payment`;
export const PAYMENT_GENERICS: [string, string] = [`${ACCOUNT_PAYMENT.V1}::payment::Payment`, `${ACCOUNT_PAYMENT.V1}::payment::Pending`];
// Shared objects
export const PAYMENT_FEES = "0x2e8b20f858844ec627d9c8d44ceaeaade1d3be2cc9a574b179bf52b1d306b843";

