import { useEffect, useState } from "react";
import { Link } from "@material-ui/core";
import { NavLink, Link as ReactLink } from "react-router-dom";
import { getAddresses, Networks, META_IMAGES, META_JSONS } from "src/constants";
import PlanetButton from "../planet-button";
import Cookies from "universal-cookie";
import "./apecard.scss";
import { getNFTLevel } from "src/helpers";
import { IPlanetInfoDetails } from "src/store/slices/account-slice";
import { useWeb3Context } from "src/hooks";
import { trim, shorten } from "src/helpers";

interface IApeCardProps {
    planet: IPlanetInfoDetails;
    compoundDelay: number;
    filter: string;
}

function ApeCard({ planet, compoundDelay, filter }: IApeCardProps) {
    const addresses = getAddresses(Networks.ETH);

    const { provider, address } = useWeb3Context();

    const getActionTime = () => {
        const actionTime = planet.lastProcessingTimestamp + compoundDelay;
        return actionTime <= 0 ? 0 : actionTime;
    };

    const getTimeLeft = () => {
        const timestamp = getActionTime() - Math.floor(Date.now() / 1000);
        return timestamp <= 0 ? 0 : timestamp;
    };

    const level = getNFTLevel(Math.floor(planet.planetValue));

    const [timeLeft, setTimeLeft] = useState(getTimeLeft());

    const cookies = new Cookies();

    useEffect(() => {
        let timer = setInterval(() => {
            setTimeLeft(getTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    });

    const className = timeLeft == 0 ? "dapp-topbar-btns-wrap" : "dapp-topbar-btns-wrap-full";

    const imageUrl = `https://ipfs.io/ipfs/${META_IMAGES}/${planet.id}.png`;

    const setCookie = () => {
        cookies.set("address", planet.owner);
    };

    return (
        <div className="ape-card">
            <img width="200" height="200" src={imageUrl} />
            <br />
            <p className="card-name">CTNC #{planet.id}</p>
            <br />
            {filter == "search" && (
                <p className="card-title">
                    Owner:&nbsp;
                    <Link href={`https://etherscan.io/address/${planet.owner}`} target="_blank">
                        <span className="card-value" onClick={setCookie}>
                            {shorten(planet.owner)}
                        </span>
                    </Link>
                </p>
            )}
            <p className="card-title">
                Locked Wood: <span className="card-value">{Math.floor(planet.planetValue)}</span>
            </p>
            <p className="card-title">
                Pending Rewards: <span className="card-value">{Math.floor(planet.pendingReward)}</span>
            </p>
            <p className="card-title">
                Daily Profit: <span className="card-value">{Math.round((planet.rewardPerDay / planet.planetValue) * 10000) / 100}</span> %
            </p>
            {filter != "search" && (
                <>
                    <div className={className}>
                        {timeLeft == 0 ? (
                            <>
                                <PlanetButton action="transfer" planetId={planet.id.toString()} actionTime={getActionTime()} />
                                <PlanetButton action="upgrade" planetId={planet.id.toString()} actionTime={getActionTime()} />
                            </>
                        ) : (
                            <>
                                <PlanetButton action="transfer" planetId={planet.id.toString()} actionTime={getActionTime()} />
                            </>
                        )}
                    </div>

                    <div className={className}>
                        {timeLeft == 0 ? (
                            <>
                                <PlanetButton action="compound" planetId={planet.id.toString()} actionTime={getActionTime()} />
                                <PlanetButton action="claim" planetId={planet.id.toString()} actionTime={getActionTime()} />
                            </>
                        ) : (
                            <>
                                <PlanetButton action="compound" planetId={planet.id.toString()} actionTime={getActionTime()} />
                            </>
                        )}
                    </div>
                </>
            )}
            <Link className="card-link" href={`https://testnets.opensea.io/assets/mumbai/${addresses.NFT_MANAGER}/${planet.id.toString()}`} target="_blank">
                <p>See on OpenSea</p>
            </Link>
        </div>
    );
}

export default ApeCard;
