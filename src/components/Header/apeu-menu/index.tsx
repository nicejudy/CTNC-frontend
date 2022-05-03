import { useState, useEffect } from "react";
import { useWeb3Context } from "../../../hooks";
import { getAddresses, TOKEN_DECIMALS, Networks } from "../../../constants";
import CartIcon from "../../../assets/icons/cart.png";
import WoodIcon from "../../../assets/icons/wood.png";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "./time-menu.scss";

function ApeuButton() {
    const { providerChainID, connected, web3 } = useWeb3Context();

    const [isConnected, setConnected] = useState(connected);

    const addresses = getAddresses(Networks.ETH);

    const APEU_ADDRESS = addresses.APEU_ADDRESS;

    const isVerySmallScreen = useMediaQuery("(max-width: 500px)");

    const buyToken = () => {
        // window.open(`https://traderjoexyz.com/trade?outputCurrency=${APEU_ADDRESS}`, "_blank");
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
                            address: "0xee7244231DF6A0D8c4D9b54886ebdA92b6580dA9",
                            symbol: "WOOD",
                            decimals: TOKEN_DECIMALS,
                            image: `${host}/${WoodIcon}`,
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
                        <div className="time-menu-btn">{!isVerySmallScreen ? <p>Buy Wood</p> : <img alt="" width="20" src={CartIcon} />}</div>
                    </div>
                    <div className="time-menu-root" onClick={addToken()}>
                        <div className="wood-btn">
                            <img alt="" height="24" src={WoodIcon} />
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default ApeuButton;
