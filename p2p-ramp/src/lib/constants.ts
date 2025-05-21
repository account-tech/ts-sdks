export enum P2P_RAMP {
    V1 = "0x9a56d76d6fa3a1669e2c8b3b6f49eea43608d9ecbf49eaa22ebaa81e01a7d1d9",
}
// Types
export const P2P_RAMP_CONFIG_TYPE = `${P2P_RAMP.V1}::p2p_ramp::P2PRamp`;
export const HANDSHAKE_GENERICS: [string, string] = [`${P2P_RAMP.V1}::p2p_ramp::P2PRamp`, `${P2P_RAMP.V1}::p2p_ramp::Handshake`];
// Shared objects
export const FEES = "0x46e5b684aac57d6118851a18e79a8c8588a0c78d0b80701b6d870d67550739f8";
export const REGISTRY = "0x4288b09ccf20ae896f33276a806c45b165b15b0eb2cfc6bad7258c1f3234353e";
export const REGISTRY_TABLE_ID = "0x2f958f40cedfaa8b29efd0727ac647f5d931b7fb1cd35c2c8e42dfeb1fb89c01";