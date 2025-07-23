import {SuiClient} from "@mysten/sui/client";
import {POLICY} from "./constants.ts";

export class Policy {

    data: { allowedCoins: string[], allowedFiat: string[] } = {
        allowedCoins: [],
        allowedFiat: []
    };

    constructor(
        public client: SuiClient
    ) {
    }

    static async init(client: SuiClient): Promise<Policy> {
        const fees = new Policy(client);
        await fees.refresh();
        return fees;
    }

    async fetch(): Promise<{ allowedCoins: string[], allowedFiat: string[] }> {
        const fees = await this.client.getObject({
            id: POLICY,
            options: {
                showContent: true
            }
        });

        const fields = (fees.data?.content as any).fields

        const allowedCoins = fields.allowed_coins.fields.contents.map((m: any) => (m.fields.name));
        const allowedFiat = fields.allowed_fiat.fields.contents.map((m: any) => (m));

        return {
            allowedCoins,
            allowedFiat
        }
    }

    async refresh() {
        this.data = await this.fetch();
    }
}