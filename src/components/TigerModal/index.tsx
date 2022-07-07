import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { ReactComponent as XIcon } from "src/assets/icons/x.svg";
import GifIcon from "src/assets/icons/nft_large.gif";
import { Box, Modal, Paper, Grid, SvgIcon, IconButton, Link, OutlinedInput, InputAdornment, InputLabel, MenuItem, FormHelperText, FormControl, Select } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./tigermodal.scss";
import { Skeleton } from "@material-ui/lab";
import ConnectMenu from "src/components/Header/connect-button";
import { shorten, sleep, trim } from "src/helpers";
import { useDispatch, useSelector } from "react-redux";
import { IReduxState } from "src/store/slices/state.interface";
import { cashoutReward, compoundReward, transferNft, upgradeNft } from "src/store/slices/nft-thunk";
import { IPendingTxn, isPendingTxn, txnButtonText } from "src/store/slices/pending-txns-slice";
import { INftInfoDetails } from "src/store/slices/account-slice";
import { useWeb3Context } from "src/hooks";
import { warning } from "src/store/slices/messages-slice";
import { messages } from "src/constants/messages";
import { ETH_ADDRESSES, Networks, META_IMAGES, IPFS_URL, INVITE_LINK, OPENSEA_ITEM_URL, ETHSCAN_URL, META_JSONS, DEFAULD_NETWORK } from "src/constants";
import { utils } from "ethers";
import { String } from "lodash";
import CmlIcon from "src/assets/icons/token.png";
import UsdcIcon from "src/assets/icons/usdc.png";
import CopyLinkIcon from "src/assets/icons/copylink.png";
import OwnerBadge from "src/assets/icons/owner-badge.png";
import OpenseaIcon from "src/assets/icons/opensea.png";

interface ITigerProps {
    open: boolean;
    handleClose: () => void;
    nft: INftInfoDetails;
}

