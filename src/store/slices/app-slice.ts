import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { CmlContract, NftManagerContract } from "../../abi";
import { setAll } from "../../helpers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider } from "@ethersproject/providers";
import { BigNumber } from "@ethersproject/bignumber";
import { getMarketPrice, getTokenPrice } from "../../helpers";
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

        const cmlPrice = await getMarketPrice(networkID, provider);
        const cmlTotalSupply = ethers.utils.formatUnits(await cmlContact.totalSupply(), "ether");
        const totalValueLocked = ethers.utils.formatUnits(await nftManagerContract.totalValueLocked(), "ether");
        const cmlBuyFee = await cmlContact.buyFee();
        const cmlSellFee = await cmlContact.sellFee();
        const cmlTransferFee = await cmlContact.transferFee();
        const cmlLimit = ethers.utils.formatUnits(await cmlContact.holdLimit(), "ether");

        const nftTotalSupply = await nftManagerContract.maxSupply();
        const nftMintedSupply = await nftManagerContract.totalSupply();
        const totalNftRewardPerDayFor = ethers.utils.formatUnits(await nftManagerContract.calculateRewardsPerDay(ethers.utils.parseUnits(totalValueLocked, "ether")), "ether");
        const totalNftRewardClaimed = ethers.utils.formatUnits(await nftManagerContract.totalClaimed(), "ether");
        const compoundDelay = await nftManagerContract.compoundDelay();
        const stakeMinValue = ethers.utils.formatUnits(await nftManagerContract.stakeMinValue(), "ether");
        const claimFee = await nftManagerContract.cashoutFee();
        const compoundFee = await nftManagerContract.compoundFee();

        return {
            loading,
            cmlPrice,
            cmlTotalSupply,
            totalValueLocked,
            cmlBuyFee,
            cmlSellFee,
            cmlTransferFee,
            cmlLimit,
            nftTotalSupply,
            nftMintedSupply,
            totalNftRewardPerDayFor,
            totalNftRewardClaimed,
            compoundDelay,
            stakeMinValue,
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
