import { useSelector } from "react-redux";
import { Grid, Zoom } from "@material-ui/core";
import "./mint.scss";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { INftInfoDetails } from "../../store/slices/account-slice";
import ToolBar from "src/components/ToolBar";
import ApeCard from "src/components/ApeCard";

function Mint() {
    const nfts = useSelector<IReduxState, INftInfoDetails[]>(state => {
        return state.account.nft;
    });

    const compoundDelay = useSelector<IReduxState, number>(state => {
        return state.app.compoundDelay;
    });

    return (
        <>
            {nfts == undefined ? <></> : <ToolBar nfts={nfts} />}
            <div className="mint-view">
                <div className="mint-infos-wrap">
                    <Zoom in={true}>
                        <Grid container spacing={4}>
                            {nfts == undefined ? (
                                <Skeleton width="100px" />
                            ) : (
                                nfts.map(nft => (
                                    <Grid item xl={3} lg={4} md={6} sm={12} xs={12}>
                                        <ApeCard nft={nft} compoundDelay={compoundDelay * 1} filter="" />
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