function TigerModal({ open, handleClose, nft }: ITigerProps) {
    const { provider, address, chainID, providerChainID, checkWrongNetwork } = useWeb3Context();
    const dispatch = useDispatch();

    const nftId = nft.id.toString();
    const nftLastTimeStamp = nft.lastProcessingTimestamp;

    // const imageUrl = `https://ipfs.io/ipfs/${META_IMAGES}/${nft.id}.png`;
    const imageUrl = `${IPFS_URL}${META_IMAGES}`;


    const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    const cmlPrice = useSelector<IReduxState, number>(state => {
        return state.app.cmlPrice;
    });

    const compoundDelay = useSelector<IReduxState, number>(state => {
        return state.app.compoundDelay;
    });

    const apeuBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.cml;
    });

    const [quantity, setQuantity] = useState<string>("");
    const [name, setName] = useState<string>("");

    const getMyInfo = () => {
        return nft.supporters.find(user => user.address == address);
    }

    const getMyAmount = () => {
        const myAmount = getMyInfo()?.amount;
        return myAmount? Math.floor(myAmount) / Math.pow(10, 18): 0;
    }

    const getPassedTime = () => {
        const myLastTime = getMyInfo()?.lastProcessingTimestamp;
        return myLastTime? Math.floor(Date.now() / 1000) - myLastTime : compoundDelay;
    }

    const getNftTimeLeft = () => {
        const timestamp = compoundDelay*1 + nftLastTimeStamp - Math.floor(Date.now() / 1000);
        return timestamp <= 0 ? 0 : timestamp;
    };

    const getOverTime = (time: number) => {
        return time <= 0 ? 0 : time;
    }

    const [timeLeft, setTimeLeft] = useState(getOverTime(compoundDelay - getPassedTime()));
    const [giftTimeLeft, setGiftTimeLeft] = useState(getNftTimeLeft());

    useEffect(() => {
        let timer = setInterval(() => {
            setTimeLeft(getOverTime(compoundDelay - getPassedTime()));
            setGiftTimeLeft(getNftTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    });

    const onTransfer = async () => {
        if (await checkWrongNetwork()) return;
        dispatch(transferNft({ tokenId: nftId, to: name, provider, address, networkID: chainID, handleClose: () => {} }));
    };

    const onStake = async () => {
        if (await checkWrongNetwork()) return;
        dispatch(upgradeNft({ id: nftId, quantity, provider, address, networkID: chainID, handleClose: () => {} }));
    };

    const onClaim = async (swapping: number) => {
        if (await checkWrongNetwork()) return;
        dispatch(cashoutReward({ nftId, swapping, provider, address, networkID: chainID }));
    };

    const onCompound = async () => {
        if (await checkWrongNetwork()) return;
        dispatch(compoundReward({ nftId, provider, address, networkID: chainID }));
    };

    const setMaxQuantity = () => {
        setQuantity(apeuBalance);
    };

    const Clipboard = () => {
        navigator.clipboard.writeText(`${INVITE_LINK}${nft.id}`);
    }

    return (
        <Modal id="hades" open={open} onClose={handleClose} hideBackdrop>
            <div className="hades-container">
                <Paper className="ohm-card tm-popover tm-poper">
                    <div className="cross-wrap">
                        <div className="tm-title">
                            {/* <p>CTNC #{nft.id}</p> */}
                        </div>
                        <IconButton onClick={handleClose}>
                            <SvgIcon color="primary" component={XIcon} />
                        </IconButton>
                    </div>
                    <Grid className="tm-wrapper" container spacing={4}>
                        <Grid className="tm-summary" item lg={6} md={6} sm={12} xs={12}>
                            {nft.owner == address && <div className="owner-badge"><img width="70" src={OwnerBadge} /></div>}
                            <div className="tm-image-section">
                                <img src={imageUrl} width="90%" />
                            </div>
                            <div className="tm-summary-section">
                                <div className="tm-properties">
                                    <div className="tm-properties-title">
                                        <p>Properties</p>
                                    </div>
                                    <Grid className="tm-properties-container" container spacing={3}>
                                        {nft.attributes.map(attr => (
                                            <Grid item lg={6} md={6} sm={6} xs={6}>
                                                <div className="tm-properties-item">
                                                    <p className="tm-properties-type">{attr.trait_type}</p>
                                                    <p className="tm-properties-value">{attr.value}</p>
                                                </div>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </div>
                            </div>
                            <div className="tm-details-section-2">
                                <div className="tm-referral-title">
                                    <p>Your NFT Link</p>
                                </div>
                                <div className="tm-referral">
                                    <OutlinedInput
                                        className="referral-link"
                                        value={`${INVITE_LINK}${nft.id}`}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <div className="referral-link-btn" onClick={Clipboard}>
                                                    <img src={CopyLinkIcon} width="20px" />
                                                </div>
                                            </InputAdornment>
                                        }
                                    />
                                </div>
                                <div className="referral-footer">
                                    <p>If you are owner of the NFT,<br/>promote your NFT and get 10%.</p>
                                </div>
                            </div>
                        </Grid>
                        <Grid className="tm-main" item lg={6} md={6} sm={12} xs={12}>
                            <div className="tm-details">
                                <div className="tm-details-section-1">
                                    <div className="tm-details-item tm-space">
                                        <p className="tm-details-title">CTNC #{nft.id}</p>
                                        <Link href={`${OPENSEA_ITEM_URL}${ETH_ADDRESSES.NFT_MANAGER}/${nft.id.toString()}`} target="_blank">
                                            <img src={OpenseaIcon} width="40px" />
                                        </Link>
                                    </div>
                                    <div className="tm-details-item">
                                        <p className="tm-details-type">Owned by&nbsp;</p>
                                        <Link href={`${ETHSCAN_URL}${nft.owner}`} target="_blank">
                                            <div className="tm-details-value">
                                                <p className="tm-details-value-cml">{nft.owner == address ? "YOU" : shorten(nft.owner)}</p>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="tm-details-item">
                                        <p className="tm-details-type">Total Staked Value:&nbsp;</p>
                                        <div className="tm-details-value">
                                            <p className="tm-details-value-cml">{new Intl.NumberFormat("en-US").format(Math.floor(nft.amount))} $CML</p>
                                            <p className="tm-details-value-usd">( ${new Intl.NumberFormat("en-US").format(Math.floor(nft.amount * cmlPrice))} )</p>
                                        </div>
                                    </div>
                                    <div className="tm-details-item">
                                        <p className="tm-details-type">Total Stakers:&nbsp;</p>
                                        <div className="tm-details-value">
                                            <p className="tm-details-value-cml">{new Intl.NumberFormat("en-US").format(Math.floor(nft.supporters.length))}</p>
                                        </div>
                                    </div>
                                    <div className="tm-details-item">
                                        <p className="tm-details-type">Gift Value:&nbsp;</p>
                                        <div className="tm-details-value">
                                            <p className="tm-details-value-cml">{new Intl.NumberFormat("en-US").format(Math.floor(nft.supportValue))} $CML</p>
                                            <p className="tm-details-value-usd">( ${new Intl.NumberFormat("en-US").format(Math.floor(nft.supportValue * cmlPrice))} )</p>
                                        </div>
                                    </div>
                                    <div className="tm-details-item tm-details-divider">
                                        <p className="tm-details-type">Total Reward Per Day:&nbsp;</p>
                                        <div className="tm-details-value">
                                            <p className="tm-details-value-cml">{new Intl.NumberFormat("en-US").format(Math.floor(nft.rewardPerDay))} $CML</p>
                                            <p className="tm-details-value-usd">( ${new Intl.NumberFormat("en-US").format(Math.floor(nft.rewardPerDay * cmlPrice))} )</p>
                                        </div>
                                    </div>
                                    <div className="tm-details-item">
                                        <p className="tm-details-type">Your Staked Value:&nbsp;</p>
                                        <div className="tm-details-value">
                                            <p className="tm-details-value-cml">{new Intl.NumberFormat("en-US").format(Math.floor(getMyAmount()))} $CML</p>
                                            <p className="tm-details-value-usd">( ${new Intl.NumberFormat("en-US").format(Math.floor(getMyAmount() * cmlPrice))} )</p>
                                        </div>
                                    </div>
                                    <div className="tm-details-item">
                                        <p className="tm-details-type">Your Pending Reward:&nbsp;</p>
                                        <div className="tm-details-value">
                                            <p className="tm-details-value-cml">{new Intl.NumberFormat("en-US").format(Math.floor(getMyAmount() * getPassedTime() * 34724 / 1e11))} $CML</p>
                                            <p className="tm-details-value-usd">( ${new Intl.NumberFormat("en-US").format(Math.floor(getMyAmount() * getPassedTime() * 34724 / 1e11 * cmlPrice))} )</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tm-interact">
                                <div className="tm-interact-item">
                                    {address == nft.owner ? <OutlinedInput
                                        type="text"
                                        placeholder="Input Address or ENS name"
                                        className="tm-interact-input-section"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        labelWidth={0}
                                    /> : <div className="tm-interact-warning">
                                            <p>You are not Owner of the NFT.</p>
                                        </div>
                                    }
                                    <div className="tm-interact-item-wrapper">
                                        <p className="tm-interact-type">Transfer Your NFT</p>
                                        {address == nft.owner ? 
                                        pendingTransactions.length > 0 ? 
                                        <div className="tm-interact-action">
                                            <p>Transfer</p>
                                            &nbsp;<CircularProgress size={15} color="inherit" />
                                        </div> : 
                                        <div className="tm-interact-action" onClick={onTransfer}>
                                            <p>Transfer</p>
                                        </div> : 
                                        <div className="tm-interact-action disabled">
                                            <p>Not Owner</p>
                                        </div>}
                                    </div>
                                </div>
                                <div className="tm-interact-item">
                                    {timeLeft <= 0 ? <OutlinedInput
                                        type="text"
                                        placeholder="Input Amount"
                                        className="tm-interact-input-section"
                                        value={quantity}
                                        onChange={e => setQuantity(e.target.value)}
                                        labelWidth={0}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <div className="tm-interact-input-btn" onClick={setMaxQuantity}>
                                                    <p>Max</p>
                                                </div>
                                            </InputAdornment>
                                        }
                                    /> : <div className="tm-interact-warning">
                                            <p>You have to wait some time.</p>
                                        </div>
                                    }
                                    <div className="tm-interact-item-wrapper">
                                        <p className="tm-interact-type">Stake $CML</p>
                                        {address && DEFAULD_NETWORK == providerChainID ?
                                        timeLeft <= 0 ? 
                                        pendingTransactions.length > 0 ? 
                                        <div className="tm-interact-action">
                                            <p>Stake</p>
                                            &nbsp;<CircularProgress size={15} color="inherit" />
                                        </div> : 
                                        <div className="tm-interact-action" onClick={onStake}>
                                            <p>Stake</p>
                                        </div> :
                                        <div className="tm-interact-action disabled">
                                            <p>{new Date(timeLeft * 1000).toISOString().substring(11, 19)}</p>
                                        </div> :
                                        <div className="txmodal-wallet"><ConnectMenu /></div>}
                                    </div>
                                </div>
                                <div className="tm-interact-item">
                                    <div className="tm-interact-item-wrapper no-margin">
                                        <div className="tm-interact-item-1">
                                            <p className="tm-interact-type">Claim NFT Gift</p>
                                            <div className="tm-interact-wrapper">
                                                {address == nft.owner ? 
                                                nft.supportValue > 0 ?
                                                giftTimeLeft <= 0 ?
                                                pendingTransactions.length > 0 ? 
                                                    <>
                                                        <div className="tm-interact-action tm-coin">
                                                            <img src={UsdcIcon} width="24px" />
                                                            &nbsp;<CircularProgress size={15} color="inherit" />
                                                        </div>
                                                        <div className="tm-interact-action tm-coin">
                                                            <img src={CmlIcon} width="24px" />
                                                            &nbsp;<CircularProgress size={15} color="inherit" />
                                                        </div>
                                                    </> : 
                                                    <>
                                                        <div className="tm-interact-action tm-coin" onClick={() => onClaim(3)}>
                                                            <img src={UsdcIcon} width="24px" />
                                                        </div>
                                                        <div className="tm-interact-action tm-coin" onClick={() => onClaim(2)}>
                                                            <img src={CmlIcon} width="24px" />
                                                        </div>
                                                    </> : 
                                                    <div className="tm-interact-action disabled">
                                                        <div className="tm-interact-warning">
                                                            <p>{new Date(giftTimeLeft * 1000).toISOString().substring(11, 19)}</p>
                                                        </div>
                                                    </div> : 
                                                    <div className="tm-interact-action disabled">
                                                        <div className="tm-interact-warning">
                                                            <p>No Gift</p>
                                                        </div>
                                                    </div> :
                                                    <div className="tm-interact-action disabled">
                                                        <div className="tm-interact-warning">
                                                            <p>Not Owner</p>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <div className="tm-interact-item-2">
                                            <p className="tm-interact-type">Claim Rewards</p>
                                            <div className="tm-interact-wrapper">
                                                {getMyAmount() > 0 ?
                                                timeLeft <= 0 ? 
                                                pendingTransactions.length > 0 ? 
                                                <>
                                                    <div className="tm-interact-action tm-coin">
                                                        <img src={UsdcIcon} width="24px" />
                                                        &nbsp;<CircularProgress size={15} color="inherit" />
                                                    </div>
                                                    <div className="tm-interact-action tm-coin">
                                                        <img src={CmlIcon} width="24px" />
                                                        &nbsp;<CircularProgress size={15} color="inherit" />
                                                    </div>
                                                </> :
                                                <>
                                                    <div className="tm-interact-action tm-coin" onClick={() => onClaim(1)}>
                                                        <img src={UsdcIcon} width="24px" />
                                                    </div>
                                                    <div className="tm-interact-action tm-coin" onClick={() => onClaim(0)}>
                                                        <img src={CmlIcon} width="24px" />
                                                    </div>
                                                </> :
                                                <div className="tm-interact-action disabled">
                                                    <div className="tm-interact-warning">
                                                        <p>{new Date(timeLeft * 1000).toISOString().substring(11, 19)}</p>
                                                    </div>
                                                </div> :
                                                <div className="tm-interact-action disabled">
                                                    <div className="tm-interact-warning">
                                                        <p>No Reward</p>
                                                    </div>
                                                </div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tm-interact-item">
                                    <div className="tm-interact-item-wrapper no-margin">
                                        <div className="tm-interact-type">Compound Rewards</div>
                                        {getMyAmount() > 0 ?
                                        timeLeft <= 0 ? 
                                        pendingTransactions.length > 0 ? 
                                        <div className="tm-interact-action">
                                            <p>Compound</p>
                                            &nbsp;<CircularProgress size={15} color="inherit" />
                                        </div> : 
                                        <div className="tm-interact-action" onClick={onCompound}>
                                            <p>Compound</p>
                                        </div> : 
                                        <div className="tm-interact-action disabled">
                                            <div className="tm-interact-warning">
                                                <p>{new Date(timeLeft * 1000).toISOString().substring(11, 19)}</p>
                                            </div>
                                        </div> :
                                        <div className="tm-interact-action disabled">
                                            <div className="tm-interact-warning">
                                                <p>No Reward</p>
                                            </div>
                                        </div>}
                                    </div>
                                </div>
                            </div>
                            <div className="tm-socials">
                                <div className="tm-socials-wrapper">
                                    <Link className="card-opensea-link" href={`${OPENSEA_ITEM_URL}${ETH_ADDRESSES.NFT_MANAGER}/${nft.id.toString()}`} target="_blank">
                                        <p>See on OpenSea</p>
                                    </Link>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        </Modal>
    );
}

export default TigerModal;
