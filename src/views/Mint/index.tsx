import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./mint.scss";
import { Slider, styled, Grid } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { IReduxState } from "../../store/slices/state.interface";
import { IPendingTxn } from "src/store/slices/pending-txns-slice";
import { createNft } from "src/store/slices/nft-thunk";
import { useWeb3Context } from "src/hooks";
import ConnectMenu from "src/components/Header/connect-button";
import { INftInfoDetails } from "../../store/slices/account-slice";
import NFTGIF from "src/assets/icons/nft_small.gif";
import { DEFAULD_NETWORK } from "src/constants";

function Mint() {
    const { provider, address, chainID, providerChainID, checkWrongNetwork } = useWeb3Context();

    const dispatch = useDispatch();

    const [value, setValue] = useState<number>(1);

    const onMint = async () => {
        if (await checkWrongNetwork()) return;
        dispatch(createNft({ number: value, provider, address, networkID: chainID, handleClose: () => {} }));
    };

    const nftMintedSupply = useSelector<IReduxState, number>(state => {
        return state.app.nftMintedSupply;
    });

    const nftTotalSupply = useSelector<IReduxState, number>(state => {
        return state.app.nftTotalSupply;
    });

    const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    const PrettoSlider = styled(Slider)({
        color: '#52af77',
        height: 8,
        '& .MuiSlider-track': {
          border: 'none',
        },
        '& .MuiSlider-thumb': {
          height: 24,
          width: 24,
          backgroundColor: '#fff',
          border: '2px solid currentColor',
          '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'inherit',
          },
          '&:before': {
            display: 'none',
          },
        },
        '& .MuiSlider-valueLabel': {
          lineHeight: 4.2,
          fontSize: 20,
          background: 'unset',
          padding: 0,
          width: 32,
          height: 32,
          borderRadius: '50% 50% 50% 0',
          backgroundColor: '#52af77',
          transformOrigin: 'bottom left',
          transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
          '&:before': { display: 'none' },
          '&.MuiSlider-valueLabelOpen': {
            transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
          },
          '& > *': {
            transform: 'rotate(-45deg)',
          },
        },
      });

      const handleChange = (event: ChangeEvent<{}>, newValue: number | number[]) => {
        if (typeof newValue === 'number') {
            setValue(newValue);
        }
    };

    return (
        <>
            {/* {nfts == undefined ? <></> : <ToolBar nfts={nfts} />} */}
            <div className="mint-view">
                <div className="mint-infos-wrap">
                    <div className="mint-img">
                        <img src={NFTGIF} width="300px" />
                    </div>
                    <div className="mint-sold">
                        <p>Minted {`${new Intl.NumberFormat("en-US").format(Math.floor(nftMintedSupply))} / ${new Intl.NumberFormat("en-US").format(Math.floor(nftTotalSupply))}`}</p>
                    </div>
                    <div className="mint-slider">
                        {/* <PrettoSlider
                            valueLabelDisplay="auto"
                            defaultValue={1}
                            max={10}
                            min={1}
                            value={value}
                            onChange={handleChange}
                        /> */}
                        <Grid container spacing={4}>
                            {[1,2,3,4,5,6,7,8,9].map(item =>(
                                <Grid className="mint-number" item md={4} sm={4} xs={4}>
                                    <div className="mint-number-div" onClick={() => setValue(item)}>
                                        <p>{item}</p>
                                    </div>
                                </Grid>
                            ))
                            }
                        </Grid>
                    </div>
                    {address && providerChainID == DEFAULD_NETWORK ?
                    pendingTransactions.length > 0 ?
                    <div className="mint-btn">
                        <p>Mint {value == 1 ? `${value} NFT` : `${value} NFTs`}</p>
                        &nbsp;&nbsp;<CircularProgress size={15} color="inherit" />
                    </div> : 
                    <div className="mint-btn" onClick={onMint}>
                        <p>Mint {value == 1 ? `${value} NFT` : `${value} NFTs`}</p>
                    </div> :
                    <div className="mint-wallet"><ConnectMenu /></div>
                    }
                </div>
            </div>
        </>
    );
}

export default Mint;
