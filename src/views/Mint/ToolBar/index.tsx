import { useState } from "react";
import { AppBar, Toolbar, Popper, Fade } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import PlanetButton from "./planet-button";
import "./toolbar.scss";
import { DRAWER_WIDTH, TRANSITION_DURATION } from "../../../constants/style";
import { IPlanetInfoDetails } from "../../../store/slices/account-slice";
import TxModal from "../TxModal";

const useStyles = makeStyles(theme => ({
    appBar: {
        width: "100%",
        padding: "20px 0 30px 0",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        background: "transparent",
        backdropFilter: "none",
        zIndex: 10,
    },
    topBar: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: TRANSITION_DURATION,
        }),
        marginLeft: DRAWER_WIDTH,
    },
    topBarShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: TRANSITION_DURATION,
        }),
        marginLeft: 0,
    },
}));

interface IToolBarProps {
    planets: IPlanetInfoDetails[];
}

function ToolBar({ planets }: IToolBarProps) {
    const classes = useStyles();

    const count = planets.length;

    let enabledCount = 0;

    let timestamp = 0;

    for (let index = 0; index < count; index++) {
        const actionTime = planets[index].lastProcessingTimestamp + planets[index].compoundDelay;
        if (timestamp < actionTime) timestamp = actionTime;
        if (actionTime <= Math.floor(Date.now() / 1000)) enabledCount++;
    }

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event: any) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);

    const [planetType, setPlanetType] = useState("0");

    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = (type: string) => {
        setPlanetType(type);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const isSmallScreen = useMediaQuery("(max-width: 710px)");

    // const actionTime = timestamp == 0 ? 0 : new Date(timestamp * 1000).toISOString().substring(11, 19);
    // const actionTime = timestamp == 0 ? "0" : new Date(timestamp * 1000).toISOString().substring(11, 19);

    return (
        <>
            <div className={`${classes.topBar} ${classes.topBarShift}`}>
                <AppBar position="sticky" className={classes.appBar} elevation={0}>
                    <Toolbar disableGutters className="dapp-topbar">
                        <div className="dapp-topbar-btns-wrap">
                            {/* {!isVerySmallScreen && <TimeMenu />} */}
                            {/* {count >= 0 && <PlanetButton action="create" planetId="0" actionTime={timestamp} />} */}
                            {/* {enabledCount > 1 && <PlanetButton action="merge" planetId="0" actionTime={timestamp} />} */}
                            {count >= 0 && (
                                <div className="planet-button" onMouseEnter={e => handleClick(e)} onMouseLeave={e => handleClick(e)}>
                                    <div className="time-menu-btn">
                                        <p>Mint</p>
                                    </div>
                                    <Popper className="time-menu-popper" open={open} anchorEl={anchorEl} transition>
                                        {({ TransitionProps }) => (
                                            <Fade {...TransitionProps} timeout={200}>
                                                <div className="tooltip">
                                                    <div className="add-tokens">
                                                        <div className="tooltip-item" onClick={() => handleOpenModal("0")}>
                                                            <p>Mint Empty Land</p>
                                                        </div>
                                                        <div className="tooltip-item" onClick={() => handleOpenModal("1")}>
                                                            <p>Mint Farm</p>
                                                        </div>
                                                        <div className="tooltip-item" onClick={() => handleOpenModal("2")}>
                                                            <p>Mint Sawmill</p>
                                                        </div>
                                                        <div className="tooltip-item" onClick={() => handleOpenModal("3")}>
                                                            <p>Mint Blacksmith</p>
                                                        </div>
                                                        <div className="tooltip-item" onClick={() => handleOpenModal("4")}>
                                                            <p>Mint Apothecary</p>
                                                        </div>
                                                        <div className="tooltip-item" onClick={() => handleOpenModal("5")}>
                                                            <p>Mint Market</p>
                                                        </div>
                                                        <div className="tooltip-item" onClick={() => handleOpenModal("6")}>
                                                            <p>Mint Castle</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Fade>
                                        )}
                                    </Popper>
                                </div>
                            )}
                            {!isSmallScreen && (
                                <>
                                    {/* {enabledCount == count && <PlanetButton action="compoundall" planetId="0" actionTime={timestamp} />} */}
                                    {enabledCount == count && <PlanetButton action="claimall" planetId="0" actionTime={timestamp} />}
                                </>
                            )}
                        </div>
                    </Toolbar>
                    {isSmallScreen && enabledCount == count && (
                        <Toolbar disableGutters className="dapp-topbar">
                            <div className="dapp-topbar-btns-wrap">
                                {/* {enabledCount == count && <PlanetButton action="compoundall" planetId="0" actionTime={timestamp} />} */}
                                {enabledCount == count && <PlanetButton action="claimall" planetId="0" actionTime={timestamp} />}
                            </div>
                        </Toolbar>
                    )}
                </AppBar>
            </div>
            <TxModal open={openModal} handleClose={handleCloseModal} filter="create" planetId={planetType} />
        </>
    );
}

export default ToolBar;
