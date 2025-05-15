export enum P2P_RAMP {
    V1 = "0xb2ed46e2db9b8b46ab33bbb7a7bc6abca5da8bdfc4743c42b2d14403962d894c",
}
// Types
export const P2P_RAMP_CONFIG_TYPE = `${P2P_RAMP.V1}::p2p_ramp::P2PRamp`;
export const HANDSHAKE_GENERICS: [string, string] = [`${P2P_RAMP.V1}::p2p_ramp::P2PRamp`, `${P2P_RAMP.V1}::p2p_ramp::Handshake`];
// Shared objects
export const FEES = "0x8c06825f41cb7c9799bb329faa8a9c7a6eb9076433b7156e50a2c9969671fcd7";