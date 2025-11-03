export enum ACCOUNT_DAO {
    V1 = "0x1e2b7dce6f22f0ff8f78ecce1baf2ea7929f2eae9a11eba7b2e4b0c6134f7725",
}
// Types
export const DAO_CONFIG_TYPE = `${ACCOUNT_DAO.V1}::dao::Dao`;
export const DAO_GENERICS: [string, string] = [`${ACCOUNT_DAO.V1}::dao::Dao`, `${ACCOUNT_DAO.V1}::dao::Votes`];
// Shared objects
export const DAO_REGISTRY = "0x4ce0e0129f98dde6e6e0f3da6fc85f18fd479135625adbf2c2ec36e9a49de3cd";
export const REGISTRY_TABLE_ID = "0x7bb974dd262363a45da5a1323658d0e9852383b7112949b5076708696aeb03c1";
export const DAO_FEES = ""; // none for now