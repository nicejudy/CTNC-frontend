import { useState, useEffect } from "react";
import { useWeb3Context } from "../../../hooks";
import { getAddresses, TOKEN_DECIMALS, Networks } from "../../../constants";
import CartIcon from "../../../assets/icons/cart.png";
import AceIcon from "../../../assets/icons/token-logo.png";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "./time-menu.scss";

function ApeuButton() {
    const { providerChainID, connected, web3 } = useWeb3Context();

    const [isConnected, setConnected] = useState(connected);

    const addresses = getAddresses(Networks.ETH);

    const ACE_ADDRESS = addresses.ACE_ADDRESS;

    const isVerySmallScreen = useMediaQuery("(max-width: 500px)");

    const buyToken = () => {
        // window.open(`https://traderjoexyz.com/trade?outputCurrency=${ACE_ADDRESS}`, "_blank");
        window.open(``, "_blank");
    };

    const addToken = () => async () => {
        const host = window.location.origin;
        if (window.ethereum) {
            try {
                await window.ethereum.request({
                    method: "wallet_watchAsset",
                    params: {
                        type: "ERC20",
                        options: {
                            address: ACE_ADDRESS,
                            symbol: "ACE",
                            decimals: TOKEN_DECIMALS,
                            image: `${host}/${AceIcon}`,
                        },
                    },
                });
            } catch (error) {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        setConnected(connected);
    }, [web3, connected]);

    return (
        <>
            {providerChainID == Networks.ETH && isConnected && (
                <>
                    <div className="time-menu-root" onClick={buyToken}>
                        <div className="time-menu-btn">{!isVerySmallScreen ? <p>Buy ACE</p> : <img alt="" width="20" src={CartIcon} />}</div>
                    </div>
                    <div className="time-menu-root" onClick={addToken()}>
                        <div className="ace-btn">
                            <img alt="" height="24" src={AceIcon} />
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default ApeuButton;
