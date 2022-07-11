import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { IReduxState } from "src/store/slices/state.interface";
// import { IAccountSlice } from "src/store/slices/account-slice";
import { Link } from "@material-ui/core";
import { getAddresses, Networks, META_IMAGES, IPFS_URL, OPENSEA_ITEM_URL, INVITE_LINK } from "src/constants";
import TigerModal from "../TigerModal";
import "./apecard.scss";
import OwnerBadge from "src/assets/icons/owner-badge.png";
import CopyLinkIcon from "src/assets/icons/copylink.png";

interface IApeCardProps {
    nftId: string;
    handleOpen: (a: string) => void;
}

function ApeCard({ nftId, handleOpen }: IApeCardProps) {
    const addresses = getAddresses(Networks.ETH);

    const imageUrl = `${IPFS_URL}${META_IMAGES}`;

    const Clipboard = () => {
        navigator.clipboard.writeText(`${INVITE_LINK}${nftId}`);
    }

    return (
        <>
            <div className="ape-card">
                {/* {isOwner && <div className="owner-badge"><img width="60" src={OwnerBadge} /></div>} */}
                <div className="card-image" onClick={() => handleOpen(nftId)}><img width="250" height="250" src={imageUrl} /></div>
                <br />
                <div className="card-name-wrap">
                    <p className="card-name-text" onClick={() => handleOpen(nftId)}>CTNC #{nftId}</p>
                    <div className="card-copylink" onClick={Clipboard}>
                        <img src={CopyLinkIcon} width="21px" />
                    </div>
                </div>
                <br />
                <Link className="card-opensea-link" href={`${OPENSEA_ITEM_URL}${addresses.NFT_MANAGER}/${nftId}`} target="_blank">
                    <p>See on OpenSea</p>
                </Link>
            </div>
            {/* <TigerModal open={open} handleClose={handleClose} nftId={nftId} /> */}
        </>
    );
}

export default ApeCard;
