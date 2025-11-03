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
            package: "@account/dao",
            path: "../../move-registry/packages/dao",
        }
    ],
};

export default config;