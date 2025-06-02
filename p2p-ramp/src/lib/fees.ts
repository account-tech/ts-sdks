import {SuiClient} from "@mysten/sui/client";
import {FEES} from "./constants.ts";

export class Fees {

    data: { allowedCoins: string[], allowedFiat: string[] } = {
        allowedCoins: [],
        allowedFiat: []
    };

    constructor(
        public client: SuiClient
    ) {
    }

    static async init(client: SuiClient): Promise<Fees> {
        const fees = new Fees(client);
        await fees.refresh();
        return fees;
    }

    async fetch(): Promise<{ allowedCoins: string[], allowedFiat: string[] }> {
        const fees = await this.client.getObject({
            id: FEES,
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