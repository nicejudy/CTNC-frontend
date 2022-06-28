import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { CmlContract, NftManagerContract } from "../../abi";

import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../../constants/blockchain";
import { IUserInfoDetails } from "./account-slice";

interface ILoadAccountDetails {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

export interface INftInfoDetails {
    id: number;
    owner: string;
    lastProcessingTimestamp: number;
    amount: number;
    supportValue: number;
    supporters: IUserInfoDetails[];
    rewardPerDay: number;
    totalClaimed: number;
    exists: boolean;
}

export const loadAccountDetails = async ({ networkID, provider, address }: ILoadAccountDetails) => {
    const addresses = getAddresses(networkID);

    const nftManagerContract = new ethers.Contract(addresses.NFT_MANAGER, NftManagerContract, provider);

    const nftIds = await nftManagerContract.getOwnedNFTIdsOf(address);
    const nftData = await nftManagerContract.getNFTsByIds(nftIds);

    const nftCount = nftData.length;

    let nftInfoData = [];

    for (let i = 0; i < nftCount; i++) {
        const users = await nftManagerContract.getUsersOf(nftData[i][0]);
        const userCount = users.length;

        let supporters = [];

        for (let j = 0; j < userCount; j++) {
            const userData = await nftManagerContract.userInfo(nftData[i][0], users[j]);
            const supporter: IUserInfoDetails = {
                address: users[j],
                nftId: Number(nftData[i][0]),
                lastProcessingTimestamp: Number(userData[0]),
                amount: Number(userData[1]),
                totalClaimed: Number(userData[2]),
                rewardPerDay: Number(await nftManagerContract.calculateRewardsPerDay(userData[1])),
            };

            supporters[j] = supporter;
        }

        const nft: INftInfoDetails = {
            id: Number(nftData[i][0]),
            owner: await nftManagerContract.ownerOf(nftData[i][0]),
            lastProcessingTimestamp: Number(nftData[i][1][1]),
            amount: Number(nftData[i][1][2]) / Math.pow(10, 18),
            supportValue: Number(nftData[i][1][3]) / Math.pow(10, 18),
            supporters: supporters,
            totalClaimed: Number(nftData[i][1][4]) / Math.pow(10, 18),
            exists: Boolean(nftData[i][1][5]),
            rewardPerDay: Number(nftData[i][2]) / Math.pow(10, 18),
        };

        nftInfoData[i] = nft;
    }

    return {
        nfts: nftInfoData,
        number: nftCount,
    };
};

interface ILoadIdDetails {
    id: string[];
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

export const loadIdDetails = async ({ networkID, provider, id }: ILoadIdDetails) => {
    const addresses = getAddresses(networkID);

    const nftManagerContract = new ethers.Contract(addresses.NFT_MANAGER, NftManagerContract, provider);
    const nftData = await nftManagerContract.getNFTsByIds(id);

    const nftCount = nftData.length;

    let nftInfoData = [];

    for (let i = 0; i < nftCount; i++) {
        const users = await nftManagerContract.getUsersOf(nftData[i][0]);
        const userCount = users.length;

        let supporters = [];

        for (let j = 0; j < userCount; j++) {
            const userData = await nftManagerContract.userInfo(nftData[i][0], users[j]);
            const supporter: IUserInfoDetails = {
                address: users[j],
                nftId: Number(nftData[i][0]),
                lastProcessingTimestamp: Number(userData[0]),
                amount: Number(userData[1]),
                totalClaimed: Number(userData[2]),
                rewardPerDay: Number(await nftManagerContract.calculateRewardsPerDay(userData[1])),
            };

            supporters[j] = supporter;
        }

        const nft: INftInfoDetails = {
            id: Number(nftData[i][0]),
            owner: await nftManagerContract.ownerOf(nftData[i][0]),
            lastProcessingTimestamp: Number(nftData[i][1][1]),
            amount: Number(nftData[i][1][2]) / Math.pow(10, 18),
            supportValue: Number(nftData[i][1][3]) / Math.pow(10, 18),
            supporters: supporters,
            totalClaimed: Number(nftData[i][1][4]) / Math.pow(10, 18),
            exists: Boolean(nftData[i][1][5]),
            rewardPerDay: Number(nftData[i][2]) / Math.pow(10, 18),
        };

        nftInfoData[i] = nft;
    }

    return {
        nfts: nftInfoData,
        number: nftCount,
    };
};
