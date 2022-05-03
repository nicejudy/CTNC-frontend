import React, { useState, useCallback, useEffect } from "react";
import { ReactComponent as XIcon } from "src/assets/icons/x.svg";
import GifIcon from "src/assets/icons/nft.gif";
import { Box, Modal, Paper, SvgIcon, IconButton, OutlinedInput, InputAdornment, InputLabel, MenuItem, FormHelperText, FormControl, Select } from "@material-ui/core";
import "./txmodal.scss";
import { Skeleton } from "@material-ui/lab";
import { shorten, sleep, trim } from "src/helpers";
import { useDispatch, useSelector } from "react-redux";
import { IReduxState } from "src/store/slices/state.interface";
import { createPlanet, transferPlanet, upgradePlanet } from "src/store/slices/planet-thunk";
import { IPendingTxn, isPendingTxn, txnButtonText } from "src/store/slices/pending-txns-slice";
import { IPlanetInfoDetails } from "src/store/slices/account-slice";
import { useWeb3Context } from "src/hooks";
import { warning } from "src/store/slices/messages-slice";
import { messages } from "src/constants/messages";
import { META_IMAGES } from "src/constants";
import { utils } from "ethers";
import { String } from "lodash";

interface ITxProps {
    open: boolean;
    handleClose: () => void;
    filter: string;
    planetId: string;
}

function TxModal({ open, handleClose, filter, planetId }: ITxProps) {
    const { provider, address, chainID, checkWrongNetwork } = useWeb3Context();
    const dispatch = useDispatch();

    const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    const creationMinPrice = useSelector<IReduxState, string>(state => {
        return state.app.creationMinPrice;
    });

    const compoundDelay = useSelector<IReduxState, number>(state => {
        return state.app.compoundDelay;
    });

    const apeuBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.apeu;
    });

    const [quantity, setQuantity] = useState<string>("");
    const [number, setNumber] = useState<string>("");
    const [name, setName] = useState<string>("");

    let onMint = () => {};
    let text1 = "";
    let text2 = "";
    let titleText = "";
    let buttonText = "";

    if (filter == "create") {
        text1 = "Input Name";
        text2 = "Judy's house";
        titleText = "Mint ";
        buttonText = "Create";
        onMint = async () => {
            if (await checkWrongNetwork()) return;
            dispatch(createPlanet({ quantity, number, provider, address, networkID: chainID }));
        };
    } else if (filter == "transfer") {
        text1 = "Address";
        text2 = "Input Address to transfer";
        titleText = "Transfer";
        buttonText = "Transfer";
        onMint = async () => {
            if (await checkWrongNetwork()) return;
            dispatch(transferPlanet({ tokenId: planetId, to: name, provider, address, networkID: chainID }));
        };
    } else if (filter == "upgrade") {
        text1 = "Add Wood";
        text2 = "Input New Name";
        titleText = "Stake";
        buttonText = "Stake";
        onMint = async () => {
            if (await checkWrongNetwork()) return;
            dispatch(upgradePlanet({ id: planetId, quantity, provider, address, networkID: chainID }));
        };
    }

    const setMaxQuantity = () => {
        setQuantity(apeuBalance);
    };

    const setMaxNumber = () => {
        setNumber("99");
    };

    return (
        <Modal id="hades" open={open} onClose={handleClose} hideBackdrop>
            <Paper className="ohm-card ohm-popover txmodal-poper">
                <div className="cross-wrap">
                    <div className="txmodal-title">
                        <p>{titleText}</p>
                    </div>
                    <IconButton onClick={handleClose}>
                        <SvgIcon color="primary" component={XIcon} />
                    </IconButton>
                </div>
                <Box className="card-content">
                    <div className="txmodal-header">
                        <div className="txmodal-header-token-select-wrap">
                            {filter == "create" && <img className="txmodal-header-img" src={GifIcon} />}
                            {filter != "upgrade" && filter != "create" && (
                                <>
                                    <div className="txmodal-header-help-text">
                                        <p>{text1}</p>
                                    </div>
                                    <OutlinedInput
                                        type="text"
                                        placeholder={text2}
                                        className="txmodal-header-token-select-input"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        labelWidth={0}
                                    />
                                </>
                            )}
                            {filter == "create" && (
                                <>
                                    {/* <div className="txmodal-header-help-text">
                                        <p>
                                            Min Value : <span className="txmodal-span">{creationMinPrice}</span> WOOD
                                        </p>
                                    </div>
                                    <div className="txmodal-header-help-text">
                                        <p>
                                            Balance : <span className="txmodal-span">{Math.floor(parseInt(apeuBalance))}</span> WOOD
                                        </p>
                                    </div> */}
                                    <div className="txmodal-header-help-text">
                                        <p>Wood</p>
                                    </div>
                                    <OutlinedInput
                                        type="number"
                                        placeholder={new Intl.NumberFormat("en-US").format(parseInt(creationMinPrice))}
                                        className="txmodal-header-token-select-input"
                                        value={quantity}
                                        onChange={e => setQuantity(e.target.value)}
                                        labelWidth={0}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <div className="txmodal-header-token-select-input-btn" onClick={setMaxQuantity}>
                                                    <p>Max</p>
                                                </div>
                                            </InputAdornment>
                                        }
                                    />
                                    <div className="txmodal-header-help-text">
                                        <p>Amount</p>
                                    </div>
                                    <OutlinedInput
                                        type="number"
                                        placeholder="0"
                                        className="txmodal-header-token-select-input"
                                        value={number}
                                        onChange={e => setNumber(e.target.value)}
                                        labelWidth={0}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <div className="txmodal-header-token-select-input-btn" onClick={setMaxNumber}>
                                                    <p>Max</p>
                                                </div>
                                            </InputAdornment>
                                        }
                                    />
                                </>
                            )}
                            {filter == "upgrade" && (
                                <>
                                    <div className="txmodal-header-help-text">
                                        <p>{text1}</p>
                                    </div>
                                    <OutlinedInput
                                        type="number"
                                        placeholder=""
                                        className="txmodal-header-token-select-input"
                                        value={quantity}
                                        onChange={e => setQuantity(e.target.value)}
                                        labelWidth={0}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <div className="txmodal-header-token-select-input-btn" onClick={setMaxQuantity}>
                                                    <p>Max</p>
                                                </div>
                                            </InputAdornment>
                                        }
                                    />
                                </>
                            )}
                            {filter == "rename" && (
                                <>
                                    <div className="txmodal-header-help-text">
                                        <p>
                                            Warning: <span className="txmodal-span">5%</span> of Locked Wood will be burned as fee.
                                        </p>
                                    </div>
                                </>
                            )}
                            <div
                                className="txmodal-header-token-select-btn"
                                onClick={async () => {
                                    if (isPendingTxn(pendingTransactions, "pending...")) return;
                                    await onMint();
                                    await sleep(10);
                                    handleClose();
                                }}
                            >
                                <p>{txnButtonText(pendingTransactions, "", buttonText)}</p>
                            </div>
                        </div>
                    </div>
                </Box>
            </Paper>
        </Modal>
    );
}

export default TxModal;
