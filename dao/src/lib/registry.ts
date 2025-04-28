import { SuiClient } from "@mysten/sui/client";
import { REGISTRY_TABLE_ID } from "./constants";
import { DaoMetadata } from "./types";

export class Registry {
    daos: DaoMetadata[] = [];

    private constructor(
        public client: SuiClient,
    ) {}

    static async init(client: SuiClient): Promise<Registry> {
        const registry = new Registry(client);
        await registry.refresh();

        return registry;
    }

    // get and format extensions data
    async fetch(): Promise<DaoMetadata[]> {
        const registry = await this.client.getDynamicFields({ 
            parentId: REGISTRY_TABLE_ID
        });

        const ids = registry.data.map(d => d.name.value as string);

        const daos = [];
        for (let i = 0; i < ids.length; i += 50) {
            const batch = ids.slice(i, i + 50);
            const batchResults = await this.client.multiGetObjects({
                ids: batch,
                options: { showContent: true }
            });
            daos.push(...batchResults);
        }

        return daos.map(d => {
            const metadata = (d.data?.content as any).fields.metadata.fields.inner.fields.contents;
            return {
                id: d.data?.objectId,
                name: metadata.find((m: any) => m.fields.key === "name")?.fields.value,
                description: metadata.find((m: any) => m.fields.key === "description")?.fields.value,
                image: metadata.find((m: any) => m.fields.key === "image")?.fields.value,
                twitter: metadata.find((m: any) => m.fields.key === "twitter")?.fields.value,
                telegram: metadata.find((m: any) => m.fields.key === "telegram")?.fields.value,
                discord: metadata.find((m: any) => m.fields.key === "discord")?.fields.value,
                github: metadata.find((m: any) => m.fields.key === "github")?.fields.value,
                website: metadata.find((m: any) => m.fields.key === "website")?.fields.value,
            }
        });
    }

    async refresh() {
        this.daos = await this.fetch();
    }
}

