import { useSelector } from "react-redux";
import { Grid, Zoom } from "@material-ui/core";
import "./mint.scss";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { IPlanetInfoDetails } from "../../store/slices/account-slice";
import ToolBar from "./ToolBar";
import ApeCard from "./ApeCard";

function Mint() {
    const planets = useSelector<IReduxState, IPlanetInfoDetails[]>(state => {
        return state.account.planets;
    });

    const compoundDelay = useSelector<IReduxState, number>(state => {
        return state.app.compoundDelay;
    });

    return (
        <>
            {planets == undefined ? <></> : <ToolBar planets={planets} />}
            <div className="mint-view">
                <div className="mint-infos-wrap">
                    <Zoom in={true}>
                        <Grid container spacing={4}>
                            {planets == undefined ? (
                                <Skeleton width="100px" />
                            ) : (
                                planets.map(planet => (
                                    <Grid item xl={3} lg={4} md={6} sm={6} xs={12}>
                                        <ApeCard planet={planet} compoundDelay={compoundDelay * 1} />
                                    </Grid>
                                ))
                            )}
                        </Grid>
                    </Zoom>
                </div>
            </div>
        </>
    );
}

export default Mint;
