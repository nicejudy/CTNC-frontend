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
        // const mimPrice = getTokenPrice("MIM");
        const addresses = getAddresses(networkID);

        const apeuContract = new ethers.Contract(addresses.APEU_ADDRESS, ApeuContract, provider);
        const apeuManagerContract = new ethers.Contract(addresses.APEU_MANAGER_ADDRESS, ApeuManagerContract, provider);

        const marketPrice = await getMarketPrice(networkID, provider);

        const totalSupply = Math.floor((await apeuContract.totalSupply()) / Math.pow(10, 18));

        const totalPlanets = await apeuManagerContract.totalSupply();

        const totalValueLocked = Math.floor((await apeuManagerContract.totalValueLocked()) / Math.pow(10, 18));

        // const burnedFromRenaming =
        //     Math.floor((await apeuManagerContract.burnedFromRenaming()) / Math.pow(10, 18)) + Math.floor((await apeuManagerContract.burnedFromMerging()) / Math.pow(10, 18));

        const burnedFromRenaming = Math.floor((await apeuManagerContract.burnedFromRenaming()) / Math.pow(10, 18));

        // const calculateTotalDailyEmission = Math.floor((await apeuManagerContract.calculateTotalDailyEmission()) / Math.pow(10, 18));

        const creationMinPrice = ethers.utils.formatUnits(await apeuManagerContract.createMinValue(), "ether");

        console.log("point");

        return {
            // mimPrice,
            totalSupply,
            totalPlanets,
            marketPrice,
            totalValueLocked,
            burnedFromRenaming,
            // calculateTotalDailyEmission,
            creationMinPrice,
        };
    },
);

const initialState = {
    loading: true,
};

export interface IAppSlice {
    loading: boolean;
    // mimPrice: number;
    totalSupply: number;
    totalPlanets: number;
    marketPrice: number;
    totalValueLocked: number;
    burnedFromRenaming: number;
    // calculateTotalDailyEmission: number;
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
