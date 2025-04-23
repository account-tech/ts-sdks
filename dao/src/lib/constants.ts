export enum ACCOUNT_DAO {
    V1 = "0x23f488a687766b21ac2ab80533d435fb83e7b3bb2f64e4536aae7497b28e61aa",
}
// Types
export const DAO_CONFIG_TYPE = `${ACCOUNT_DAO.V1}::dao::Dao`;
export const DAO_GENERICS: [string, string] = [`${ACCOUNT_DAO.V1}::dao::Dao`, `${ACCOUNT_DAO.V1}::dao::Votes`];
// Shared objects
export const DAO_REGISTRY = "0xd314532377133327531c822d6302788b8e3a760f7405d590f24a57442f41d8ca";
export const DAO_FEES = ""; // none for now