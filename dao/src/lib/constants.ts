export enum ACCOUNT_DAO {
    V1 = "0x4c509c78fb372c0c24cc393e7245e5cd72f9ec071b8e34ba9c972883ddff40dd",
}
// Types
export const DAO_CONFIG_TYPE = `${ACCOUNT_DAO.V1}::dao::Dao`;
export const DAO_GENERICS: [string, string] = [`${ACCOUNT_DAO.V1}::dao::Dao`, `${ACCOUNT_DAO.V1}::dao::Votes`];
// Shared objects
export const DAO_REGISTRY = "0xfd2682957df59facc73bc407cef7af299407ed4dcac1c7f8ae642548f6ae2079";
export const REGISTRY_TABLE_ID = "0x484ff8a003b59fe63656adfdfb604b3a2483bfd1bab52c19c297596031fd3959";
export const DAO_FEES = ""; // none for now