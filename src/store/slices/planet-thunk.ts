import { BigNumber, ethers } from "ethers";
import axios from "axios";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { getAddresses, mintPrice } from "../../constants";
import { ApeuManagerContract } from "../../abi";
import { clearPendingTxn, fetchPendingTxns } from "./pending-txns-slice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { loadAccountDetails } from "./account-slice";
import { loadAppDetails } from "./app-slice";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../../constants/blockchain";
import { warning, success, info, error } from "./messages-slice";
import { messages } from "../../constants/messages";
// import { META_IMAGES, META_DESCRIPTION, META_TYPES, META_DONUT } from "../../constants/data";
import { getGasPrice } from "../../helpers/get-gas-price";
import { metamaskErrorWrap } from "../../helpers/metamask-error-wrap";
import { sleep, getNFTLevel } from "../../helpers";

interface ICreatePlanet {
    quantity: string;
    number: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
}

export const createPlanet = createAsyncThunk("mint/createPlanet", async ({ quantity, number, provider, address, networkID }: ICreatePlanet, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const apeuManager = new ethers.Contract(addresses.NFT_MANAGER, ApeuManagerContract, signer);

    let tx;

    try {
        const gasPrice = await getGasPrice(provider);
        console.log(number);
        const etherValue = mintPrice * parseInt(number);

        console.log(etherValue);

        tx = await apeuManager.createNFTWithTokens(number, ethers.utils.parseUnits(quantity, "ether"), {
            value: ethers.utils.parseEther(etherValue.toString()),
            gasPrice: gasPrice,
        });

        dispatch(fetchPendingTxns({ txnHash: tx.hash, text: "Creating Planet", type: "creating" }));
        await tx.wait();
        dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (tx) {
            dispatch(clearPendingTxn(tx.hash));
        }
    }
    await sleep(2);
    dispatch(info({ text: messages.your_data_update_soon }));
    await dispatch(loadAccountDetails({ networkID, provider, address }));
    await dispatch(loadAppDetails({ networkID, provider }));
    dispatch(info({ text: messages.your_data_updated }));
    return;
});

interface IUpgradePlanet {
    id: string;
    quantity: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
}

export const upgradePlanet = createAsyncThunk("mint/upgradePlanet", async ({ id, quantity, provider, address, networkID }: IUpgradePlanet, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const apeuManager = new ethers.Contract(addresses.NFT_MANAGER, ApeuManagerContract, signer);

    let tx;

    try {
        const gasPrice = await getGasPrice(provider);

        tx = await apeuManager.stakeTokensOnNFT(id, ethers.utils.parseUnits(quantity, "ether"), { gasPrice: gasPrice });

        dispatch(fetchPendingTxns({ txnHash: tx.hash, text: "Updating Planet", type: "updating" }));
        await tx.wait();
        dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (tx) {
            dispatch(clearPendingTxn(tx.hash));
        }
    }
    await sleep(2);
    dispatch(info({ text: messages.your_data_update_soon }));
    await dispatch(loadAccountDetails({ networkID, provider, address }));
    await dispatch(loadAppDetails({ networkID, provider }));
    dispatch(info({ text: messages.your_data_updated }));
    return;
});

interface ITransferPlanet {
    tokenId: string;
    to: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
}

export const transferPlanet = createAsyncThunk("mint/transferPlanet", async ({ tokenId, to, provider, address, networkID }: ITransferPlanet, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const apeuManager = new ethers.Contract(addresses.NFT_MANAGER, ApeuManagerContract, signer);

    let tx;

    try {
        const gasPrice = await getGasPrice(provider);

        tx = await apeuManager.transferFrom(address, to, tokenId, { gasPrice });

        dispatch(fetchPendingTxns({ txnHash: tx.hash, text: "Transferring Planet", type: "transferring" }));
        await tx.wait();
        dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (tx) {
            dispatch(clearPendingTxn(tx.hash));
        }
    }
    await sleep(2);
    dispatch(info({ text: messages.your_data_update_soon }));
    await dispatch(loadAccountDetails({ networkID, provider, address }));
    await dispatch(loadAppDetails({ networkID, provider }));
    dispatch(info({ text: messages.your_data_updated }));
    return;
});

