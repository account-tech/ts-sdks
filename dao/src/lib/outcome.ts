import { Outcome } from "@account.tech/core";
import { ACCOUNT_DAO } from "./constants";

export class Votes implements Outcome {
    static type = `${ACCOUNT_DAO.V1}::dao::Votes`;

    dao: string;
    key: string;
    // Votes Data
    start_time: bigint;
    end_time: bigint;
    results: Record<string, bigint>;

    constructor(daoId: string, key: string, fields: any) {
        let dao = fields;
        this.dao = daoId;
        this.key = key;
        this.start_time = dao.start_time;
        this.end_time = dao.end_time;
        this.results = dao.results;
    }
}
