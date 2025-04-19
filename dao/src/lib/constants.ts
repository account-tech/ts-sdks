export enum ACCOUNT_DAO {
    V1 = "0x9b79b60a02c37c340ee81b9ab449038852a89c51bdee9d93da15f60959f36ca5",
}
// Types
export const DAO_CONFIG_TYPE = `${ACCOUNT_DAO.V1}::dao::Dao`;
export const DAO_GENERICS: [string, string] = [`${ACCOUNT_DAO.V1}::dao::Dao`, `${ACCOUNT_DAO.V1}::dao::Votes`];
// Shared objects
export const DAO_REGISTRY = "0xe5e425042b218fe7094570912d3756c9dc63a37038f5398b2b9229e9fa7c1f3e";
export const DAO_FEES = ""; // none for now