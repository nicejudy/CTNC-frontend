import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { ApeuContract, ApeuManagerContract } from "../../abi";
import { setAll } from "../../helpers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider } from "@ethersproject/providers";
import { getMarketPrice, getTokenPrice } from "../../helpers";
import { RootState } from "../store";

interface ILoadAppDetails {
    networkID: number;
    provider: JsonRpcProvider;
}

export const loadAppDetails = createAsyncThunk(
    "app/loadAppDetails",
    //@ts-ignore
    async ({ networkID, provider }: ILoadAppDetails) => {
        const addresses = getAddresses(networkID);

        const apeuContract = new ethers.Contract(addresses.ACE_ADDRESS, ApeuContract, provider);
        const apeuManagerContract = new ethers.Contract(addresses.NFT_MANAGER, ApeuManagerContract, provider);

        const marketPrice = await getMarketPrice(networkID, provider);

        const totalSupply = Math.floor((await apeuContract.totalSupply()) / Math.pow(10, 18));

        const totalPlanets = await apeuManagerContract.totalSupply();

        const compoundDelay = await apeuManagerContract.compoundDelay();

        const totalValueLocked = Math.floor((await apeuManagerContract.totalValueLocked()) / Math.pow(10, 18));

        const creationMinPrice = ethers.utils.formatUnits(await apeuManagerContract.createMinValue(), "ether");

        return {
            totalSupply,
            totalPlanets,
            compoundDelay,
            marketPrice,
            totalValueLocked,
            creationMinPrice,
        };
    },
);

const initialState = {
    loading: true,
};

export interface IAppSlice {
    loading: boolean;
    totalSupply: number;
    totalPlanets: number;
    compoundDelay: number;
    marketPrice: number;
    totalValueLocked: number;
    creationMinPrice: string;
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
                state.loading = true;
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
