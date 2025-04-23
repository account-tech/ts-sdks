import { SuiClient, SuiObjectResponse } from "@mysten/sui/client";
import { normalizeStructTag } from "@mysten/sui/utils";

import { Vote, Staked } from "./types";
import { ACCOUNT_DAO } from "./constants";
import { coinWithBalance, Transaction, TransactionArgument, TransactionObjectInput, TransactionResult } from "@mysten/sui/transactions";
// import { mergeStakedCoin, mergeStakedObject, newStakedCoin, newStakedObject, stakeCoin, stakeObject, unstake, splitStakedCoin } from "src/.gen/account-dao/dao/functions";
import { CLOCK } from "@account.tech/core";

export class Participant {
    votes: Vote[] = [];
    staked: Staked[] = []; // staked objects wrapping coins or other objects
    unstaked: Staked[] = []; // being unstaked according to the cooldown period (if 0 this will be empty)
    claimable: Staked[] = []; // being claimable after the cooldown period (immediately if 0)
    // assets can be coins or NFTs depending on the assetType
    coinBalance?: bigint; // total amount of coins owned
    nftIds?: string[]; // ids of NFTs owned

    private constructor(
        public client: SuiClient,
        public daoAddr: string,
        public assetType: string,
        public userAddr: string,
    ) { }

    static async init(client: SuiClient, daoAddr: string, assetType: string, userAddr: string): Promise<Participant> {
        const participant = new Participant(client, daoAddr, assetType, userAddr);
        await participant.refresh();

        return participant;
    }

    async fetchVotes(
        daoAddr: string = this.daoAddr,
        assetType: string = this.assetType,
    ): Promise<Vote[]> {
        let voteObjs: SuiObjectResponse[] = [];
        let data: SuiObjectResponse[] = [];
        let nextCursor: string | null | undefined = null;
        let hasNextPage = true;

        while (hasNextPage) {
            ({ data, hasNextPage, nextCursor } = await this.client.getOwnedObjects({
                owner: this.userAddr,
                cursor: nextCursor,
                filter: { StructType: normalizeStructTag(`${ACCOUNT_DAO.V1}::dao::Vote<${assetType}>`) },
                options: { showContent: true },
            }));

            voteObjs.push(...data);
        }

        return voteObjs
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
    }

    async fetchStaked(
        daoAddr: string = this.daoAddr,
        assetType: string = this.assetType,
    ): Promise<Staked[]> {
        let stakedObjs: SuiObjectResponse[] = [];
        let data: SuiObjectResponse[] = [];
        let nextCursor: string | null | undefined = null;
        let hasNextPage = true;

        while (hasNextPage) {
            ({ data, hasNextPage, nextCursor } = await this.client.getOwnedObjects({
                owner: this.userAddr,
                cursor: nextCursor,
                filter: { StructType: normalizeStructTag(`${ACCOUNT_DAO.V1}::dao::Staked<${assetType}>`) },
                options: { showContent: true },
            }));

            stakedObjs.push(...data);
        }

        return stakedObjs
            .filter((obj) => (obj.data!.content as any).fields.dao_addr === daoAddr)
            .map((obj) => ({
                id: obj.data!.objectId,
                daoAddr: (obj.data!.content as any).fields.dao_addr,
                value: BigInt((obj.data!.content as any).fields.value),
                unstaked: (obj.data!.content as any).fields.unstaked,
                assetType: (obj.data!.content as any).fields.asset.type.match(/<(.+)>/)![1],
            }));
    }

    async fetchCoins(assetType: string = this.assetType): Promise<bigint> {
        const balance = await this.client.getBalance({
            owner: this.userAddr,
            coinType: this.getCoinType(assetType),
        });
        return BigInt(balance.totalBalance);
    }

    async fetchNfts(assetType: string = this.assetType): Promise<string[]> {
        let nfts: SuiObjectResponse[] = [];
        let data: SuiObjectResponse[] = [];
        let nextCursor: string | null | undefined = null;
        let hasNextPage = true;

        while (hasNextPage) {
            ({ data, hasNextPage, nextCursor } = await this.client.getOwnedObjects({
                owner: this.userAddr,
                cursor: nextCursor,
                filter: { StructType: assetType },
                options: { showContent: true },
            }));

            nfts.push(...data);
        }
        return nfts.map((obj) => obj.data!.objectId);
    }

