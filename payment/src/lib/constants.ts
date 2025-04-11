export enum ACCOUNT_PAYMENT {
    V1 = "0x7b3f58516d1f727ae03c168d416481a55775ed1588f27eee3ee7136722c58cdb",
}
// Types
export const PAYMENT_CONFIG_TYPE = `${ACCOUNT_PAYMENT.V1}::payment::Payment`;
export const PAYMENT_GENERICS: [string, string] = [`${ACCOUNT_PAYMENT.V1}::payment::Payment`, `${ACCOUNT_PAYMENT.V1}::payment::Pending`];
// Shared objects
export const PAYMENT_FEES = "0xb5bd5da011970532c097490e2ee6ee905c2e81b4b83279140825af9ef7644a43";

