import { SvgIcon, Link } from "@material-ui/core";
import { ReactComponent as GitHub } from "../../../assets/icons/stake.svg";
import { ReactComponent as Twitter } from "../../../assets/icons/twitter.svg";
import { ReactComponent as Telegram } from "../../../assets/icons/telegram.svg";
import { ReactComponent as Discord } from "../../../assets/icons/discord.svg";
import { ReactComponent as CoinGecko } from "../../../assets/icons/coingecko.svg";
import { ReactComponent as CoinMarketCap } from "../../../assets/icons/coinmarketcap.svg";
import { ReactComponent as OpenSea } from "../../../assets/icons/opensea.svg";
import { ReactComponent as Chart } from "../../../assets/icons/chart.svg";
import KYCIcon from "../../../assets/icons/apekyc.png";

export default function Social() {
    return (
        <>
            {/* <div className="social-row-kyc">
                <Link href="https://www.apeoclock.com/launch/ape-universe-launch/" target="_blank">
                    <img alt="" width="200" src={KYCIcon} />
                </Link>
            </div> */}
            <div className="social-row-1">
                {/* <Link href="https://www.coingecko.com/en/coins/ape-universe" target="_blank">
                    <SvgIcon color="primary" component={CoinGecko} />
                </Link>

                <Link href="https://coinmarketcap.com/currencies/ape-universe/" target="_blank">
                    <SvgIcon color="primary" component={CoinMarketCap} />
                </Link> */}

                <Link href="" target="_blank">
                    <SvgIcon color="primary" component={GitHub} />
                </Link>

                <Link href="https://testnets.opensea.io/collection/zootopia-ecosystem-v2/" target="_blank">
                    <SvgIcon color="primary" component={OpenSea} />
                </Link>

                <Link href="/" target="_blank">
                    <SvgIcon color="primary" component={Chart} />
                </Link>
            </div>
            <div className="social-row-2">
                {/* <Link href="https://docs.apes.money/" target="_blank">
                    <SvgIcon color="primary" component={GitHub} />
                </Link> */}

                <Link href="/" target="_blank">
                    <SvgIcon color="primary" component={Twitter} />
                </Link>

                <Link href="/" target="_blank">
                    <SvgIcon viewBox="0 0 32 32" color="primary" component={Telegram} />
                </Link>

                <Link href="/" target="_blank">
                    <SvgIcon color="primary" component={Discord} />
                </Link>
            </div>
        </>
    );
}