interface IBasicInterface {
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
}

export const compoundAll = createAsyncThunk("mint/compoundAll", async ({ provider, address, networkID }: IBasicInterface, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const apeuManager = new ethers.Contract(addresses.NFT_MANAGER, ApeuManagerContract, signer);

    let tx;

    try {
        const gasPrice = await getGasPrice(provider);

        tx = await apeuManager.compoundAll({ gasPrice });

        dispatch(fetchPendingTxns({ txnHash: tx.hash, text: "Compounding All", type: "allcompounding" }));
        await tx.wait();
        dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (tx) {
            dispatch(clearPendingTxn(tx.hash));
        }
    }
    await sleep(2);
    dispatch(info({ text: messages.your_data_update_soon }));
    await dispatch(loadAccountDetails({ networkID, provider, address }));
    await dispatch(loadAppDetails({ networkID, provider }));
    dispatch(info({ text: messages.your_data_updated }));
    return;
});

export const claimAll = createAsyncThunk("mint/claimAll", async ({ provider, address, networkID }: IBasicInterface, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const apeuManager = new ethers.Contract(addresses.NFT_MANAGER, ApeuManagerContract, signer);

    let tx;

    try {
        const gasPrice = await getGasPrice(provider);

        tx = await apeuManager.cashoutAll({ gasPrice });

        dispatch(fetchPendingTxns({ txnHash: tx.hash, text: "Claim All", type: "allclaiming" }));
        await tx.wait();
        dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (tx) {
            dispatch(clearPendingTxn(tx.hash));
        }
    }
    await sleep(2);
    dispatch(info({ text: messages.your_data_update_soon }));
    await dispatch(loadAccountDetails({ networkID, provider, address }));
    await dispatch(loadAppDetails({ networkID, provider }));
    dispatch(info({ text: messages.your_data_updated }));
    return;
});

interface ICompoundPlanet {
    planetId: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
}

export const compoundReward = createAsyncThunk("mint/compoundReward", async ({ planetId, provider, address, networkID }: ICompoundPlanet, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const apeuManager = new ethers.Contract(addresses.NFT_MANAGER, ApeuManagerContract, signer);

    let tx;

    try {
        const gasPrice = await getGasPrice(provider);

        tx = await apeuManager.compoundReward(planetId, { gasPrice });

        dispatch(fetchPendingTxns({ txnHash: tx.hash, text: "Compounding Ape", type: "compounding" }));
        await tx.wait();
        dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (tx) {
            dispatch(clearPendingTxn(tx.hash));
        }
    }
    await sleep(2);
    dispatch(info({ text: messages.your_data_update_soon }));
    await dispatch(loadAccountDetails({ networkID, provider, address }));
    await dispatch(loadAppDetails({ networkID, provider }));
    dispatch(info({ text: messages.your_data_updated }));
    return;
});

export const cashoutReward = createAsyncThunk("mint/cashoutReward", async ({ planetId, provider, address, networkID }: ICompoundPlanet, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const apeuManager = new ethers.Contract(addresses.NFT_MANAGER, ApeuManagerContract, signer);

    let tx;

    try {
        const gasPrice = await getGasPrice(provider);

        tx = await apeuManager.cashoutReward(planetId, { gasPrice });

        dispatch(fetchPendingTxns({ txnHash: tx.hash, text: "Claiming Ape", type: "claiming" }));
        await tx.wait();
        dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (tx) {
            dispatch(clearPendingTxn(tx.hash));
        }
    }
    await sleep(2);
    dispatch(info({ text: messages.your_data_update_soon }));
    await dispatch(loadAccountDetails({ networkID, provider, address }));
    await dispatch(loadAppDetails({ networkID, provider }));
    dispatch(info({ text: messages.your_data_updated }));
    return;
});
