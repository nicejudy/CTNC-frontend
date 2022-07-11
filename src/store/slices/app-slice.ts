import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { CmlContract, NftManagerContract } from "../../abi";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider } from "@ethersproject/providers";
import { BigNumber } from "@ethersproject/bignumber";
import { getMarketPrice, multicall, setAll } from "../../helpers";
import { RootState } from "../store";

interface ILoadAppDetails {
    networkID: number;
    provider: JsonRpcProvider;
    loading: boolean;
}

let initialState = {
    loading: true,
};

export const loadAppDetails = createAsyncThunk(
    "app/loadAppDetails",
    //@ts-ignore
    async ({ networkID, provider, loading }: ILoadAppDetails) => {

        // initialState.loading = loading;
        const addresses = getAddresses(networkID);

        const cmlContact = new ethers.Contract(addresses.CML_ADDRESS, CmlContract, provider);
        const nftManagerContract = new ethers.Contract(addresses.NFT_MANAGER, NftManagerContract, provider);

        const calls_cml = [
            {
                address: addresses.CML_ADDRESS,
                name: 'totalSupply',
            },
            {
                address: addresses.CML_ADDRESS,
                name: 'buyFee',
            },
            {
                address: addresses.CML_ADDRESS,
                name: 'sellFee',
            },
            {
                address: addresses.CML_ADDRESS,
                name: 'transferFee',
            },
            {
                address: addresses.CML_ADDRESS,
                name: 'holdLimit',
            },
        ]

        const calls_nft = [
            {
                address: addresses.NFT_MANAGER,
                name: 'maxSupply',
            },
            {
                address: addresses.NFT_MANAGER,
                name: 'totalSupply',
            },
            {
                address: addresses.NFT_MANAGER,
                name: 'totalValueLocked',
            },
            {
                address: addresses.NFT_MANAGER,
                name: 'totalClaimed',
            },
            {
                address: addresses.NFT_MANAGER,
                name: 'compoundDelay',
            },
            {
                address: addresses.NFT_MANAGER,
                name: 'stakeMinValue',
            },
            {
                address: addresses.NFT_MANAGER,
                name: 'cashoutFee',
            },
            {
                address: addresses.NFT_MANAGER,
                name: 'compoundFee',
            },
            {
                address: addresses.NFT_MANAGER,
                name: 'rewardPerDay',
            },
        ]

        const cmlPrice = await getMarketPrice(networkID, provider);

        const [[cmlTotalSupply], [cmlBuyFee], [cmlSellFee], [cmlTransferFee], [cmlLimit]] = await multicall(CmlContract, calls_cml);
        const [[nftTotalSupply], [nftMintedSupply], [totalValueLocked], [totalNftRewardClaimed], [compoundDelay], [stakeMinValue], [claimFee], [compoundFee], [rewardPerDay]] = await multicall(NftManagerContract, calls_nft);

        return {
            loading,
            cmlPrice,
            cmlTotalSupply: ethers.utils.formatUnits(cmlTotalSupply, "ether"),
            totalValueLocked: ethers.utils.formatUnits(totalValueLocked, "ether"),
            cmlBuyFee,
            cmlSellFee,
            cmlTransferFee,
            cmlLimit: ethers.utils.formatUnits(cmlLimit, "ether"),
            nftTotalSupply,
            nftMintedSupply,
            totalNftRewardPerDayFor: parseInt(ethers.utils.formatUnits(totalValueLocked, "ether")) * 86400 * Number(rewardPerDay) / 1e11,
            totalNftRewardClaimed: ethers.utils.formatUnits(totalNftRewardClaimed, "ether"),
            compoundDelay,
            stakeMinValue: ethers.utils.formatUnits(stakeMinValue, "ether"),
            claimFee,
            compoundFee,
        };
    },
);

export interface IAppSlice {
    loading: boolean;
    cmlPrice: number;
    cmlTotalSupply: string;
    totalValueLocked: string;
    cmlBuyFee: number;
    cmlSellFee: number;
    cmlTransferFee: number;
    cmlLimit: string;
    nftTotalSupply: number;
    nftMintedSupply: number;
    totalNftRewardPerDayFor: string;
    totalNftRewardClaimed: string;
    compoundDelay: number;
    stakeMinValue: string;
    claimFee: number;
    compoundFee: number;
    networkID: number;
}

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        fetchAppSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadAppDetails.pending, (state, action) => {
                state.loading = state.loading;
            })
            .addCase(loadAppDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadAppDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            });
    },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
