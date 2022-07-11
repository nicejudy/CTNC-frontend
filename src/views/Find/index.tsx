import React, { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useQueryParam, StringParam } from "use-query-params";
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
import { DEFAULD_NETWORK, RPC_URL } from "src/constants";

function Find() {
    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const app = useSelector<IReduxState, IAppSlice>(state => state.app);

    const [loading, setLoading] = useState<boolean>(false);

    const provider = new StaticJsonRpcProvider(RPC_URL);
    const chainID = DEFAULD_NETWORK;

    const [id, setId] = useQueryParam("id", StringParam);

    const cookies = new Cookies();

    if (id) {
        cookies.set("id", id);
    }

    // const id = cookies.get("id");
    // cookies.remove("id");

    const [nfts, setNfts] = useState<INftInfoDetails[]>([]);

    // const searchID = async (name: string[]) => {
    //     setLoading(true);
    //     const data = await loadIdDetails({ networkID: chainID, id: name });
    //     setNfts(data.nfts);
    //     setLoading(false);
    // };

    const isId = () => {
        return cookies.get("id") != "" && parseInt(cookies.get("id")) > 0 && parseInt(cookies.get("id")) <= app.nftMintedSupply * 1;
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
            {isId() && <TigerModal open={open} handleClose={handleClose} nftId={cookies.get("id")} />}
        </>
    );
}

export default Find;
