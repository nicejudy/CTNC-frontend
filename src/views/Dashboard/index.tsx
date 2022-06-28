import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Grid, Zoom, Popper, Fade } from "@material-ui/core";
import { trim } from "../../helpers";
import "./dashboard.scss";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { IAppSlice } from "../../store/slices/app-slice";
import { IAccountSlice } from "../../store/slices/account-slice";
import InfoImg from "src/assets/icons/info.png";

function Dashboard() {
    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const app = useSelector<IReduxState, IAppSlice>(state => state.app);

    const isAccountLoading = useSelector<IReduxState, boolean>(state => state.account.loading);
    const account = useSelector<IReduxState, IAccountSlice>(state => state.account);

    const myBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.cml;
    });

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event: any) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);

    return (
        <div className="dashboard-view">
            <div className="dashboard-infos-wrap">
                <Zoom in={true}>
                    <Grid container spacing={4}>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <div className="card-title">
                                    <p>$CML - Price&nbsp;</p>
                                    {/* <div className="card-title-info">
                                        <img src={InfoImg} width="16px" />
                                        <div className="card-title-tooltip">Tooltip textTooltip textTooltip textTooltip textTooltip textTooltip textTooltip textTooltip textTooltip textTooltip text</div>
                                    </div> */}
                                </div>
                                <p className="card-value">{isAppLoading ? <Skeleton width="100px" /> : `$${trim(app.cmlPrice, 5)}`}</p>
                            </div>
                        </Grid>

                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <div className="card-title">
                                    <p>$CML - Total Supply&nbsp;</p>
                                    {/* <div className="card-title-info">
                                        <img src={InfoImg} width="16px" />
                                        <span className="card-title-tooltip">Tooltip text</span>
                                    </div> */}
                                </div>
                                <p className="card-value">
                                    {isAppLoading ? <Skeleton width="100px" /> : `${new Intl.NumberFormat("en-US").format(parseInt(app.cmlTotalSupply))} $CML`}
                                </p>
                                <p className="card-usd-value">
                                    {isAppLoading ? <Skeleton width="100px" /> : `$${new Intl.NumberFormat("en-US").format(Math.floor(parseInt(app.cmlTotalSupply))*app.cmlPrice)}`}
                                </p>
                            </div>
                        </Grid>

                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <div className="card-title">
                                    <p>$CML - Buy Fee&nbsp;</p>
                                    {/* <div className="card-title-info">
                                        <img src={InfoImg} width="16px" />
                                        <span className="card-title-tooltip">Tooltip text</span>
                                    </div> */}
                                </div>
                                <p className="card-value">{isAppLoading ? <Skeleton width="100px" /> : `${new Intl.NumberFormat("en-US").format(app.cmlBuyFee)} %`}</p>
                            </div>
                        </Grid>

                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <div className="card-title">
                                    <p>$CML - Sell Fee&nbsp;</p>
                                    {/* <div className="card-title-info">
                                        <img src={InfoImg} width="16px" />
                                        <span className="card-title-tooltip">Tooltip text</span>
                                    </div> */}
                                </div>
                                <p className="card-value">
                                    {isAppLoading ? <Skeleton width="100px" /> : `${new Intl.NumberFormat("en-US").format(Math.floor(app.cmlSellFee))} %`}
                                </p>
                            </div>
                        </Grid>

                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <div className="card-title">
                                    <p>$CML - Transfer Fee&nbsp;</p>
                                    {/* <div className="card-title-info">
                                        <img src={InfoImg} width="16px" />
                                        <span className="card-title-tooltip">Tooltip text</span>
                                    </div> */}
                                </div>
                                <p className="card-value">
                                    {isAppLoading ? <Skeleton width="250px" /> : `${new Intl.NumberFormat("en-US").format(Math.floor(app.cmlTransferFee))} %`}
                                </p>
                            </div>
                        </Grid>

                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <div className="card-title">
                                    <p>$CML - Wallet Limit&nbsp;</p>
                                    {/* <div className="card-title-info">
                                        <img src={InfoImg} width="16px" />
                                        <span className="card-title-tooltip">Tooltip text</span>
                                    </div> */}
                                </div>
                                <p className="card-value">
                                    {isAppLoading ? <Skeleton width="250px" /> : `${new Intl.NumberFormat("en-US").format(Math.floor(parseInt(app.cmlLimit)))} $CML`}
                                </p>
                                <p className="card-usd-value">{isAppLoading ? <Skeleton width="250px" /> : `$${new Intl.NumberFormat("en-US").format(Math.floor(parseInt(app.cmlLimit))*app.cmlPrice)}`}</p>
                            </div>
                        </Grid>

                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <div className="card-title">
                                    <p>CTNC - Minted/Total Supply&nbsp;</p>
                                    {/* <div className="card-title-info">
                                        <img src={InfoImg} width="16px" />
                                        <span className="card-title-tooltip">Tooltip text</span>
                                    </div> */}
                                </div>
                                <p className="card-value">
                                    {isAppLoading ? <Skeleton width="250px" /> : `${new Intl.NumberFormat("en-US").format(Math.floor(app.nftMintedSupply))} / ${new Intl.NumberFormat("en-US").format(Math.floor(app.nftTotalSupply))}`}
                                </p>
                            </div>
                        </Grid>

                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <div className="card-title">
                                    <p>CTNC - Daily Reward Rate&nbsp;</p>
                                    {/* <div className="card-title-info">
                                        <img src={InfoImg} width="16px" />
                                        <span className="card-title-tooltip">Tooltip text</span>
                                    </div> */}
                                </div>
                                <p className="card-value">
                                    {isAppLoading ? <Skeleton width="250px" /> : `3 %`}
                                </p>
                            </div>
                        </Grid>

                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <div className="card-title">
                                    <p>CTNC - Total Reward Per Day&nbsp;</p>
                                    {/* <div className="card-title-info">
                                        <img src={InfoImg} width="16px" />
                                        <span className="card-title-tooltip">Tooltip text</span>
                                    </div> */}
                                </div>
                                <p className="card-value">
                                    {isAppLoading ? <Skeleton width="250px" /> : `${new Intl.NumberFormat("en-US").format(Math.floor(parseInt(app.totalNftRewardPerDayFor)))} $CML`}
                                </p>
                                <p className="card-usd-value">
                                    {isAppLoading ? <Skeleton width="250px" /> : `$${new Intl.NumberFormat("en-US").format(Math.floor(parseInt(app.totalNftRewardPerDayFor))*app.cmlPrice)}`}
                                </p>
                            </div>
                        </Grid>

                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <div className="card-title">
                                    <p>CTNC - Total Value Staked&nbsp;</p>
                                    {/* <div className="card-title-info">
                                        <img src={InfoImg} width="16px" />
                                        <span className="card-title-tooltip">Tooltip text</span>
                                    </div> */}
                                </div>
                                <p className="card-value">
                                    {isAppLoading ? <Skeleton width="250px" /> : `${new Intl.NumberFormat("en-US").format(Math.floor(parseInt(app.totalValueLocked)))} $CML`}
                                </p>
                                <p className="card-usd-value">
                                    {isAppLoading ? <Skeleton width="250px" /> : `$${new Intl.NumberFormat("en-US").format(Math.floor(parseInt(app.totalValueLocked))*app.cmlPrice)}`}
                                </p>
                            </div>
                        </Grid>

                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <div className="card-title">
                                    <p>CTNC - Total Value Claimed&nbsp;</p>
                                    {/* <div className="card-title-info">
                                        <img src={InfoImg} width="16px" />
                                        <span className="card-title-tooltip">Tooltip text</span>
                                    </div> */}
                                </div>
                                <p className="card-value">
                                    {isAppLoading ? <Skeleton width="250px" /> : `${new Intl.NumberFormat("en-US").format(Math.floor(parseInt(app.totalNftRewardClaimed)))} $CML`}
                                </p>
                                <p className="card-usd-value">
                                    {isAppLoading ? <Skeleton width="250px" /> : `$${new Intl.NumberFormat("en-US").format(Math.floor(parseInt(app.totalNftRewardClaimed))*app.cmlPrice)}`}
                                </p>
                            </div>
                        </Grid>
                        
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <div className="card-title">
                                    <p>CTNC - Claim Fee&nbsp;</p>
                                    {/* <div className="card-title-info">
                                        <img src={InfoImg} width="16px" />
                                        <span className="card-title-tooltip">Tooltip text</span>
                                    </div> */}
                                </div>
                                <p className="card-value">
                                    {isAppLoading ? <Skeleton width="250px" /> : `${new Intl.NumberFormat("en-US").format(Math.floor(app.claimFee))} %`}
                                </p>
                            </div>
                        </Grid>

                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <div className="card-title">
                                    <p>CTNC - Compound Fee&nbsp;</p>
                                    {/* <div className="card-title-info">
                                        <img src={InfoImg} width="16px" />
                                        <span className="card-title-tooltip">Tooltip text</span>
                                    </div> */}
                                </div>
                                <p className="card-value">
                                    {isAppLoading ? <Skeleton width="250px" /> : `${new Intl.NumberFormat("en-US").format(Math.floor(app.compoundFee))} %`}
                                </p>
                            </div>
                        </Grid>

                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <div className="card-title">
                                    <p>CTNC - Processing Delay&nbsp;</p>
                                    {/* <div className="card-title-info">
                                        <img src={InfoImg} width="16px" />
                                        <span className="card-title-tooltip">Tooltip text</span>
                                    </div> */}
                                </div>
                                <p className="card-value">
                                    {isAppLoading ? <Skeleton width="250px" /> : `${new Intl.NumberFormat("en-US").format(Math.floor(app.compoundDelay / 3600))} hours`}
                                </p>
                            </div>
                        </Grid>

                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <div className="card-title">
                                    <p>CTNC - Min Value to Stake&nbsp;</p>
                                    {/* <div className="card-title-info">
                                        <img src={InfoImg} width="16px" />
                                        <span className="card-title-tooltip">Tooltip text</span>
                                    </div> */}
                                </div>
                                <p className="card-value">
                                    {isAppLoading ? <Skeleton width="250px" /> : `${new Intl.NumberFormat("en-US").format(Math.floor(parseInt(app.stakeMinValue)))} $CML`}
                                </p>
                                <p className="card-usd-value">
                                    {isAppLoading ? <Skeleton width="250px" /> : `$${new Intl.NumberFormat("en-US").format(Math.floor(parseInt(app.stakeMinValue))*app.cmlPrice)}`}
                                </p>
                            </div>
                        </Grid>

                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <div className="card-title">
                                    <p>My NFTs Owned/Supported&nbsp;</p>
                                    {/* <div className="card-title-info">
                                        <img src={InfoImg} width="16px" />
                                        <span className="card-title-tooltip">Tooltip text</span>
                                    </div> */}
                                </div>
                                <p className="card-value">
                                    {isAccountLoading ? <Skeleton width="250px" /> : `${new Intl.NumberFormat("en-US").format(Math.floor(account.ownedNumber))} / ${new Intl.NumberFormat("en-US").format(Math.floor(account.availableNumber))}`}
                                </p>
                            </div>
                        </Grid>

                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <div className="card-title">
                                    <p>My Total Value Staked&nbsp;</p>
                                    {/* <div className="card-title-info">
                                        <img src={InfoImg} width="16px" />
                                        <span className="card-title-tooltip">Tooltip text</span>
                                    </div> */}
                                </div>
                                <p className="card-value">
                                    {isAccountLoading ? <Skeleton width="250px" /> : `${new Intl.NumberFormat("en-US").format(Math.floor(account.totalLockedAmount))} $CML`}
                                </p>
                                <p className="card-usd-value">
                                    {isAccountLoading ? <Skeleton width="250px" /> : `$${new Intl.NumberFormat("en-US").format(Math.floor(account.totalLockedAmount)*app.cmlPrice)}`}
                                </p>
                            </div>
                        </Grid>

                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <div className="card-title">
                                    <p>My Total Gift&nbsp;</p>
                                    {/* <div className="card-title-info">
                                        <img src={InfoImg} width="16px" />
                                        <span className="card-title-tooltip">Tooltip text</span>
                                    </div> */}
                                </div>
                                <p className="card-value">
                                    {isAccountLoading ? <Skeleton width="250px" /> : `${new Intl.NumberFormat("en-US").format(Math.floor(account.totalSupportValue))} $CML`}
                                </p>
                                <p className="card-usd-value">
                                    {isAccountLoading ? <Skeleton width="250px" /> : `$${new Intl.NumberFormat("en-US").format(Math.floor(account.totalSupportValue)*app.cmlPrice)}`}
                                </p>
                            </div>
                        </Grid>

                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <div className="card-title">
                                    <p>My Total Reward Per Day&nbsp;</p>
                                    {/* <div className="card-title-info">
                                        <img src={InfoImg} width="16px" />
                                        <span className="card-title-tooltip">Tooltip text</span>
                                    </div> */}
                                </div>
                                <p className="card-value">
                                    {isAccountLoading ? <Skeleton width="250px" /> : `${new Intl.NumberFormat("en-US").format(Math.floor(account.totalRewardsPerDay))} $CML`}
                                </p>
                                <p className="card-usd-value">
                                    {isAccountLoading ? <Skeleton width="250px" /> : `$${new Intl.NumberFormat("en-US").format(Math.floor(account.totalRewardsPerDay)*app.cmlPrice)}`}
                                </p>
                            </div>
                        </Grid>

                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <div className="card-title">
                                    <p>My Total Claimed&nbsp;</p>
                                    {/* <div className="card-title-info">
                                        <img src={InfoImg} width="16px" />
                                        <span className="card-title-tooltip">Tooltip text</span>
                                    </div> */}
                                </div>
                                <p className="card-value">
                                    {isAccountLoading ? <Skeleton width="250px" /> : `${new Intl.NumberFormat("en-US").format(Math.floor(account.totalClaimed))} $CML`}
                                </p>
                                <p className="card-usd-value">
                                    {isAccountLoading ? <Skeleton width="250px" /> : `$${new Intl.NumberFormat("en-US").format(Math.floor(account.totalClaimed)*app.cmlPrice)}`}
                                </p>
                            </div>
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <div className="card-title">
                                    <p>My USDC&nbsp;</p>
                                    {/* <div className="card-title-info">
                                        <img src={InfoImg} width="16px" />
                                        <span className="card-title-tooltip">Tooltip text</span>
                                    </div> */}
                                </div>
                                <p className="card-value">
                                    {isAccountLoading ? <Skeleton width="250px" /> : `${new Intl.NumberFormat("en-US").format(Math.floor(parseInt(account.balances.usdt)))}`}
                                </p>
                            </div>
                        </Grid>
                    </Grid>
                </Zoom>
            </div>
        </div>
    );
}

export default Dashboard;
