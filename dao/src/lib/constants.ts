export enum ACCOUNT_DAO {
    V1 = "0x5be3606a4e390ec4f23167e2ee486bfcb544ad0128285321b7e813061af82fec",
}
// Types
export const DAO_CONFIG_TYPE = `${ACCOUNT_DAO.V1}::dao::Dao`;
export const DAO_GENERICS: [string, string] = [`${ACCOUNT_DAO.V1}::dao::Dao`, `${ACCOUNT_DAO.V1}::dao::Votes`];
// Shared objects
export const DAO_REGISTRY = "0x96408fae73d1fafd953792609423d226c76aef2ee5bde01bbc42fefcde83e50d";
export const REGISTRY_TABLE_ID = "0x32c657a2f6b04ae3680283daeaa31165abe6a130ff04ac9d70b5476c801d9790";
export const DAO_FEES = ""; // none for now