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

        this.startTime = BigInt(fields.fields.start_time);
        this.endTime = BigInt(fields.fields.end_time);

        const results = fields.fields.results.fields.contents;
        this.results = {
            "no": BigInt(results[0].fields.value),
            "yes": BigInt(results[1].fields.value),
            "abstain": BigInt(results[2].fields.value),
        };
    }
}
