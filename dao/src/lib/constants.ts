export enum ACCOUNT_DAO {
    V1 = "0x5a53f7b9f934c7f311c8652f58807b09736ddd7b5890b422c274616f64c94804",
}
// Types
export const DAO_CONFIG_TYPE = `${ACCOUNT_DAO.V1}::dao::Dao`;
export const DAO_GENERICS: [string, string] = [`${ACCOUNT_DAO.V1}::dao::Dao`, `${ACCOUNT_DAO.V1}::dao::Votes`];
// Shared objects
export const DAO_REGISTRY = "0x1fa53017bac3c44f565d079ec44ce141bfc84a3f93b0c58a184d596af66ffdcc";
export const REGISTRY_TABLE_ID = "0x46a13ab4fe3bfc3bcc05dc441bbebe023e42fbb91a822b3fd02a01503addaec8";
export const DAO_FEES = ""; // none for now