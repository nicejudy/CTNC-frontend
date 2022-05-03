import { useSelector } from "react-redux";
import { Grid, Zoom } from "@material-ui/core";
import { trim } from "../../helpers";
import "./dashboard.scss";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { IAppSlice } from "../../store/slices/app-slice";
import { IAccountSlice } from "../../store/slices/account-slice";

function Dashboard() {
    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const app = useSelector<IReduxState, IAppSlice>(state => state.app);

    const isAccountLoading = useSelector<IReduxState, boolean>(state => state.account.loading);
    const account = useSelector<IReduxState, IAccountSlice>(state => state.account);

    const myBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.apeu;
    });

    return (
        <div className="dashboard-view">
            <div className="dashboard-infos-wrap">
                <Zoom in={true}>
                    <Grid container spacing={4}>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <p className="card-title">WOOD Price</p>
                                <p className="card-value">{isAppLoading ? <Skeleton width="100px" /> : `$${trim(app.marketPrice, 3)}`}</p>
                                {/* <p className="card-title">${isAppLoading ? <Skeleton width="100px" /> : `${trim(app.marketPrice * app.mimPrice, 2)}`}</p> */}
                            </div>
                        </Grid>

                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <p className="card-title">TVL</p>
                                <p className="card-value">{isAppLoading ? <Skeleton width="100px" /> : `${new Intl.NumberFormat("en-US").format(app.totalValueLocked)} WOOD`}</p>
                                {/* <p className="card-title">
                                    {isAppLoading ? (
                                        <Skeleton width="100px" />
                                    ) : (
                                        `$${new Intl.NumberFormat("en-US").format(Math.floor((app.totalValueLocked * app.mimPrice * app.marketPrice) / 10000))}`
                                    )}
                                </p> */}
                            </div>
                        </Grid>

                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <p className="card-title">Total Supply</p>
                                <p className="card-value">{isAppLoading ? <Skeleton width="250px" /> : `${new Intl.NumberFormat("en-US").format(app.totalSupply)} WOOD`}</p>
                                {/* <p className="card-title">
                                    {isAppLoading ? (
                                        <Skeleton width="100px" />
                                    ) : (
                                        `$${new Intl.NumberFormat("en-US").format(Math.floor((app.totalSupply * app.mimPrice * app.marketPrice) / 10000))}`
                                    )}
                                </p> */}
                            </div>
                        </Grid>

                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <p className="card-title">Total NFTs</p>
                                <p className="card-value">{isAppLoading ? <Skeleton width="100px" /> : `${new Intl.NumberFormat("en-US").format(app.totalPlanets)}`}</p>
                            </div>
                        </Grid>

                        {/* <Grid item lg={4} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <p className="card-title">Total Reward Per Day</p>
                                <p className="card-value">
                                    {isAppLoading ? <Skeleton width="250px" /> : `${new Intl.NumberFormat("en-US").format(app.calculateTotalDailyEmission)} WOOD`}
                                </p>
                            </div>
                        </Grid> */}

                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <p className="card-title">My NFTs</p>
                                <p className="card-value">{isAccountLoading ? <Skeleton width="100px" /> : `${new Intl.NumberFormat("en-US").format(account.number)}`}</p>
                            </div>
                        </Grid>

                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <p className="card-title">My Reward Per Day</p>
                                <p className="card-value">
                                    {isAccountLoading ? <Skeleton width="100px" /> : `${new Intl.NumberFormat("en-US").format(Math.floor(account.estimated))} WOOD`}
                                </p>
                                {/* <p className="card-title">
                                    {isAppLoading ? (
                                        <Skeleton width="100px" />
                                    ) : (
                                        `$${new Intl.NumberFormat("en-US").format((account.estimated * app.mimPrice * app.marketPrice) / 10000)}`
                                    )}
                                </p> */}
                            </div>
                        </Grid>

                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <p className="card-title">My Pending Reward</p>
                                <p className="card-value">
                                    {isAccountLoading ? <Skeleton width="250px" /> : `${new Intl.NumberFormat("en-US").format(Math.floor(account.totalpending))} WOOD`}
                                </p>
                                {/* <p className="card-title">
                                    {isAppLoading ? (
                                        <Skeleton width="100px" />
                                    ) : (
                                        `$${new Intl.NumberFormat("en-US").format((account.totalpending * app.mimPrice * app.marketPrice) / 10000)}`
                                    )}
                                </p> */}
                            </div>
                        </Grid>

                        {/* <Grid item lg={4} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <p className="card-title">Incoming Transfers & Buys Remaining</p>
                                <p className="card-value">
                                    {isAccountLoading ? <Skeleton width="100px" /> : `${new Intl.NumberFormat("en-US").format(parseInt(limitTransferIn))} APEU`}
                                </p>
                            </div>
                        </Grid>

                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <p className="card-title">Sells Remaining</p>
                                <p className="card-value">
                                    {isAccountLoading ? <Skeleton width="100px" /> : `${new Intl.NumberFormat("en-US").format(parseInt(limitSellOut))} APEU`}
                                </p>
                            </div>
                        </Grid>

                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <p className="card-title">Outgoing Transfers Remaining</p>
                                <p className="card-value">
                                    {isAccountLoading ? <Skeleton width="250px" /> : `${new Intl.NumberFormat("en-US").format(parseInt(limitTransferOut))} APEU`}
                                </p>
                            </div>
                        </Grid> */}
                    </Grid>
                </Zoom>
            </div>
        </div>
    );
}

export default Dashboard;
