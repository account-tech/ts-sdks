import { Order } from "./types";
import { Asset } from "@account.tech/core";
import { P2P_RAMP } from "./constants";

export class Orders extends Asset {
    override type = "orders";
    static keys = [`${P2P_RAMP.V1}::orders::Order`];
    override assets: Record<string, Order> = {}; // id -> order

    async init() {
        this.dfs = this.dfs.filter(df => Orders.keys.some(key => df.name.type.includes(key)));
        const dfIds = this.dfs.map(df => df.objectId);
        // First get all vault objects to extract bag IDs
        // Process in batches of 50 due to API limitations
        const dfContents = [];
        for (let i = 0; i < dfIds.length; i += 50) {
            const batch = dfIds.slice(i, i + 50);
            const batchResults = await this.client.multiGetObjects({
                ids: batch,
                options: { showContent: true }
            });
            dfContents.push(...batchResults);
        }

        
    }
}