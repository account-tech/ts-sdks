export enum ACCOUNT_PAYMENT {
    V1 = "0xd1dfd2aa93cc33b6780e567a502a6f771ac737fe75dbef3d51ca139e423bd1ed",
}
// Types
export const PAYMENT_CONFIG_TYPE = `${ACCOUNT_PAYMENT.V1}::payment::Payment`;
export const PAYMENT_GENERICS: [string, string] = [`${ACCOUNT_PAYMENT.V1}::payment::Payment`, `${ACCOUNT_PAYMENT.V1}::payment::Pending`];
// Shared objects
export const PAYMENT_FEES = "0x7345e03c91ebbcb9b5c7a70b2cced0c70efda73ecca9f81959450498a322b33e";

