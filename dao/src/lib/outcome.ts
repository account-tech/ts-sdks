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
        let dao = fields;
        this.dao = daoId;
        this.key = key;
        this.startTime = dao.startTime;
        this.endTime = dao.endTime;
        this.results = dao.results;
    }
}
