export enum ACCOUNT_DAO {
    V1 = "0x31a2fdac3b7d9458b0779a95bed1ee4cb4845099f227685416995f58a2e13450",
}
// Types
export const DAO_CONFIG_TYPE = `${ACCOUNT_DAO.V1}::dao::Dao`;
export const DAO_GENERICS: [string, string] = [`${ACCOUNT_DAO.V1}::dao::Dao`, `${ACCOUNT_DAO.V1}::dao::Votes`];
// Shared objects
export const DAO_REGISTRY = "0x643fcab19e79f9d02dbf1c9c45e12235f430c91b7d09aac13f7f8a98f902cefe";
export const DAO_FEES = ""; // none for now