export enum ACCOUNT_DAO {
    V1 = "0x20f1c59b9c4a167faa8c2ee7b2c893180a191d1385b921221d4552ac7a7bd64e",
}
// Types
export const DAO_CONFIG_TYPE = `${ACCOUNT_DAO.V1}::dao::Dao`;
export const DAO_GENERICS: [string, string] = [`${ACCOUNT_DAO.V1}::dao::Dao`, `${ACCOUNT_DAO.V1}::dao::Votes`];
// Shared objects
export const DAO_REGISTRY = "0xd1cf32101b9ddb4d608da2fca76c2efebefc4d8de683c5d800f15690ee6f2277";
export const REGISTRY_TABLE_ID = "0x4e2375e37dca5da11ecebd43b805be7a60dfe4feee897003d603f4491bcd3f71";
export const DAO_FEES = ""; // none for now