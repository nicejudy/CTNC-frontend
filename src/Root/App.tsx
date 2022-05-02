import { useEffect, useState, useCallback } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAddress, useWeb3Context } from "../hooks";
import { loadAppDetails } from "../store/slices/app-slice";
import { loadAccountDetails } from "../store/slices/account-slice";
import { IReduxState } from "../store/slices/state.interface";
import Loading from "../components/Loader";
import ViewBase from "../components/ViewBase";
import { Dashboard, NotFound, Mint, Landing, Swap, Chart, ToS, Policy } from "../views";
import "./style.scss";

function App() {
    const dispatch = useDispatch();

    const { connect, provider, hasCachedProvider, chainID, connected } = useWeb3Context();
    const address = useAddress();

    const [walletChecked, setWalletChecked] = useState(false);

    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const isAppLoaded = useSelector<IReduxState, boolean>(state => !Boolean(state.app.marketPrice));

    async function loadDetails(whichDetails: string) {
        let loadProvider = provider;

        if (whichDetails === "app") {
            loadApp(loadProvider);
        }

        if (whichDetails === "account" && address && connected) {
            loadAccount(loadProvider);
            if (isAppLoaded) return;

            loadApp(loadProvider);
        }
    }

    const loadApp = useCallback(
        loadProvider => {
            dispatch(loadAppDetails({ networkID: chainID, provider: loadProvider }));
        },
        [connected],
    );

    const loadAccount = useCallback(
        loadProvider => {
            dispatch(loadAccountDetails({ networkID: chainID, address, provider: loadProvider }));
        },
        [connected],
    );

    useEffect(() => {
        if (hasCachedProvider()) {
            connect().then(() => {
                setWalletChecked(true);
            });
        } else {
            setWalletChecked(true);
        }
    }, []);

    useEffect(() => {
        if (walletChecked) {
            loadDetails("app");
            loadDetails("account");
        }
    }, [walletChecked]);

    useEffect(() => {
        if (connected) {
            loadDetails("app");
            loadDetails("account");
        }
    }, [connected]);

    // if (isAppLoading) return <Loading />;

    return (
        <Switch>
            <Route exact path="/dashboard">
                <ViewBase>
                    <Dashboard />
                </ViewBase>
            </Route>

            <Route exact path="/mint">
                <ViewBase>
                    <Mint />
                </ViewBase>
            </Route>

            <Route exact path="/swap">
                <ViewBase>
                    <Swap />
                </ViewBase>
            </Route>

            <Route exact path="/chart">
                <ViewBase>
                    <Chart />
                </ViewBase>
            </Route>

            <Route exact path="/tos">
                <ToS />
            </Route>

            <Route exact path="/privacy-policy">
                <Policy />
            </Route>

            <Route exact path="/">
                {/* <Redirect to="/dashboard" /> */}
                <Landing />
            </Route>

            <Route component={NotFound} />
        </Switch>
    );
}

export default App;
