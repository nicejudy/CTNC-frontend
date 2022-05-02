import { BigNumber, ethers } from "ethers";
import axios from "axios";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { getAddresses, mintPrice } from "../../constants";
import { ApeuManagerContract } from "../../abi";
import { clearPendingTxn, fetchPendingTxns } from "./pending-txns-slice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { loadAccountDetails } from "./account-slice";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../../constants/blockchain";
import { warning, success, info, error } from "./messages-slice";
import { messages } from "../../constants/messages";
import { META_IMAGES, META_DESCRIPTION, META_TYPES, META_DONUT } from "../../constants/data";
import { getGasPrice } from "../../helpers/get-gas-price";
import { metamaskErrorWrap } from "../../helpers/metamask-error-wrap";
import { sleep, getNFTLevel } from "../../helpers";

interface ICreatePlanet {
    name: string;
    quantity: string;
    type: string;
    level: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
}

export const createPlanet = createAsyncThunk("mint/createPlanet", async ({ name, quantity, type, level, provider, address, networkID }: ICreatePlanet, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const apeuManager = new ethers.Contract(addresses.APEU_MANAGER_ADDRESS, ApeuManagerContract, signer);

    let tx;

    try {
        // const res = await axios.post("/api/v0");

        const client = ipfsHttpClient({
            host: "ipfs.infura.io",
            port: 5001,
            protocol: "https",
            apiPath: "api/v0",
            // headers: {
            //     authorization: res.data.auth,
            // },
        });

        const metadataString = JSON.stringify({
            name: type + ": " + name,
            attributes: [
                {
                    trait_type: "Name",
                    value: name,
                },
                {
                    trait_type: "Level",
                    value: type,
                },
                {
                    trait_type: "Wood",
                    value: META_DONUT[parseInt(level)],
                },
            ],
            image: `ipfs://${META_IMAGES[parseInt(level)]}`,
            description: META_DESCRIPTION[parseInt(level)],
        });

        const added = await client.add(metadataString);
        const metadataUrl = `ipfs://${added.path}`;

        const gasPrice = await getGasPrice(provider);

        tx = await apeuManager.createNFTWithTokens(name, ethers.utils.parseUnits(quantity, "ether"), metadataUrl, {
            value: ethers.utils.parseEther(mintPrice),
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
    const apeuManager = new ethers.Contract(addresses.APEU_MANAGER_ADDRESS, ApeuManagerContract, signer);

    let tx;

    try {
        const planetData = await apeuManager.getNFTsByIds([id]);
        const name = String(planetData[0][0][1]);
        const planetValue = Math.floor(Number(planetData[0][0][5]) / Math.pow(10, 18) + parseInt(quantity));
        const level = getNFTLevel(planetValue);

        // const res = await axios.post("/api/v0");

        const client = ipfsHttpClient({
            host: "ipfs.infura.io",
            port: 5001,
            protocol: "https",
            apiPath: "api/v0",
            // headers: {
            //     authorization: res.data.auth,
            // },
        });

        const metadataString = JSON.stringify({
            name: META_TYPES[level] + ": " + name,
            attributes: [
                {
                    trait_type: "Name",
                    value: name,
                },
                {
                    trait_type: "Level",
                    value: META_TYPES[level],
                },
                {
                    trait_type: "Wood",
                    value: new Intl.NumberFormat("en-US").format(planetValue),
                },
            ],
            image: `ipfs://${META_IMAGES[level]}`,
            description: META_DESCRIPTION[level],
        });

        const added = await client.add(metadataString);
        const metadataUrl = `ipfs://${added.path}`;

        const gasPrice = await getGasPrice(provider);

        tx = await apeuManager.stakeTokensOnNFT(id, ethers.utils.parseUnits(quantity, "ether"), metadataUrl, { gasPrice: gasPrice });

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
    dispatch(info({ text: messages.your_data_updated }));
    return;
});

interface IRenamePlanet {
    id: string;
    name: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
}

export const renamePlanet = createAsyncThunk("mint/renamePlanet", async ({ id, name, provider, address, networkID }: IRenamePlanet, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const apeuManager = new ethers.Contract(addresses.APEU_MANAGER_ADDRESS, ApeuManagerContract, signer);

    let tx;

    try {
        const planetData = await apeuManager.getNFTsByIds([id]);
        const planetValue = Math.floor((Number(planetData[0][0][5]) * 95) / Math.pow(10, 20));
        const level = getNFTLevel(planetValue);

        // const res = await axios.post("/api/v0");

        const client = ipfsHttpClient({
            host: "ipfs.infura.io",
            port: 5001,
            protocol: "https",
            apiPath: "api/v0",
            // headers: {
            //     authorization: res.data.auth,
            // },
        });

        const metadataString = JSON.stringify({
            name: META_TYPES[level] + ": " + name,
            attributes: [
                {
                    trait_type: "Name",
                    value: name,
                },
                {
                    trait_type: "Level",
                    value: META_TYPES[level],
                },
                {
                    trait_type: "Wood",
                    value: new Intl.NumberFormat("en-US").format(planetValue),
                },
            ],
            image: `ipfs://${META_IMAGES[level]}`,
            description: META_DESCRIPTION[level],
        });

        const added = await client.add(metadataString);
        const metadataUrl = `ipfs://${added.path}`;

        const gasPrice = await getGasPrice(provider);

        tx = await apeuManager.renameNFT(id, name, metadataUrl, { gasPrice });

        dispatch(fetchPendingTxns({ txnHash: tx.hash, text: "Renaming Planet", type: "renaming" }));
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
    dispatch(info({ text: messages.your_data_updated }));
    return;
});

interface IMergePlanets {
    firstId: string;
    secondId: string;
    name: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
}

export const mergePlanets = createAsyncThunk("mint/mergePlanets", async ({ firstId, secondId, name, provider, address, networkID }: IMergePlanets, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const apeuManager = new ethers.Contract(addresses.APEU_MANAGER_ADDRESS, ApeuManagerContract, signer);

    let tx;

    try {
        const gasPrice = await getGasPrice(provider);

        tx = await apeuManager.mergePlanets([firstId, secondId], name, { gasPrice });

        dispatch(fetchPendingTxns({ txnHash: tx.hash, text: "Merging Planet", type: "merging" }));
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
    const apeuManager = new ethers.Contract(addresses.APEU_MANAGER_ADDRESS, ApeuManagerContract, signer);

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
    const apeuManager = new ethers.Contract(addresses.APEU_MANAGER_ADDRESS, ApeuManagerContract, signer);

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
    const apeuManager = new ethers.Contract(addresses.APEU_MANAGER_ADDRESS, ApeuManagerContract, signer);

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
    const apeuManager = new ethers.Contract(addresses.APEU_MANAGER_ADDRESS, ApeuManagerContract, signer);

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
    const apeuManager = new ethers.Contract(addresses.APEU_MANAGER_ADDRESS, ApeuManagerContract, signer);

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
    dispatch(info({ text: messages.your_data_updated }));
    return;
});
