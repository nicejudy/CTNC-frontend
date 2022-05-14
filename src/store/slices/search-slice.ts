import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { ApeuContract, ApeuManagerContract } from "../../abi";

import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../../constants/blockchain";

interface ILoadAccountDetails {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

export interface IPlanetInfoDetails {
    id: number;
    owner: string;
    creationTime: number;
    lastProcessingTimestamp: number;
    planetValue: number;
    totalClaimed: number;
    exists: boolean;
    pendingReward: number;
    rewardPerDay: number;
}

export const loadAccountDetails = async ({ networkID, provider, address }: ILoadAccountDetails) => {
    const addresses = getAddresses(networkID);

    const apeuManagerContract = new ethers.Contract(addresses.NFT_MANAGER, ApeuManagerContract, provider);

    //get planet data
    const planetIds = await apeuManagerContract.getNFTIdsOf(address);
    const planetData = await apeuManagerContract.getNFTsByIds(planetIds);

    const planetCount = planetData.length;

    let planetInfoData = [];
    let estimatedPerDay = 0;
    let totalPendingReward = 0;

    for (let i = 0; i < planetCount; i++) {
        const planet: IPlanetInfoDetails = {
            id: Number(planetData[i][1]),
            owner: address,
            creationTime: Number(planetData[i][0][1]),
            lastProcessingTimestamp: Number(planetData[i][0][2]),
            planetValue: Number(planetData[i][0][3]) / Math.pow(10, 18),
            totalClaimed: Number(planetData[i][0][4]) / Math.pow(10, 18),
            exists: Boolean(planetData[i][0][5]),
            pendingReward: Number(planetData[i][2]) / Math.pow(10, 18),
            rewardPerDay: Number(planetData[i][3]) / Math.pow(10, 18),
        };

        estimatedPerDay += Number(planetData[i][3]);
        totalPendingReward += Number(planetData[i][2]);

        planetInfoData[i] = planet;
    }

    const estimatedPerDayValue = estimatedPerDay / Math.pow(10, 18);
    const totalPendingRewardValue = totalPendingReward / Math.pow(10, 18);

    return {
        planets: planetInfoData,
        number: planetCount,
        estimated: estimatedPerDayValue,
        totalpending: totalPendingRewardValue,
    };
};

interface ILoadIdDetails {
    id: string[];
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

export const loadIdDetails = async ({ networkID, provider, id }: ILoadIdDetails) => {
    const addresses = getAddresses(networkID);

    const apeuManagerContract = new ethers.Contract(addresses.NFT_MANAGER, ApeuManagerContract, provider);

    //get planet data
    const planetData = await apeuManagerContract.getNFTsByIds(id);

    const planetCount = planetData.length;

    let planetInfoData = [];

    for (let i = 0; i < planetCount; i++) {
        const planet: IPlanetInfoDetails = {
            id: Number(planetData[i][1]),
            owner: await apeuManagerContract.ownerOf(Number(planetData[i][1])),
            creationTime: Number(planetData[i][0][1]),
            lastProcessingTimestamp: Number(planetData[i][0][2]),
            planetValue: Number(planetData[i][0][3]) / Math.pow(10, 18),
            totalClaimed: Number(planetData[i][0][4]) / Math.pow(10, 18),
            exists: Boolean(planetData[i][0][5]),
            pendingReward: Number(planetData[i][2]) / Math.pow(10, 18),
            rewardPerDay: Number(planetData[i][3]) / Math.pow(10, 18),
        };

        planetInfoData[i] = planet;
    }

    return {
        planets: planetInfoData,
        number: planetCount,
    };
};
