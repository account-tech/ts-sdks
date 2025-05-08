export enum ACCOUNT_MULTISIG {
    V1 = "0xe5dbd5e399a4b85547557a00066fd0ab72e8b7c53605de950fdf385091b33a29",
}
// Types
export const MULTISIG_CONFIG_TYPE = `${ACCOUNT_MULTISIG.V1}::multisig::Multisig`;
export const MULTISIG_GENERICS: [string, string] = [`${ACCOUNT_MULTISIG.V1}::multisig::Multisig`, `${ACCOUNT_MULTISIG.V1}::multisig::Approvals`];
// Shared objects
export const MULTISIG_FEES = "0x6a5a6fb7fd711ddfbaa50d3123b562841b91965baf16514bddd4206989897590";