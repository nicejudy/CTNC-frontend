import { useState, useEffect } from "react";
import { useWeb3Context } from "../../../hooks";
import { getAddresses, TOKEN_DECIMALS, Networks, SWAP_URL, ETH_ADDRESSES } from "../../../constants";
import CartIcon from "../../../assets/icons/cart.png";
import CMLIcon from "../../../assets/icons/token.png";
import { SvgIcon, Link, Box, Popper, Fade } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "./time-menu.scss";

function ApeuButton() {
    const { providerChainID, connected, web3 } = useWeb3Context();

    const [isConnected, setConnected] = useState(connected);

    const addresses = getAddresses(Networks.ETH);

    const CML_ADDRESS = addresses.CML_ADDRESS;

    const isVerySmallScreen = useMediaQuery("(max-width: 500px)");

    const addToken = () => async () => {
        const host = window.location.origin;
        if (window.ethereum) {
            try {
                await window.ethereum.request({
                    method: "wallet_watchAsset",
                    params: {
                        type: "ERC20",
                        options: {
                            address: CML_ADDRESS,
                            symbol: "CML",
                            decimals: TOKEN_DECIMALS,
                            image: `${host}/${CMLIcon}`,
                        },
                    },
                });
            } catch (error) {
                console.log(error);
            }
        }
    };

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event: any) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);

    useEffect(() => {
        setConnected(connected);
    }, [web3, connected]);

    return (
        <>
            {providerChainID == Networks.ETH && isConnected && (
                <>
                    <div className="time-menu-root">
                        <Box component="div" onMouseEnter={e => handleClick(e)} onMouseLeave={e => handleClick(e)}>
                            <div className="time-menu-btn">
                                {
                                    !isVerySmallScreen ? 
                                        <div className="time-menu-wrap">
                                            <img alt="" width="30" src={CMLIcon} /><p>&nbsp;CARAMEL</p>
                                        </div>
                                    :
                                        <img alt="" width="30" src={CMLIcon} />
                                }
                            </div>
                            <Popper className="time-menu-poper" open={open} anchorEl={anchorEl} transition>
                                {({ TransitionProps }) => (
                                    <Fade {...TransitionProps} timeout={200}>
                                        <div className="tooltip">
                                            <Link className="tooltip-item" href={`${SWAP_URL}inputCurrency=${ETH_ADDRESSES.USDT_ADDRESS}&outputCurrency=${ETH_ADDRESSES.CML_ADDRESS}`} target="_blank">
                                                {/* <SvgIcon color="primary" component={GitHub} /> */}
                                                <p>BUY CARAMEL</p>
                                            </Link>
                                            <div className="tooltip-item" onClick={addToken()}>
                                                {/* <SvgIcon color="primary" component={Twitter} /> */}
                                                <p>ADD TO METAMASK</p>
                                            </div>
                                        </div>
                                    </Fade>
                                )}
                            </Popper>
                        </Box>
                    </div>
                    {/* <div className="time-menu-root" onClick={addToken()}>
                        <div className="ace-btn">
                            <img alt="" height="24" src={CMLIcon} />
                        </div>
                    </div> */}
                </>
            )}
        </>
    );
}

export default ApeuButton;
