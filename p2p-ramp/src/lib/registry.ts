import { SuiClient } from "@mysten/sui/client";
import { REGISTRY_TABLE_ID } from "./constants";

export class Registry {
    accounts: { id: string, name: string }[] = [];

    private constructor(
        public client: SuiClient,
    ) {}

    static async init(client: SuiClient): Promise<Registry> {
        const registry = new Registry(client);
        await registry.refresh();

        return registry;
    }

    // get and format extensions data
    async fetch(): Promise<{ id: string, name: string }[]> {
        const registry = await this.client.getDynamicFields({ 
            parentId: REGISTRY_TABLE_ID
        });

        const ids = registry.data.map(d => d.name.value as string);

        const accounts = [];
        for (let i = 0; i < ids.length; i += 50) {
            const batch = ids.slice(i, i + 50);
            const batchResults = await this.client.multiGetObjects({
                ids: batch,
                options: { showContent: true }
            });
            accounts.push(...batchResults);
        }

        return accounts.map(d => {
            const metadata = (d.data?.content as any).fields.metadata.fields.inner.fields.contents;
            return {
                id: d.data!.objectId,
                name: metadata.find((m: any) => m.fields.key === "name")?.fields.value,
            };
        });
    }

    async refresh() {
        this.accounts = await this.fetch();
    }
}

