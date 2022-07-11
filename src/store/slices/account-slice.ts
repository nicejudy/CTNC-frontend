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
import { multicall } from "../../helpers";

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
    const addresses = getAddresses(networkID);

    const nftManagerContract = new ethers.Contract(addresses.NFT_MANAGER, NftManagerContract, provider);

    const calls_token = [
        {
            address: addresses.USDT_ADDRESS,
            name: 'balanceOf',
            params: [address]
        },
        {
            address: addresses.CML_ADDRESS,
            name: 'balanceOf',
            params: [address]
        }
    ]

    const [[usdtBalance], [cmlBalance]] = await multicall(CmlContract, calls_token);

    const ethBalance = ethers.utils.formatEther(await provider.getSigner().getBalance());


    const calls_nft1 = [
        {
            address: addresses.NFT_MANAGER,
            name: 'getOwnedNFTIdsOf',
            params: [address]
        },
        {
            address: addresses.NFT_MANAGER,
            name: 'getAvailableNFTIdsOf',
            params: [address]
        },
        {
            address: addresses.NFT_MANAGER,
            name: 'rewardPerDay'
        }
    ]

    const [[ownedNfts], [supportedNfts], [rewardPerDay]] = await multicall(NftManagerContract, calls_nft1);

    // const ownedNfts = await nftManagerContract.getOwnedNFTIdsOf(address);
    // const supportedNfts = await nftManagerContract.getAvailableNFTIdsOf(address);

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
    let isOwner = [];

    let calls_nft2 = [];

    for (let i = 0; i < nftCount; i++) {
        calls_nft2.push({
            address: addresses.NFT_MANAGER,
            name: 'getUsersOf',
            params: [nftData[i][0]]
        });
    }
    for (let i = 0; i < nftCount; i++) {
        calls_nft2.push({
            address: addresses.NFT_MANAGER,
            name: 'ownerOf',
            params: [nftData[i][0]]
        });
    }
    for (let i = 0; i < nftCount; i++) {
        calls_nft2.push({
            address: addresses.NFT_MANAGER,
            name: 'userInfo',
            params: [nftData[i][0], address]
        });
    }
    for (let i = 0; i < nftCount; i++) {
        calls_nft2.push({
            address: addresses.NFT_MANAGER,
            name: 'isOwnerOfNFT',
            params: [address, nftData[i][0]]
        });
    }

    const users = await multicall(NftManagerContract, calls_nft2) as Array<any>;

    for (let i = 0; i < nftCount; i++) {
        const myInfo = users[2*nftCount + i];

        totalClaimed += Number(myInfo[2]) / Math.pow(10, 18);
        totalLockedAmount += Number(myInfo[1]) / Math.pow(10, 18);

        if (users[3*nftCount + i][0]) {
            totalSupportValue += Number(nftData[i][1][3]) / Math.pow(10, 18);
        }

        isOwner.push(users[3*nftCount + i][0]);
    }

    const totalAmountForRewards = totalSupportValue + totalLockedAmount;

    const totalRewardsPerDay = totalAmountForRewards * 86400 * Number(rewardPerDay) / 1e11;

    return {
        loading,
        balances: {
            eth: ethBalance,
            usdt: usdtBalance / 10**USDC_DECIMALS,
            cml: ethers.utils.formatUnits(cmlBalance, "ether"),
        },
        ownedNumber: ownedNfts.length,
        availableNumber: addedNfts.length - ownedNfts.length,
        ownedNfts: ownedNfts,
        nft: addedNfts,
        isOwner: isOwner,
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
    ownedNfts: number[];
    nft: number[];
    isOwner: boolean[];
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
