import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IReduxState } from "src/store/slices/state.interface";
import { IPendingTxn } from "src/store/slices/pending-txns-slice";
import { useWeb3Context } from "src/hooks";
import { compoundAll, claimAll, compoundReward, cashoutReward } from "src/store/slices/nft-thunk";
import "./nft-button.scss";
import CircularProgress from "@material-ui/core/CircularProgress";
import TxModal from "../TxModal";

interface INftButtonProps {
    action: string;
    nftId: string;
    actionTime: number;
}

function NftButton({ action, nftId, actionTime }: INftButtonProps) {
    const [open, setOpen] = useState(false);
    const { provider, address, chainID, checkWrongNetwork } = useWeb3Context();
    const dispatch = useDispatch();

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onCompoundAll = async () => {
        if (await checkWrongNetwork()) return;
        dispatch(compoundAll({ provider, address, networkID: chainID }));
    };

    const onClaimAll = async () => {
        if (await checkWrongNetwork()) return;
        dispatch(claimAll({ provider, address, networkID: chainID }));
    };

    const onCompoundReward = async () => {
        if (await checkWrongNetwork()) return;
        dispatch(compoundReward({ nftId, provider, address, networkID: chainID }));
    };

    const onClaimReward = async (swapping: number) => {
        if (await checkWrongNetwork()) return;
        dispatch(cashoutReward({ nftId, swapping, provider, address, networkID: chainID }));
    };

    const calculateTimeLeft = () => {
        const timeLeftStamp = actionTime - Math.floor(Date.now() / 1000);
        if (timeLeftStamp <= 0) return 0;
        return timeLeftStamp;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        let timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    });

    let buttonText = "";
    let className = "nft-button";
    let clickFunc = () => {};
    let filter = "";

    if (action == "create") {
        buttonText = "Mint";
        clickFunc = () => {
            handleOpen();
        };
        filter = action;
    } else if (action == "transfer") {
        buttonText = "Transfer";
        clickFunc = () => {
            handleOpen();
        };
        filter = action;
    } else if (action == "transfer-disabled") {
        buttonText = "Transfer";
        className = "nft-button disabled";
        clickFunc = () => {};
    } else if (action == "upgrade") {
        buttonText = "Stake";
        className = timeLeft == 0 ? "nft-button" : "nft-button disabled";
        clickFunc = () => {
            handleOpen();
        };
        filter = action;
    } else if (action == "compound") {
        buttonText = "Compound";
        className = timeLeft == 0 ? "nft-button" : "nft-button disabled";
        clickFunc = () => {
            onCompoundReward();
        };
    } else if (action == "claim-cml") {
        buttonText = "Claim $CML";
        className = timeLeft == 0 ? "nft-button" : "nft-button disabled";
        clickFunc = () => {
            onClaimReward(0);
        };
    } else if (action == "claim-usd") {
        buttonText = "Claim USDC";
        className = timeLeft == 0 ? "nft-button" : "nft-button disabled";
        clickFunc = () => {
            onClaimReward(1);
        };
    } else if (action == "claim-support") {
        buttonText = "Claim Gift";
        className = timeLeft == 0 ? "nft-button" : "nft-button disabled";
        clickFunc = () => {
            onClaimReward(2);
        };
    } else if (action == "compoundall") {
        buttonText = "Compound All";
        className = timeLeft == 0 ? "nft-button" : "nft-button disabled";
        clickFunc = () => {
            onCompoundAll();
        };
    } else if (action == "claimall") {
        buttonText = "Claim All";
        className = timeLeft == 0 ? "nft-button" : "nft-button disabled";
        clickFunc = () => {
            onClaimAll();
        };
    }

    const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    if (pendingTransactions && pendingTransactions.length > 0) {
        buttonText = `pending `;
        clickFunc = () => {};
    }

    return (
        <>
            <div className={className} onClick={clickFunc}>
                <p>{buttonText}</p>
                {pendingTransactions.length > 0 && (
                    <div className="nft-button-progress">
                        <CircularProgress size={15} color="inherit" />
                    </div>
                )}
            </div>
            <TxModal open={open} handleClose={handleClose} filter={filter} nftId={nftId} />
        </>
    );
}

export default NftButton;
