export enum ACCOUNT_DAO {
    V1 = "0x7a5e095a37f29c55834bfd56508e570e3199ccf2ec0b760680cdf35f5653f8b7",
}
// Types
export const DAO_CONFIG_TYPE = `${ACCOUNT_DAO.V1}::dao::Dao`;
export const DAO_GENERICS: [string, string] = [`${ACCOUNT_DAO.V1}::dao::Dao`, `${ACCOUNT_DAO.V1}::dao::Votes`];
// Shared objects
export const DAO_REGISTRY = "0x7b7c429cceb9bd1a9cfc7fa24ca92c3d142a50eb501ac35898da3a51888ad47c";
export const REGISTRY_TABLE_ID = "0xc8a49535699eaf9a39365984e9094ab81f00bf49036fec76d147aa8e1bc08e7f";
export const DAO_FEES = ""; // none for now