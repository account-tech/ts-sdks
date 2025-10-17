import type { SuiCodegenConfig } from "@mysten/codegen";

const config: SuiCodegenConfig = {
    output: "./src/packages",
    generateSummaries: true,
    prune: true,
    packages: [
        {
            package: "@account/protocol",
            path: "../../move-framework/packages/protocol",
        },
        {
            package: "@account/multisig",
            path: "../../move-registry/packages/multisig",
        }
    ],
};

export default config;