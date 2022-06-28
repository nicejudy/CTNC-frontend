import React, { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import { useSelector } from "react-redux";
import { Grid, Zoom, TextField, OutlinedInput } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { trim } from "src/helpers";
import { useQueryParam, StringParam } from "use-query-params";
import "./gallery.scss";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "src/store/slices/state.interface";
import { IAppSlice } from "src/store/slices/app-slice";
import { INftInfoDetails } from "src/store/slices/account-slice";
import { loadAccountDetails, loadIdDetails } from "src/store/slices/search-slice";
import ApeCard from "src/components/ApeCard";
import { isUint8ClampedArray } from "util/types";
import { StaticJsonRpcProvider, JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { getMainnetURI } from "src/hooks/web3/helpers/get-mainnet-uri";
import { DEFAULD_NETWORK } from "src/constants";

function Gallery() {
    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const app = useSelector<IReduxState, IAppSlice>(state => state.app);

    const provider = new StaticJsonRpcProvider(getMainnetURI());
    const chainID = DEFAULD_NETWORK;

    const [name, setName] = useState<string[]>([]);
    const [query, setQuery] = useState<string>("");

    const [nfts, setNfts] = useState<INftInfoDetails[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    const handleKey = (e: any) => {
        if (e.keyCode == 13) {
            if (ethers.utils.isAddress(name[0])) searchAddress(name[0]);
            else if (parseInt(name[0]) > 0 && parseInt(name[0]) <= app.nftMintedSupply * 1) searchID(name);
            else if (isNameArray(name[0])) return;
            else setNfts([]);
            setQuery(name[0]);
            setName([]);
        }
    };

    const searchAddress = async (name: string) => {
        setLoading(true);
        const data = await loadAccountDetails({ networkID: chainID, provider, address: name });
        setNfts(data.nfts);
        setLoading(false);
    };

    const searchID = async (name: string[]) => {
        setLoading(true);
        for (let i = 0; i < name.length; i++) {
            if (parseInt(name[i]) > app.nftMintedSupply) {
                return;
            }
        }
        const data = await loadIdDetails({ networkID: chainID, provider, id: name });
        setNfts(data.nfts);
        setLoading(false);
    };

    const isNameArray = (name: string) => {
        if (!name) return false;
        if (!name.startsWith("[")) return false;
        if (!name.endsWith("]")) return false;
        let content = name.substring(1, name.length - 1);
        content = content.replace(" ", "");
        const ids = content.split(",");
        for (let index = 0; index < ids.length; index++) {
            const id = ids[index];
            if (parseInt(id) <= 0 || parseInt(id) > app.nftMintedSupply * 1) return false;
        }
        searchID(ids);
        setQuery(name);
        setName([]);
        console.log(query)
        return true;
    };

    return (
        <div className="gallery-view">
            <div className="gallery-infos-wrap">
                <OutlinedInput
                    type="text"
                    placeholder="Search by address / id / [id1, id2, ...]"
                    className="gallery-search-box"
                    value={name}
                    onChange={e => setName([e.target.value])}
                    onKeyDown={handleKey}
                    labelWidth={0}
                />
                <div className="gallery-infos-nfts">
                    {loading && <div className="gallery-infos-loading"><CircularProgress color="secondary" size={80} /></div>}
                    {!loading && <Grid container spacing={4}>
                        {nfts.length == 0 ? (
                            <></>
                        ) : (
                            nfts.map(nft => (
                                <Grid key={nft.id} item xl={3} lg={4} md={6} sm={6} xs={12}>
                                    <ApeCard nft={nft} compoundDelay={app.compoundDelay * 1} filter="search" />
                                </Grid>
                            ))
                        )}
                    </Grid>}
                </div>
            </div>
        </div>
    );
}

export default Gallery;
