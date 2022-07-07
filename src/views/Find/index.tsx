import React, { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { Grid, Zoom, TextField, OutlinedInput } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./find.scss";
import Cookies from "universal-cookie";
import { IReduxState } from "src/store/slices/state.interface";
import { IAppSlice } from "src/store/slices/app-slice";
import { INftInfoDetails } from "src/store/slices/account-slice";
import { loadAccountDetails, loadIdDetails } from "src/store/slices/search-slice";
import ApeCard from "src/components/ApeCard";
import TigerModal from "src/components/TigerModal";
import Gallery from "../Gallery";
import { StaticJsonRpcProvider, JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { getMainnetURI } from "src/hooks/web3/helpers/get-mainnet-uri";
import { DEFAULD_NETWORK } from "src/constants";

function Find() {
    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const app = useSelector<IReduxState, IAppSlice>(state => state.app);

    const [loading, setLoading] = useState<boolean>(false);

    const provider = new StaticJsonRpcProvider(getMainnetURI());
    const chainID = DEFAULD_NETWORK;

    const cookies = new Cookies();

    const id = cookies.get("id");
    cookies.remove("id");

    const [nfts, setNfts] = useState<INftInfoDetails[]>([]);

    const searchID = async (name: string[]) => {
        setLoading(true);
        const data = await loadIdDetails({ networkID: chainID, provider, id: name });
        setNfts(data.nfts);
        setLoading(false);
    };

    if (id != "") {
        if (parseInt(id) > 0 && parseInt(id) <= app.nftMintedSupply * 1) searchID([id]);
    }

    const [open, setOpen] = useState(true);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Gallery/>
            <div className="find-view">
                <div className="find-infos-wrap">
                    <div className="find-infos-nfts">
                        {loading && <div className="find-infos-loading"><CircularProgress color="secondary" size={80} /></div>}
                    </div>
                </div>
            </div>
            {nfts.length > 0 && <TigerModal open={open} handleClose={handleClose} nft={nfts[0]} />}
        </>
    );
}

export default Find;
