import { useState } from "react";
import { useSelector } from "react-redux";
import { Grid, Zoom } from "@material-ui/core";
import "./mynfts.scss";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { INftInfoDetails } from "../../store/slices/account-slice";
import ToolBar from "src/components/ToolBar";
import ApeCard from "src/components/ApeCard";
import TigerModal from "src/components/TigerModal";

function MyNfts() {
    const nfts = useSelector<IReduxState, number[]>(state => {
        return state.account.nft;
    });

    const [open, setOpen] = useState(false);

    const [nftId, setNftId] = useState("")

    const handleOpen = (id: string) => {
        setNftId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            {/* {nfts == undefined ? <></> : <ToolBar nfts={nfts} />} */}
            <div className="mynfts-view">
                <div className="mynfts-infos-wrap">
                    <Zoom in={true}>
                        <Grid container spacing={4}>
                            {nfts == undefined ? (
                                <Skeleton width="100px" />
                            ) : (
                                nfts.map(nft => (
                                    <Grid item xl={3} lg={4} md={6} sm={6} xs={12}>
                                        <ApeCard nftId={nft.toString()} handleOpen={handleOpen}/>
                                    </Grid>
                                ))
                            )}
                        </Grid>
                    </Zoom>
                </div>
                <TigerModal open={open} handleClose={handleClose} nftId={nftId} />
            </div>
        </>
    );
}

export default MyNfts;
