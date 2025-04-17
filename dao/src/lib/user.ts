import { SuiClient, SuiObjectResponse } from "@mysten/sui/client";
import { Vote, Staked } from "./types";
import { ACCOUNT_DAO } from "./constants";

export class Participant {
    vote: Vote[] = [];
    staked: Staked[] = [];

    private constructor(
        public client: SuiClient,
        public daoAddr: string,
        public assetType: string,
        public userAddr: string,
    ) {}

    static async init(client: SuiClient, daoAddr: string, assetType: string, userAddr: string): Promise<Participant> {
        const participant = new Participant(client, daoAddr, assetType, userAddr);

        // get Vote objects
        let voteObjs: SuiObjectResponse[] = [];
        {
            let data: SuiObjectResponse[] = [];
            let nextCursor: string | null | undefined = null;
            let hasNextPage = true;
            
            while (hasNextPage) {
                ({ data, hasNextPage, nextCursor } = await client.getOwnedObjects({
                    owner: userAddr,
                    cursor: nextCursor,
                    filter: { StructType: `${ACCOUNT_DAO.V1}::dao::Vote<${assetType}>` },
                    options: { showContent: true },
                }));
                
                voteObjs.push(...data);
            }
        }
        participant.vote = voteObjs
            .filter((obj) => (obj.data!.content as any).fields.daoAddr === daoAddr)
            .map((obj) => ({
                id: obj.data!.objectId,
                daoAddr: (obj.data!.content as any).fields.daoAddr,
                intentKey: (obj.data!.content as any).fields.intentKey,
                answer: (obj.data!.content as any).fields.answer,
                power: (obj.data!.content as any).fields.power,
                voteEnd: (obj.data!.content as any).fields.voteEnd,
                staked: (obj.data!.content as any).fields.staked,
            }));
        
        // get Staked objects
        let stakedObjs: SuiObjectResponse[] = [];
        {
            let data: SuiObjectResponse[] = [];
            let nextCursor: string | null | undefined = null;
            let hasNextPage = true;
    
            while (hasNextPage) {
                ({ data, hasNextPage, nextCursor } = await client.getOwnedObjects({
                    owner: userAddr,
                    cursor: nextCursor,
                    filter: { StructType: `${ACCOUNT_DAO.V1}::dao::Staked<${assetType}>` },
                    options: { showContent: true },
                }));

                stakedObjs.push(...data);
            }
        }
        
        participant.staked = stakedObjs
            .filter((obj) => (obj.data!.content as any).fields.daoAddr === daoAddr)
            .map((obj) => ({
                id: obj.data!.objectId,
                daoAddr: (obj.data!.content as any).fields.daoAddr,
                value: (obj.data!.content as any).fields.value,
                unstaked: (obj.data!.content as any).fields.unstaked,
                assetType: (obj.data!.content as any).fields.assetType,
            }));

        return participant;
    }
}