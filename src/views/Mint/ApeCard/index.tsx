import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AppBar, Toolbar, SvgIcon, Link } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { getAddresses, Networks, META_TYPES } from "../../../constants";
import { ReactComponent as chimpanzee } from "../../../assets/apes/0.svg";
import { ReactComponent as monkey } from "../../../assets/apes/1.svg";
import { ReactComponent as gibbon } from "../../../assets/apes/2.svg";
import { ReactComponent as bonobo } from "../../../assets/apes/3.svg";
import { ReactComponent as orangutan } from "../../../assets/apes/4.svg";
import { ReactComponent as gorilla } from "../../../assets/apes/5.svg";
import PlanetButton from "../ToolBar/planet-button";
import "./apecard.scss";
import { trim, getNFTLevel } from "../../../helpers";
import { IReduxState } from "../../../store/slices/state.interface";
import { IAccountSlice, IPlanetInfoDetails } from "../../../store/slices/account-slice";
import { IAppSlice } from "../../../store/slices/app-slice";

interface IApeCardProps {
    planet: IPlanetInfoDetails;
}

function ApeCard({ planet }: IApeCardProps) {
    const addresses = getAddresses(Networks.ETH);

    const getActionTime = () => {
        const actionTime = planet.lastProcessingTimestamp + planet.compoundDelay;
        // return actionTime == 0 ? "0" : new Date(actionTime * 1000).toISOString().substring(11, 19);
        return actionTime <= 0 ? 0 : actionTime;
    };

    const getTimeLeft = () => {
        const timestamp = getActionTime() - Math.floor(Date.now() / 1000);
        return timestamp <= 0 ? 0 : timestamp;
    };

    const level = getNFTLevel(Math.floor(planet.planetValue));

    const [timeLeft, setTimeLeft] = useState(getTimeLeft());

    useEffect(() => {
        let timer = setInterval(() => {
            setTimeLeft(getTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    });

    const className = timeLeft == 0 ? "dapp-topbar-btns-wrap" : "dapp-topbar-btns-wrap-full";

    const imageUrl = planet.metadata["image"].split("//")[1];

    return (
        <div className="ape-card">
            {/* <SvgIcon color="primary" component={tierImg[getTierLevel(planet.rewardMult)]} viewBox="0 0 200 200" style={{ minWidth: "200px", minHeight: "200px", width: "200px" }} /> */}
            <img width="200" height="150" src={`https://ipfs.io/ipfs/${imageUrl}`} />
            <br />
            {/* <p className="card-tier">
                {tierLabel[getTierLevel(planet.rewardMult)]} #{planet.id}
            </p> */}
            <p className="card-name">{planet.name}</p>
            <p className="card-tier">{META_TYPES[level]}</p>
            <br />
            {/* <p className="card-title">Created Time: {planet.creationTime}</p>
            <p className="card-title">Latest Time: {planet.lastProcessingTimestamp}</p>
            <p className="card-title">Reward Mult: {planet.rewardMult}</p> */}
            <p className="card-title">
                Locked Wood: <span className="card-value">{Math.floor(planet.planetValue)}</span> {/*(${trim((planet.planetValue * mimPrice * marketPrice) / 10000, 2)})*/}
            </p>
            {/* <p className="card-title">Total Claimed: {Math.floor(planet.totalClaimed)}</p>
            <p className="card-title">Exists: {planet.exists}</p> */}
            <p className="card-title">
                Pending Rewards: <span className="card-value">{Math.floor(planet.pendingReward)}</span> {/*(${trim((planet.pendingReward * mimPrice * marketPrice) / 10000, 2)})*/}
            </p>
            <p className="card-title">
                Daily Profit: <span className="card-value">{Math.round((planet.rewardPerDay / planet.planetValue) * 10000) / 100}</span> %
            </p>
            {/* <p className="card-title">
                Tier Bonus: <span className="card-value">{getBonus(planet.rewardMult).toString()}</span> %
            </p> */}
            {/* <p className="card-title">Compound Delay: {Math.floor(planet.compoundDelay)}</p>
            <p className="card-title">Pending Rewards Gross: {Math.floor(planet.pendingRewardsGross)}</p>
            <p className="card-title">Reward Per Day Gross: {Math.floor(planet.rewardPerDayGross)}</p> */}
            <div className="dapp-topbar-btns-wrap">
                <PlanetButton action="rename" planetId={planet.id.toString()} actionTime={getActionTime()} />
                <PlanetButton action="transfer" planetId={planet.id.toString()} actionTime={getActionTime()} />
            </div>
            <div className={className}>
                {timeLeft == 0 ? (
                    <>
                        <PlanetButton action="upgrade" planetId={planet.id.toString()} actionTime={getActionTime()} />
                        <PlanetButton action="claim" planetId={planet.id.toString()} actionTime={getActionTime()} />
                    </>
                ) : (
                    <>
                        <PlanetButton action="compound" planetId={planet.id.toString()} actionTime={getActionTime()} />
                    </>
                )}
            </div>
            <Link className="card-link" href={`https://testnets.opensea.io/assets/mumbai/${addresses.APEU_MANAGER_ADDRESS}/${planet.id.toString()}`} target="_blank">
                <p>See on OpenSea</p>
            </Link>
        </div>
    );
}

export default ApeCard;
