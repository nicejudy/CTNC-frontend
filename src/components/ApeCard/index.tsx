import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, OutlinedInput, InputAdornment } from "@material-ui/core";
import { NavLink, Link as ReactLink } from "react-router-dom";
import { getAddresses, Networks, META_IMAGES, IPFS_URL, OPENSEA_ITEM_URL, ETHSCAN_URL } from "src/constants";
import NftButton from "../nft-button";
import Cookies from "universal-cookie";
import "./apecard.scss";
import { getNFTLevel } from "src/helpers";
import { INftInfoDetails, IUserInfoDetails } from "src/store/slices/account-slice";
import { useWeb3Context } from "src/hooks";
import { IReduxState } from "src/store/slices/state.interface";
import { trim, shorten } from "src/helpers";
import OwnerBadge from "src/assets/icons/owner-badge.png";
import CopyLinkIcon from "src/assets/icons/copylink.png";
import { appendFile } from "fs";

interface IApeCardProps {
    nft: INftInfoDetails;
    compoundDelay: number;
    filter: string;
}

function ApeCard({ nft, compoundDelay, filter }: IApeCardProps) {
    const addresses = getAddresses(Networks.ETH);

    const isAccountLoading = useSelector<IReduxState, boolean>(state => state.account.loading);

    const { provider, address } = useWeb3Context();

    const getMyInfo = () => {
        return nft.supporters.find(user => user.address == address);
    }

    const getMyAmount = () => {
        const myAmount = getMyInfo()?.amount;
        return myAmount? Math.floor(myAmount) / Math.pow(10, 18): 0;
    }

    const getPassedTime = () => {
        const myLastTime = getMyInfo()?.lastProcessingTimestamp;
        return myLastTime? Math.floor(Date.now() / 1000) - myLastTime : 0;
    }

    const getActionTime = () => {
        let actionTime;
        const myInfo = getMyInfo();
        if (myInfo) {
            actionTime = myInfo.lastProcessingTimestamp + compoundDelay;
        } else {
            actionTime = 0;
        }
        return actionTime <= 0 ? 0 : actionTime;
    };

    const getNftActionTime = () => {
        const actionTime = nft.lastProcessingTimestamp + compoundDelay;
        return actionTime <= 0 ? 0 : actionTime;
    };

    const getTimeLeft = (time: number) => {
        const timestamp = time - Math.floor(Date.now() / 1000);
        return timestamp <= 0 ? 0 : timestamp;
    };

    const [timeLeft, setTimeLeft] = useState(getTimeLeft(getActionTime()));
    const [giftTimeLeft, setGiftTimeLeft] = useState(getTimeLeft(getNftActionTime()));

    const cookies = new Cookies();

    useEffect(() => {
        let timer = setInterval(() => {
            setTimeLeft(getTimeLeft(getActionTime()));
            setGiftTimeLeft(getTimeLeft(getNftActionTime()));
        }, 1000);
        return () => clearInterval(timer);
    });

    // const className = timeLeft == 0 ? "dapp-topbar-btns-wrap" : "dapp-topbar-btns-wrap-full";

    // const imageUrl = `https://ipfs.io/ipfs/${META_IMAGES}/${nft.id}.png`;
    const imageUrl = `${IPFS_URL}${META_IMAGES}`;

    const setCookie = () => {
        cookies.set("address", nft.owner);
    };

    const Clipboard = () => {
        navigator.clipboard.writeText(`https://demo.cryptotigernode.club/find?id=${nft.id}`);
    }

    return (
        <div className="ape-card">
            {nft.owner == address && <div className="owner-badge"><img width="60" src={OwnerBadge} /></div>}
            <img width="200" height="200" src={imageUrl} />
            <br />
            <div className="card-name-wrap">
                <p className="card-name-text">CTNC #{nft.id}</p>
                <div className="card-copylink" onClick={Clipboard}>
                    <img src={CopyLinkIcon} width="21px" />
                </div>
            </div>
            <br />
            <p className="card-title">
                Owner:&nbsp;
                <Link href={`${ETHSCAN_URL}${nft.owner}`} target="_blank">
                    <span className="card-value" onClick={setCookie}>
                        {nft.owner == address ? "YOU" : shorten(nft.owner)}
                    </span>
                </Link>
            </p>
            <p className="card-title">
                Total Staked Value: <span className="card-value">{Math.floor(nft.amount)} $CML</span>
            </p>
            <p className="card-title">
                Your Staked Value: <span className="card-value">{Math.floor(getMyAmount())} $CML</span>
            </p>
            <p className="card-title">
                Pending Rewards: <span className="card-value">{Math.floor(getMyAmount() * getPassedTime() * 34724 / 1e11)} $CML</span>
            </p>
            <p className="card-title">
                Processing Time: <span className="card-value">{getMyInfo()? new Date(timeLeft * 1000).toISOString().substring(11, 19) : "--:--:--"}</span>
            </p>
            <p className="card-title">
                Gift Value: <span className="card-value">{Math.floor(nft.supportValue)} $CML</span>
            </p>
            <p className="card-title">
                Gift Time: <span className="card-value">{new Date(giftTimeLeft * 1000).toISOString().substring(11, 19)}</span>
            </p>
            <p className="card-title">
                Stakers: <span className="card-value">{nft.supporters.length}</span>
            </p>
            <div className="dapp-topbar-btns-wrap">
                {nft.owner == address && <NftButton action="transfer" nftId={nft.id.toString()} actionTime={getActionTime()} />}
                {nft.owner != address && <NftButton action="transfer-disabled" nftId={nft.id.toString()} actionTime={getActionTime()} />}
                {nft.owner == address && nft.supportValue > 0 && <NftButton action="claim-support" nftId={nft.id.toString()} actionTime={getNftActionTime()} />}
                {(nft.owner != address || nft.supportValue == 0) && <NftButton action="claim-support" nftId={nft.id.toString()} actionTime={1000000000000} />}
            </div>
            <div className="dapp-topbar-btns-wrap">
                <NftButton action="upgrade" nftId={nft.id.toString()} actionTime={getActionTime()} />
                {getMyInfo() && <NftButton action="compound" nftId={nft.id.toString()} actionTime={getActionTime()} />}
                {!getMyInfo() && <NftButton action="compound" nftId={nft.id.toString()} actionTime={1000000000000} />}
            </div>
            <div className="dapp-topbar-btns-wrap">
                {getMyInfo() && <NftButton action="claim-cml" nftId={nft.id.toString()} actionTime={getActionTime()} />}
                {!getMyInfo() && <NftButton action="claim-cml" nftId={nft.id.toString()} actionTime={1000000000000} />}
                {getMyInfo() && <NftButton action="claim-usd" nftId={nft.id.toString()} actionTime={getActionTime()} />}
                {!getMyInfo() && <NftButton action="claim-usd" nftId={nft.id.toString()} actionTime={1000000000000} />}
            </div>
            {/* <div className="main-referral">
                <div className="main-referral-header">
                    <p>Your Referral Link</p>
                </div>
                <div className="main-referral-body">
                    <OutlinedInput
                        className="referral-link"
                        value={`https://demo.cryptotigernode.club/find?id=${nft.id}`}
                        endAdornment={
                            <InputAdornment position="end">
                                <div className="referral-link-btn" onClick={Clipboard}>
                                    <p>Copy</p>
                                </div>
                            </InputAdornment>
                        }
                    />
                </div>
                <div className="main-referral-footer">
                    <p>Earn 10% when someone uses your referral link</p>
                </div>
            </div> */}
            <Link className="card-opensea-link" href={`${OPENSEA_ITEM_URL}${addresses.NFT_MANAGER}/${nft.id.toString()}`} target="_blank">
                <p>See on OpenSea</p>
            </Link>
        </div>
    );
}

export default ApeCard;
