export enum ACCOUNT_DAO {
    V1 = "0x63811e3db20254a9273ce0757a28578485268b57f4a10efde7680f97f1a88908",
}
// Types
export const DAO_CONFIG_TYPE = `${ACCOUNT_DAO.V1}::dao::Dao`;
export const DAO_GENERICS: [string, string] = [`${ACCOUNT_DAO.V1}::dao::Dao`, `${ACCOUNT_DAO.V1}::dao::Votes`];
// Shared objects
export const DAO_REGISTRY = "0x37a7913a6b71467905d65feb0ed2e5afb413488ba8271fe392455b0735e8e7de";
export const REGISTRY_TABLE_ID = "0x7552be0e31c8b04cc88f353948e856dfa8dd18bfff87ddfc5f99361c0715573c";
export const DAO_FEES = ""; // none for now