    async refresh(
        daoAddr: string = this.daoAddr,
        assetType: string = this.assetType,
    ) {
        this.votes = await this.fetchVotes(daoAddr, assetType);

        const stakedDao = await this.fetchStaked(daoAddr, assetType);
        this.staked = stakedDao.filter((staked) => staked.unstaked === null);
        this.unstaked = stakedDao.filter((staked) => staked.unstaked && BigInt(Math.floor(Date.now())) < staked.unstaked);
        this.claimable = stakedDao.filter((staked) => staked.unstaked && BigInt(Math.floor(Date.now())) >= staked.unstaked);

        if (this.assetType.startsWith("0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin")) {
            this.coinBalance = await this.fetchCoins(assetType);
        } else {
            this.nftIds = await this.fetchNfts(assetType);
        }
    }

    //**************************************************************************************************//
    // Staking                                                                                          //
    //**************************************************************************************************//

    stakeCoins(tx: Transaction, amount: bigint) {
        if (!this.isCoin()) {
            throw new Error("Asset is not a coin");
        }
        if (!this.coinBalance || this.coinBalance < amount) {
            throw new Error("Insufficient balance");
        }
        
        this.mergeAllStaked(tx);
        // if there is no staked object, we need to create a new one
        let staked: TransactionObjectInput | undefined;
        if (this.staked.length == 0) {
            staked = tx.moveCall({
                target: `${ACCOUNT_DAO.V1}::dao::new_staked_coin`,
                typeArguments: [this.getCoinType()],
                arguments: [tx.object(this.daoAddr)]
            });
        } else {
            staked = this.staked[0].id;
        }
        // stake new coin 
        tx.moveCall({
            target: `${ACCOUNT_DAO.V1}::dao::stake_coin`,
            typeArguments: [this.getCoinType()],
            arguments: [tx.object(staked), coinWithBalance({ type: this.getCoinType(), balance: amount })]
        });
        // transfer staked if it has been created
        if (this.staked.length == 0) {
            tx.transferObjects([staked], this.userAddr);
        }
    }

    stakeNfts(tx: Transaction, nftIds: string[]) {
        if (this.isCoin()) {
            throw new Error("Asset is a coin");
        }
        if (!this.nftIds || nftIds.filter((id) => this.nftIds?.includes(id)).length === 0) {
            throw new Error("Wrong NFTs provided");
        }
        
        this.mergeAllStaked(tx);
        // if there is no staked object, we need to create a new one
        let staked: TransactionObjectInput | undefined;
        if (this.staked.length == 0) {
            staked = tx.moveCall({
                target: `${ACCOUNT_DAO.V1}::dao::new_staked_object`,
                typeArguments: [this.assetType],
                arguments: [tx.object(this.daoAddr)]
            });
        } else {
            staked = this.staked[0].id;
        }
        // stake new nfts
        nftIds.forEach((id) => {
            tx.moveCall({
                target: `${ACCOUNT_DAO.V1}::dao::stake_object`,
                typeArguments: [this.assetType],
                arguments: [tx.object(staked), tx.object(id)]
            });
        });
        // transfer staked if it has been created
        if (this.staked.length == 0) {
            tx.transferObjects([staked], this.userAddr);
        }
    }

    unstakeCoins(tx: Transaction, amount: bigint): TransactionResult {
        if (!this.isCoin()) {
            throw new Error("Asset is not a coin");
        }
        if (this.staked.length == 0) {
            throw new Error("No staked coin");
        }

        this.mergeAllStaked(tx);
        // split staked coin with the amount to unstake
        const to_unstake = tx.moveCall({
            target: `${ACCOUNT_DAO.V1}::dao::split_staked_coin`,
            typeArguments: [this.getCoinType()],
            arguments: [tx.object(this.staked[0].id), tx.pure.u64(amount)]
        });
        // start unstake process for newly created staked coin
        tx.moveCall({
            target: `${ACCOUNT_DAO.V1}::dao::unstake`,
            typeArguments: [this.assetType],
            arguments: [to_unstake, tx.object(this.daoAddr), tx.object.clock]
        });
        // return newly created staked object
        return to_unstake;
    }

