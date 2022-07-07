import { BigNumber, ethers } from "ethers";
import axios from "axios";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { getAddresses } from "../../constants";
import { NftManagerContract } from "../../abi";
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

interface ICreateNft {
    number: number;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
    handleClose: () => void;
}

export const createNft = createAsyncThunk("mint/createNft", async ({ number, provider, address, networkID, handleClose }: ICreateNft, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const nftManager = new ethers.Contract(addresses.NFT_MANAGER, NftManagerContract, signer);

    let tx;

    try {
        const gasPrice = await getGasPrice(provider);
        const mintPrice = Number(await nftManager.mintPrice()) / Math.pow(10, 18);
        const etherValue = mintPrice * number;

        tx = await nftManager.createNFT(number, {
            value: ethers.utils.parseEther(etherValue.toFixed(3)),
            gasPrice: gasPrice,
        });

        dispatch(fetchPendingTxns({ txnHash: tx.hash, text: "Creating NFT", type: "creating" }));
        await tx.wait();
        handleClose();
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
    await dispatch(loadAccountDetails({ networkID, provider, address, loading: false }));
    await dispatch(loadAppDetails({ networkID, provider, loading: false }));
    dispatch(info({ text: messages.your_data_updated }));
    return;
});

interface IUpgradeNft {
    id: string;
    quantity: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
    handleClose: () => void;
}

export const upgradeNft = createAsyncThunk("mint/upgradeNft", async ({ id, quantity, provider, address, networkID, handleClose }: IUpgradeNft, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const apeuManager = new ethers.Contract(addresses.NFT_MANAGER, NftManagerContract, signer);

    let tx;

    try {
        const gasPrice = await getGasPrice(provider);

        tx = await apeuManager.stakeTokens(id, ethers.utils.parseUnits(quantity, "ether"), { gasPrice: gasPrice });

        dispatch(fetchPendingTxns({ txnHash: tx.hash, text: "Staking NFT", type: "staking" }));
        await tx.wait();
        handleClose();
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
    await dispatch(loadAccountDetails({ networkID, provider, address, loading: false }));
    await dispatch(loadAppDetails({ networkID, provider, loading: false }));
    dispatch(info({ text: messages.your_data_updated }));
    return;
});

interface ITransferNft {
    tokenId: string;
    to: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
    handleClose: () => void;
}

export const transferNft = createAsyncThunk("mint/transferNft", async ({ tokenId, to, provider, address, networkID, handleClose }: ITransferNft, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const apeuManager = new ethers.Contract(addresses.NFT_MANAGER, NftManagerContract, signer);

    let tx;

    try {
        const gasPrice = await getGasPrice(provider);

        tx = await apeuManager.transferFrom(address, to, tokenId, { gasPrice });

        dispatch(fetchPendingTxns({ txnHash: tx.hash, text: "Transferring NFT", type: "transferring" }));
        await tx.wait();
        handleClose();
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
    await dispatch(loadAccountDetails({ networkID, provider, address, loading: false }));
    await dispatch(loadAppDetails({ networkID, provider, loading: false }));
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
    const apeuManager = new ethers.Contract(addresses.NFT_MANAGER, NftManagerContract, signer);

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
    await dispatch(loadAccountDetails({ networkID, provider, address, loading: false }));
    await dispatch(loadAppDetails({ networkID, provider, loading: false }));
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
    const apeuManager = new ethers.Contract(addresses.NFT_MANAGER, NftManagerContract, signer);

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
    await dispatch(loadAccountDetails({ networkID, provider, address, loading: false }));
    await dispatch(loadAppDetails({ networkID, provider, loading: false }));
    dispatch(info({ text: messages.your_data_updated }));
    return;
});

interface ICompoundNft {
    nftId: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
}

export const compoundReward = createAsyncThunk("mint/compoundReward", async ({ nftId, provider, address, networkID }: ICompoundNft, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const apeuManager = new ethers.Contract(addresses.NFT_MANAGER, NftManagerContract, signer);

    let tx;

    try {
        const gasPrice = await getGasPrice(provider);

        tx = await apeuManager.compoundReward(nftId, { gasPrice });

        dispatch(fetchPendingTxns({ txnHash: tx.hash, text: "Compounding NFT", type: "compounding" }));
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
    await dispatch(loadAccountDetails({ networkID, provider, address, loading: false }));
    await dispatch(loadAppDetails({ networkID, provider, loading: false }));
    dispatch(info({ text: messages.your_data_updated }));
    return;
});

interface ICashoutNft {
    nftId: string;
    swapping: number;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
}

export const cashoutReward = createAsyncThunk("mint/cashoutReward", async ({ nftId, swapping, provider, address, networkID }: ICashoutNft, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const apeuManager = new ethers.Contract(addresses.NFT_MANAGER, NftManagerContract, signer);

    let tx;

    try {
        const gasPrice = await getGasPrice(provider);

        if (swapping == 0) {
            tx = await apeuManager.cashoutReward(nftId, false, { gasPrice });
        } else if (swapping == 1) {
            tx = await apeuManager.cashoutReward(nftId, true, { gasPrice });
        } else if (swapping == 2) {
            tx = await apeuManager.cashoutRewardFromGift(nftId, false, { gasPrice });
        } else if (swapping == 3) {
            tx = await apeuManager.cashoutRewardFromGift(nftId, true, { gasPrice });
        } else {
            return;
        }

        dispatch(fetchPendingTxns({ txnHash: tx.hash, text: "Claiming NFT", type: "claiming" }));
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
    await dispatch(loadAccountDetails({ networkID, provider, address, loading: false }));
    await dispatch(loadAppDetails({ networkID, provider, loading: false }));
    dispatch(info({ text: messages.your_data_updated }));
    return;
});
