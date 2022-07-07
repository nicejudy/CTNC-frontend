import React, { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { getAddresses } from "../../constants";
import { CmlContract, NftManagerContract } from "../../abi";
import { setAll } from "../../helpers";

import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks, USDC_DECIMALS, META_JSONS, IPFS_URL } from "../../constants";
import { RootState } from "../store";

interface IGetBalances {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IAccountBalances {
    balances: {
        eth: string;
        usdt: string;
        cml: string;
    };
}

export const getBalances = createAsyncThunk("account/getBalances", async ({ address, networkID, provider }: IGetBalances): Promise<IAccountBalances> => {
    const addresses = getAddresses(networkID);

    const usdtContact = new ethers.Contract(addresses.USDT_ADDRESS, CmlContract, provider);
    const cmlContact = new ethers.Contract(addresses.CML_ADDRESS, CmlContract, provider);

    const ethBalance = ethers.utils.formatEther(await provider.getSigner().getBalance());
    const usdtBalance = ethers.utils.formatUnits(await usdtContact.balanceOf(address), "ether");
    const cmlBalance = ethers.utils.formatUnits(await cmlContact.balanceOf(address), "ether");

    return {
        balances: {
            eth: ethBalance,
            usdt: usdtBalance,
            cml: cmlBalance,
        },
    };
});

interface ILoadAccountDetails {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    loading: boolean;
}

export interface IUserInfoDetails {
    address: string;
    nftId: number;
    lastProcessingTimestamp: number;
    amount: number;
    totalClaimed: number;
    rewardPerDay: number;
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

let initialState = {
    loading: true,
};

export const loadAccountDetails = createAsyncThunk("account/loadAccountDetails", async ({ networkID, provider, address, loading }: ILoadAccountDetails) => {
    // initialState.loading = loading;
    const addresses = getAddresses(networkID);

    const usdtContact = new ethers.Contract(addresses.USDT_ADDRESS, CmlContract, provider);
    const cmlContact = new ethers.Contract(addresses.CML_ADDRESS, CmlContract, provider);
    const nftManagerContract = new ethers.Contract(addresses.NFT_MANAGER, NftManagerContract, provider);

    const ethBalance = ethers.utils.formatEther(await provider.getSigner().getBalance());
    const usdtBalance = await usdtContact.balanceOf(address) / 10**USDC_DECIMALS;
    const cmlBalance = ethers.utils.formatUnits(await cmlContact.balanceOf(address), "ether");

    const ownedNfts = await nftManagerContract.getOwnedNFTIdsOf(address);
    const supportedNfts = await nftManagerContract.getAvailableNFTIdsOf(address);

    let addedNfts = ownedNfts.concat(supportedNfts);
    let duplicate = [];
    for (let i = 0; i < addedNfts.length; i++) {
        for (let j = i + 1; j < addedNfts.length; j++) {
            if (addedNfts[i]*1 == addedNfts[j]*1) {
                duplicate.push(j);
            }
        }
    }
    duplicate.sort();
    for (let i = 0; i < duplicate.length; i++) {
        addedNfts.splice(duplicate[duplicate.length-i-1], 1);
    }

    const nftData = await nftManagerContract.getNFTsByIds(addedNfts);

    const nftCount = nftData.length;

    let nftInfoData = [];
    let totalLockedAmount = 0;
    let totalSupportValue = 0;
    let totalClaimed = 0;

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

        const metaUrl = `${IPFS_URL}${META_JSONS}/${Number(nftData[i][0])}`;

        const res = await axios(metaUrl);
        const attributes = res.data.attributes;

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
            attributes: attributes
        };

        nftInfoData[i] = nft;

        const myInfo = await nftManagerContract.userInfo(nftData[i][0], address);

        totalClaimed += Number(myInfo[2]) / Math.pow(10, 18);
        totalLockedAmount += Number(myInfo[1]) / Math.pow(10, 18);

        if (await nftManagerContract.isOwnerOfNFT(address, nftData[i][0])) {
            totalSupportValue += Number(nftData[i][1][3]) / Math.pow(10, 18);
        }
    }

    const totalAmountForRewards = totalClaimed + totalLockedAmount;

    const totalRewardsPerDay = Number(await nftManagerContract.calculateRewardsPerDay(ethers.utils.parseUnits(totalAmountForRewards.toString(), "ether"))) / Math.pow(10, 18);

    return {
        loading,
        balances: {
            eth: ethBalance,
            usdt: usdtBalance,
            cml: cmlBalance,
        },
        ownedNumber: ownedNfts.length,
        availableNumber: addedNfts.length - ownedNfts.length,
        nft: nftInfoData,
        totalLockedAmount: totalLockedAmount,
        totalSupportValue: totalSupportValue,
        totalClaimed: totalClaimed,
        totalRewardsPerDay: totalRewardsPerDay,
    };
});

export interface IAccountSlice {
    loading: boolean;
    balances: {
        eth: string;
        usdt: string;
        cml: string;
    };
    ownedNumber: number;
    availableNumber: number;
    nft: INftInfoDetails[];
    totalLockedAmount: number;
    totalSupportValue: number;
    totalClaimed: number;
    totalRewardsPerDay: number;
}

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        fetchAccountSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadAccountDetails.pending, state => {
                state.loading = state.loading;
            })
            .addCase(loadAccountDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadAccountDetails.rejected, (state, { error }) => {
                state.loading = true;
                console.log(error);
            });
    },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
