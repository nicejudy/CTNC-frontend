import React from "react";
// import { Link } from "@material-ui/core";
import { Link } from "react-router-dom";
import "./main.scss";
import CatImg from "../../../../assets/icons/curbe.png";
import TigerImg from "../../../../assets/icons/tiger.png";

function Main() {
    return (
        <div className="landing-container">
            <div className="landing-main">
                {/* <div className="landing-main-img-wrap">
                    <img height="400px" src={CatImg} alt="" />
                </div> */}
                <div className="landing-main-title-wrap">
                    <p>
                        C.T&nbsp;
                        <img src={TigerImg} />
                        N.C
                    </p>
                </div>
                <div className="landing-main-btns-wrap">
                    <Link to="dashboard" rel="noreferrer">
                        <div className="landing-main-btn">
                            <p>Enter App</p>
                        </div>
                    </Link>
                    <Link to="doc" target="_blank" rel="noreferrer">
                        <div className="landing-main-btn">
                            <p>Documentation</p>
                        </div>
                    </Link>
                </div>
                <div className="landing-main-help-text-wrap">
                    <p>C.T.N.C to grow your wealth</p>
                    <p>Mint and upgrade your NFT</p>
                </div>
                <div className="landing-main-help-text-wrap">
                    <p>C.T.N.C to grow your wealth</p>
                    <p>Mint and upgrade your NFT</p>
                </div>
                <div className="landing-main-help-text-wrap">
                    <p>C.T.N.C to grow your wealth</p>
                    <p>Mint and upgrade your NFT</p>
                </div>
                <div className="landing-main-help-text-wrap">
                    <p>C.T.N.C to grow your wealth</p>
                    <p>Mint and upgrade your NFT</p>
                </div>
                <div className="landing-main-help-text-wrap">
                    <p>C.T.N.C to grow your wealth</p>
                    <p>Mint and upgrade your NFT</p>
                </div>
                <div className="landing-main-help-text-wrap">
                    <p>C.T.N.C to grow your wealth</p>
                    <p>Mint and upgrade your NFT</p>
                </div>
                <div className="landing-main-help-text-wrap">
                    <p>C.T.N.C to grow your wealth</p>
                    <p>Mint and upgrade your NFT</p>
                </div>
                <div className="landing-main-help-text-wrap">
                    <p>C.T.N.C to grow your wealth</p>
                    <p>Mint and upgrade your NFT</p>
                </div>
                <div className="landing-main-help-text-wrap">
                    <p>C.T.N.C to grow your wealth</p>
                    <p>Mint and upgrade your NFT</p>
                </div>
                <div className="landing-main-help-text-wrap">
                    <p>C.T.N.C to grow your wealth</p>
                    <p>Mint and upgrade your NFT</p>
                </div>
                <div className="landing-main-help-text-wrap">
                    <p>C.T.N.C to grow your wealth</p>
                    <p>Mint and upgrade your NFT</p>
                </div>
                <div className="landing-main-help-text-wrap">
                    <p>C.T.N.C to grow your wealth</p>
                    <p>Mint and upgrade your NFT</p>
                </div>
                <div className="landing-main-help-text-wrap">
                    <p>C.T.N.C to grow your wealth</p>
                    <p>Mint and upgrade your NFT</p>
                </div>
                <div className="landing-main-help-text-wrap">
                    <p>C.T.N.C to grow your wealth</p>
                    <p>Mint and upgrade your NFT</p>
                </div>
                <div className="landing-main-help-text-wrap">
                    <p>C.T.N.C to grow your wealth</p>
                    <p>Mint and upgrade your NFT</p>
                </div>
                <div className="landing-main-help-text-wrap">
                    <p>C.T.N.C to grow your wealth</p>
                    <p>Mint and upgrade your NFT</p>
                </div>
                <div className="landing-main-help-text-wrap">
                    <p>C.T.N.C to grow your wealth</p>
                    <p>Mint and upgrade your NFT</p>
                </div>
                <div className="landing-main-help-text-wrap">
                    <p>C.T.N.C to grow your wealth</p>
                    <p>Mint and upgrade your NFT</p>
                </div>
                <div className="landing-main-help-text-wrap">
                    <p>C.T.N.C to grow your wealth</p>
                    <p>Mint and upgrade your NFT</p>
                </div>
            </div>
        </div>
    );
}

export default Main;
