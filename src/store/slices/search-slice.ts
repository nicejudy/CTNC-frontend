import React, { useState, useCallback, useEffect } from "react";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import axios from "axios";
import { CmlContract, NftManagerContract } from "../../abi";

import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { multicall, setAll } from "../../helpers";
import { Networks, USDC_DECIMALS, META_JSONS, IPFS_URL, getAddresses } from "../../constants";
import { IUserInfoDetails } from "./account-slice";
import { RootState } from "../store";

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
    attributes: any[];
}

export const loadAccountDetails = async ({ networkID, provider, address }: ILoadAccountDetails) => {
    const addresses = getAddresses(networkID);

    const nftManagerContract = new ethers.Contract(addresses.NFT_MANAGER, NftManagerContract, provider);

    const calls_nft0 = [
        {
            address: addresses.NFT_MANAGER,
            name: 'getOwnedNFTIdsOf',
            params: [address]
        }
    ]

    const [nftIds] = await multicall(NftManagerContract, calls_nft0);

    let nftIdsAsString = [];

    for (let i = 0; i < nftIds.length; i++) {
        nftIdsAsString.push(nftIds[i].toString());
    }

    return {
        nfts: nftIdsAsString,
    };
};

interface ILoadIdDetails {
    id: string;
    networkID: Networks;
}

export const loadOwnerDetails = async ({networkID, id}: ILoadIdDetails) => {
    const addresses = getAddresses(networkID);

        const calls_nft0 = [
            {
                address: addresses.NFT_MANAGER,
                name: 'ownerOf',
                params: [id]
            }
        ]

        const [[owner]] = await multicall(NftManagerContract, calls_nft0);

        return {
            owner: owner
        };
}

export const loadIdDetails = async ({ networkID, id }: ILoadIdDetails) => {
    const addresses = getAddresses(networkID);

    const calls_nft0 = [
        {
            address: addresses.NFT_MANAGER,
            name: 'getNFTsByIds',
            params: [[id]]
        },
        {
            address: addresses.NFT_MANAGER,
            name: 'rewardPerDay'
        }
    ]

    const [[nftData], [rewardPerDay]] = await multicall(NftManagerContract, calls_nft0);
    

    const nftCount = nftData.length;

    let nftInfoData = [];

    let calls_nft1 = [];

    for (let i = 0; i < nftCount; i++) {
        calls_nft1.push({
            address: addresses.NFT_MANAGER,
            name: 'getUsersOf',
            params: [nftData[i][0]]
        });
    }
    for (let i = 0; i < nftCount; i++) {
        calls_nft1.push({
            address: addresses.NFT_MANAGER,
            name: 'ownerOf',
            params: [nftData[i][0]]
        });
    }

    const users = await multicall(NftManagerContract, calls_nft1) as Array<any>;

    for (let i = 0; i < nftCount; i++) {
        const userCount = users[i][0].length;

        let supporters = [];

        let calls_nft2 = []
        for (let j = 0; j < userCount; j++){
            calls_nft2.push({
                address: addresses.NFT_MANAGER,
                name: 'userInfo',
                params: [nftData[i][0], users[i][0][j]]
            });
        }

        const [userData] = await multicall(NftManagerContract, calls_nft2) as Array<any>;

        for (let j = 0; j < userCount; j++) {
            const supporter: IUserInfoDetails = {
                address: users[i][0][j],
                nftId: Number(nftData[i][0]),
                lastProcessingTimestamp: Number(userData[0]),
                amount: Number(userData[1]),
                totalClaimed: Number(userData[2]),
                rewardPerDay: Number(rewardPerDay) * 86400 * Number(userData[1]) / 1e11,
            };

            supporters[j] = supporter;
        }

        const metaUrl = `${IPFS_URL}${META_JSONS}/${Number(nftData[i][0])}`;

        const res = await axios(metaUrl);
        const attributes = res.data.attributes;

        const nft: INftInfoDetails = {
            id: Number(nftData[i][0]),
            owner: users[nftCount + i][0],
            lastProcessingTimestamp: Number(nftData[i][1][1]),
            amount: Number(nftData[i][1][2]) / Math.pow(10, 18),
            supportValue: Number(nftData[i][1][3]) / Math.pow(10, 18),
            supporters: supporters,
            totalClaimed: Number(nftData[i][1][4]) / Math.pow(10, 18),
            exists: Boolean(nftData[i][1][5]),
            rewardPerDay: Number(nftData[i][2]) / Math.pow(10, 18),
            attributes: attributes
        };

        nftInfoData[i] = nft;
    }

    return {
        nfts: nftInfoData,
        number: nftCount,
    };
}