    unstakeNfts(tx: Transaction, nftIds: string[]) {
        if (this.isCoin()) {
            throw new Error("Asset is a coin");
        }
        if (this.staked.length == 0) {
            throw new Error("No staked NFTs");
        }

        this.mergeAllStaked(tx);
        // stake new coin
        const to_unstake = tx.moveCall({
            target: `${ACCOUNT_DAO.V1}::dao::split_staked_object`,
            typeArguments: [this.assetType],
            arguments: [tx.object(this.staked[0].id), tx.pure.vector("id", nftIds)]
        });
        // start unstake process for newly created staked object
        tx.moveCall({
            target: `${ACCOUNT_DAO.V1}::dao::unstake`,
            typeArguments: [this.assetType],
            arguments: [to_unstake, tx.object(this.daoAddr), tx.object.clock]
        });
        // return newly created staked object
        return to_unstake;
    }

    claimUnstaked(tx: Transaction, staked: TransactionArgument) {
        tx.moveCall({
            target: `${ACCOUNT_DAO.V1}::dao::claim_and_keep`,
            typeArguments: [this.assetType],
            arguments: [staked, tx.object.clock]
        });
    }

    claimAll(tx: Transaction) { // if ids is not provided, all claimable will be claimed
        if (this.claimable.length == 0) {
            throw new Error("No claimable");
        }
        this.claimable.map((staked) => staked.id).forEach((id) => {
            tx.moveCall({
                target: `${ACCOUNT_DAO.V1}::dao::claim_and_keep`,
                typeArguments: [this.assetType],
                arguments: [tx.object(id), tx.object.clock]
            });
        });
    }

    //**************************************************************************************************//
    // Voting                                                                                           //
    //**************************************************************************************************//

    vote(tx: Transaction, intentKey: string, answer: number) {
        this.mergeAllStaked(tx);

        const vote = tx.moveCall({
            target: `${ACCOUNT_DAO.V1}::dao::new_vote`,
            typeArguments: [this.assetType],
            arguments: [tx.object(this.daoAddr), tx.pure.string(intentKey), tx.object(this.staked[0].id), tx.object(CLOCK)]
        });

        tx.moveCall({
            target: `${ACCOUNT_DAO.V1}::dao::vote`,
            typeArguments: [this.assetType],
            arguments: [vote, tx.object(this.daoAddr), tx.pure.u8(answer), tx.object(CLOCK)]
        });

        tx.transferObjects([vote], this.userAddr);
    }

    destroyVote(tx: Transaction, voteId: string) {
        if (this.votes.find((vote) => vote.id === voteId) === undefined) {
            throw new Error("Vote not found");
        }
        if (BigInt(Date.now()) < this.votes.find((vote) => vote.id === voteId)!.voteEnd) {
            throw new Error("Vote is not ended");
        }

        tx.moveCall({
            target: `${ACCOUNT_DAO.V1}::dao::destroy_vote`,
            typeArguments: [this.assetType],
            arguments: [tx.object(voteId), tx.object(CLOCK)]
        });
    }

    //**************************************************************************************************//
    // Helpers                                                                                          //
    //**************************************************************************************************//

    mergeAllStaked(tx: Transaction) {
        if (this.staked.length < 2) return;

        for (let i = 1; i < this.staked.length; i++) {
            tx.moveCall({
                target: `${ACCOUNT_DAO.V1}::dao::${this.isCoin() ? "merge_staked_coin" : "merge_staked_object"}`,
                typeArguments: [this.isCoin() ? this.getCoinType() : this.assetType],
                arguments: [tx.object(this.staked[0].id), tx.object(this.staked[i].id)]
            });
        }
    }

    isCoin(assetType: string = this.assetType): boolean {
        return assetType.startsWith("0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin");
    } 

    getCoinType(assetType: string = this.assetType): string {
        if (!this.isCoin(assetType)) {
            throw new Error("Asset is not a coin");
        }
        return assetType.match(/<([^>]*)>/)![1];
    }
}