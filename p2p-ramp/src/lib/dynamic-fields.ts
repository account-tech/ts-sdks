import { Order } from "./types";
import { P2P_RAMP } from "./constants";
import {Asset} from "@account.tech/core/lib/objects";

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

        this.assets = dfContents.reduce((acc: Record<string, Order>, df) => {
            const coinType = (df.data?.content as any).fields.value.type.match(/<([^>]*)>/)[1];
            const fields = (df.data?.content as any).fields.value.fields;
            acc[(df.data?.content as any).fields.name.fields.pos0] = {
                coinType,
                isBuy: fields.is_buy,
                minFill: fields.min_fill,
                maxFill: fields.max_fill,
                fiatAmount: fields.fiat_amount,
                fiatCode: fields.fiat_code,
                coinAmount: fields.coin_amount,
                coinBalance: fields.coin_balance,
                pendingFill: fields.pending_fill,
                completed_fill: fields.completed_fill,
            };
            return acc;
        }, {} as Record<string, Order>);
    }
}