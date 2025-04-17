export enum ACCOUNT_DAO {
    V1 = "0xe0a321104fa859cc9dcf962ef62a32e93ca2b1d5e493eb2454050af5203cefc8",
}
// Types
export const DAO_CONFIG_TYPE = `${ACCOUNT_DAO.V1}::dao::Dao`;
export const DAO_GENERICS: [string, string] = [`${ACCOUNT_DAO.V1}::dao::Dao`, `${ACCOUNT_DAO.V1}::dao::Votes`];
// Shared objects
export const DAO_REGISTRY = "0x9c0e7c99ec591dce4e4a2f2588ccc97a2e9d995e280b5d99fc2a57c16d7f35a4";
export const DAO_FEES = ""; // none for now