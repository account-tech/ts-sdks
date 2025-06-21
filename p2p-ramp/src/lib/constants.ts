export enum P2P_RAMP {
    V1 = "0x785d6798769a2b2fabfca977d535c1e2b2b43ea50c6e47a76a39a2e0e58c470c",
}
// Types
export const P2P_RAMP_CONFIG_TYPE = `${P2P_RAMP.V1}::p2p_ramp::P2PRamp`;
export const HANDSHAKE_GENERICS: [string, string] = [`${P2P_RAMP.V1}::p2p_ramp::P2PRamp`, `${P2P_RAMP.V1}::p2p_ramp::Handshake`];
// Shared objects
export const POLICY = "0x2b6732872b21977b18dc62d0f81d205a0ea73a1f23dd1bbf91aadffc8475734b";
export const ACCOUNT_REGISTRY = "0x3e38bd54d932a8aa922aff4613101abefcc92f7c21d756544377855a02609c32";
export const ACCOUNT_REGISTRY_TABLE_ID = "0x97375c2294cf793c513d3e17d24ca05f32e0e6151377137d805a2ce2bc9eb646";
export const ORDER_REGISTRY = "0xca6625c6ba01a59b10aa904a501c7cbbcc764a4e678b773b623947971bfc20d8";