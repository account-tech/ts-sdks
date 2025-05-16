export enum ACCOUNT_DAO {
    V1 = "0x7eb2ff72d841d123b808015f8fb39d0abb6a2af5e99764890bc12d69f530141d",
}
// Types
export const DAO_CONFIG_TYPE = `${ACCOUNT_DAO.V1}::dao::Dao`;
export const DAO_GENERICS: [string, string] = [`${ACCOUNT_DAO.V1}::dao::Dao`, `${ACCOUNT_DAO.V1}::dao::Votes`];
// Shared objects
export const DAO_REGISTRY = "0x2d3d3d270385a16d709a69c6d313f806ec51cb28cfb6409853b40b4fed1b0b25";
export const REGISTRY_TABLE_ID = "0x735cff5c69d3c6db62f69b53eea0b6d52f94674ab88b7ace7792adc7241c8e72";
export const DAO_FEES = ""; // none for now