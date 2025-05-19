import { Outcome } from "@account.tech/core";
import { ACCOUNT_DAO } from "./constants";

export class Votes implements Outcome {
    static type = `${ACCOUNT_DAO.V1}::dao::Votes`;

    dao: string;
    key: string;
    // Votes Data
    startTime: bigint;
    endTime: bigint;
    results: Record<string, bigint>;

    constructor(daoId: string, key: string, fields: any) {
        this.dao = daoId;
        this.key = key;

        this.startTime = fields.fields.start_time;
        this.endTime = fields.fields.end_time;

        const results = fields.fields.results.fields.contents;
        this.results = {
            "no": results[0].fields.value,
            "yes": results[1].fields.value,
            "abstain": results[2].fields.value
        };
    }
}
