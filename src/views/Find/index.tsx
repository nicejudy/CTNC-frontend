import React, { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { Grid, Zoom, TextField, OutlinedInput } from "@material-ui/core";
import "./find.scss";
import Cookies from "universal-cookie";
import { IReduxState } from "src/store/slices/state.interface";
import { IAppSlice } from "src/store/slices/app-slice";
import { IPlanetInfoDetails } from "src/store/slices/account-slice";
import { loadAccountDetails, loadIdDetails } from "src/store/slices/search-slice";
import ApeCard from "src/components/ApeCard";
import { StaticJsonRpcProvider, JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { getMainnetURI } from "src/hooks/web3/helpers/get-mainnet-uri";
import { DEFAULD_NETWORK } from "src/constants";

function Find() {
    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const app = useSelector<IReduxState, IAppSlice>(state => state.app);

    const provider = new StaticJsonRpcProvider(getMainnetURI());
    const chainID = DEFAULD_NETWORK;

    const cookies = new Cookies();

    const id = cookies.get("id");
    cookies.remove("id");

    const [planets, setPlanets] = useState<IPlanetInfoDetails[]>([]);

    const searchID = async (name: string[]) => {
        const data = await loadIdDetails({ networkID: chainID, provider, id: name });
        setPlanets(data.planets);
    };

    if (id != "") {
        if (parseInt(id) > 0 && parseInt(id) <= app.totalPlanets * 1) searchID([id]);
    }

    return (
        <div className="find-view">
            <div className="find-infos-wrap">
                <div className="find-infos-planets">
                    <Grid container spacing={4}>
                        {planets.length == 0 ? (
                            <></>
                        ) : (
                            planets.map(planet => (
                                <Grid key={planet.id} item xl={3} lg={4} md={6} sm={6} xs={12}>
                                    <ApeCard planet={planet} compoundDelay={app.compoundDelay * 1} filter="search" />
                                </Grid>
                            ))
                        )}
                    </Grid>
                </div>
            </div>
        </div>
    );
}

export default Find;
