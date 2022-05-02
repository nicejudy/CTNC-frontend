import { ethers } from "ethers";
import axios from "axios";
import { getAddresses } from "../../constants";
import { ApeuContract, ApeuManagerContract } from "../../abi";
import { setAll } from "../../helpers";

import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../../constants/blockchain";
import { RootState } from "../store";

interface IGetBalances {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IAccountBalances {
    balances: {
        avax: string;
        apeu: string;
    };
}

export const getBalances = createAsyncThunk("account/getBalances", async ({ address, networkID, provider }: IGetBalances): Promise<IAccountBalances> => {
    const addresses = getAddresses(networkID);

    const avaxBalance = await provider.getSigner().getBalance();
    const avaxVal = ethers.utils.formatEther(avaxBalance);

    const apeuContract = new ethers.Contract(addresses.APEU_ADDRESS, ApeuContract, provider);

    // get apeu balance
    const apeuBalance = await apeuContract.balanceOf(address);
    const apeuVal = ethers.utils.formatUnits(apeuBalance, "ether");

    return {
        balances: {
            avax: avaxVal,
            apeu: apeuVal,
        },
    };
});

interface ILoadAccountDetails {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

export interface IPlanetInfoDetails {
    id: number;
    name: string;
    metadata: any;
    creationTime: number;
    lastProcessingTimestamp: number;
    rewardMult: number;
    planetValue: number;
    totalClaimed: number;
    exists: boolean;
    pendingReward: number;
    rewardPerDay: number;
    compoundDelay: number;
    pendingRewardsGross: number;
    rewardPerDayGross: number;
}

export const loadAccountDetails = createAsyncThunk("account/loadAccountDetails", async ({ networkID, provider, address }: ILoadAccountDetails) => {
    const addresses = getAddresses(networkID);

    const cache: { [key: string]: number } = {};

    const avaxBalance = await provider.getSigner().getBalance();
    const avaxVal = ethers.utils.formatEther(avaxBalance);

    const apeuContract = new ethers.Contract(addresses.APEU_ADDRESS, ApeuContract, provider);
    const apeuManagerContract = new ethers.Contract(addresses.APEU_MANAGER_ADDRESS, ApeuManagerContract, provider);
    // const walletObserverContract = new ethers.Contract(addresses.WALLET_OBSERVER_CONTRACT, WalletObserverContract, provider);

    // get apeu balance
    const apeuBalance = await apeuContract.balanceOf(address);
    const apeuVal = ethers.utils.formatUnits(apeuBalance, "ether");

    //get apeu allowance
    const apeuAllowance = await apeuContract.allowance(address, addresses.APEU_MANAGER_ADDRESS);
    const apeuAll = ethers.utils.formatUnits(apeuAllowance, "ether");

    //get planet data
    const planetIds = await apeuManagerContract.getNFTIdsOf(address);
    const planetData = await apeuManagerContract.getNFTsByIds(planetIds);

    const planetCount = planetData.length;

    let planetInfoData = [];
    let estimatedPerDay = 0;
    let totalPendingReward = 0;

    for (let i = 0; i < planetCount; i++) {
        const metadata = await apeuManagerContract.tokenURI(Number(planetData[i][0][0]));
        const url = `https://ipfs.io/ipfs/${metadata.split("//")[1]}`;
        const { data } = await axios.get(url);
        const planet: IPlanetInfoDetails = {
            id: Number(planetData[i][0][0]),
            name: String(planetData[i][0][1]),
            metadata: data,
            creationTime: Number(planetData[i][0][2]),
            lastProcessingTimestamp: Number(planetData[i][0][3]),
            rewardMult: Number(planetData[i][0][4]),
            planetValue: Number(planetData[i][0][5]) / Math.pow(10, 18),
            totalClaimed: Number(planetData[i][0][6]) / Math.pow(10, 18),
            exists: Boolean(planetData[i][0][7]),
            pendingReward: Number(planetData[i][2]) / Math.pow(10, 18),
            rewardPerDay: Number(planetData[i][3]) / Math.pow(10, 18),
            compoundDelay: Number(planetData[i][4]),
            pendingRewardsGross: Number(planetData[i][5]) / Math.pow(10, 18),
            rewardPerDayGross: Number(planetData[i][6]) / Math.pow(10, 18),
        };

        estimatedPerDay += Number(planetData[i][3]);
        totalPendingReward += Number(planetData[i][2]);

        planetInfoData[i] = planet;
    }

    const estimatedPerDayValue = estimatedPerDay / Math.pow(10, 18);
    const totalPendingRewardValue = totalPendingReward / Math.pow(10, 18);

    //get limits data
    // let [, , , remainingTransfersIn, remainingTransferOut, remainingSellOut] = await walletObserverContract.getOverviewOf(address);
    // remainingTransfersIn = ethers.utils.formatUnits(remainingTransfersIn, "ether");
    // remainingTransferOut = ethers.utils.formatUnits(remainingTransferOut, "ether");
    // remainingSellOut = ethers.utils.formatUnits(remainingSellOut, "ether");

    return {
        balances: {
            avax: avaxVal,
            apeu: apeuVal,
            allowance: apeuAll,
        },
        // limits: {
        //     transferIn: remainingTransfersIn,
        //     transferOut: remainingTransferOut,
        //     sellOut: remainingSellOut,
        // },
        planets: planetInfoData,
        number: planetCount,
        estimated: estimatedPerDayValue,
        totalpending: totalPendingRewardValue,
    };
});

const initialState = {
    loading: true,
};

export interface IAccountSlice {
    loading: boolean;
    balances: {
        avax: string;
        apeu: string;
        allowance: string;
    };
    // limits: {
    //     transferIn: string;
    //     transferOut: string;
    //     sellOut: string;
    // };
    planets: IPlanetInfoDetails[];
    number: number;
    estimated: number;
    totalpending: number;
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
                state.loading = true;
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
