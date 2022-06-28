import { useEffect, useState, useCallback } from "react";
import { Route, Redirect, Switch, BrowserRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAddress, useWeb3Context } from "../hooks";
import Cookies from "universal-cookie";
import { useQueryParam, StringParam } from "use-query-params";
import { loadAppDetails } from "../store/slices/app-slice";
import { loadAccountDetails } from "../store/slices/account-slice";
import { IReduxState } from "../store/slices/state.interface";
import Loading from "../components/Loader";
import ViewBase from "../components/ViewBase";
import { Dashboard, NotFound, Mint, Gallery, Swap, Chart, ToS, Policy, Find } from "../views";
import "./style.scss";

function App() {
    const cookies = new Cookies();

    const [id, setId] = useQueryParam("id", StringParam);

    if (id) {
        cookies.set("id", id);
    }

    const dispatch = useDispatch();

    const { connect, provider, hasCachedProvider, chainID, connected } = useWeb3Context();
    const address = useAddress();

    const [walletChecked, setWalletChecked] = useState(false);

    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const isAppLoaded = useSelector<IReduxState, boolean>(state => !Boolean(state.app.cmlPrice));

    async function loadDetails(whichDetails: string, loading: boolean) {
        let loadProvider = provider;

        if (whichDetails === "app") {
            loadApp(loadProvider, loading);
        }

        if (whichDetails === "account" && address && connected) {
            loadAccount(loadProvider, loading);
            if (isAppLoaded) return;

            loadApp(loadProvider, loading);
        }
    }

    const loadApp = useCallback(
        (loadProvider, loading) => {
            dispatch(loadAppDetails({ networkID: chainID, provider: loadProvider, loading: loading }));
        },
        [connected],
    );

    const loadAccount = useCallback(
        (loadProvider, loading) => {
            dispatch(loadAccountDetails({ networkID: chainID, address, provider: loadProvider, loading: loading }));
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
            loadDetails("app", true);
            loadDetails("account", true);
        }
    }, [walletChecked]);

    useEffect(() => {
        if (connected) {
            loadDetails("app", true);
            loadDetails("account", true);
        }
    }, [connected]);

    useEffect(() => {
        let timer = setInterval(() => {
            loadDetails("app", false);
            loadDetails("account", false);
        }, 10000);
        return () => clearInterval(timer);
    });

    if (isAppLoading) return <Loading />;

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

            <Route exact path="/gallery">
                <ViewBase>
                    <Gallery />
                </ViewBase>
            </Route>

            <Route path="/find">
                <ViewBase>{!id ? <Gallery /> : <Find />}</ViewBase>
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
                <Redirect to="/dashboard" />
            </Route>

            <Route component={NotFound} />
        </Switch>
    );
}

export default App;
