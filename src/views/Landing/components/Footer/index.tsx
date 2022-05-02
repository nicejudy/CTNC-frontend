import React, { useState } from "react";
import "./footer.scss";
import { ReactComponent as ApeUIcon } from "../../../../assets/icons/wonderland-icon.svg";
import { SvgIcon, Link, Box, Popper, Fade, Grid } from "@material-ui/core";
import { Link as ReactLink, NavLink } from "react-router-dom";
import ZootopiaIcon from "../../../../assets/icons/logo.png";
import PoweredByIcon from "../../../../assets/icons/poweredByEthereum.png";
import { ReactComponent as GitHub } from "../../../../assets/icons/github.svg";
import { ReactComponent as Twitter } from "../../../../assets/icons/twitter.svg";
import { ReactComponent as Telegram } from "../../../../assets/icons/telegram.svg";
import { ReactComponent as Discord } from "../../../../assets/icons/discord.svg";

function Footer() {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event: any) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);

    return (
        <div className="footer">
            <Grid container spacing={4}>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <NavLink className="footer-link-logo" to="/">
                        <img width="50" alt="" src={ZootopiaIcon} />
                    </NavLink>
                    <div className="footer-text-wrap">
                        <p>Copyright © 2022 City Of Mars.</p>
                        <p>All Rights Reserved.</p>
                        <p>
                            <NavLink to="privacy-policy">Privacy Policy</NavLink> · <NavLink to="tos">Terms of Service</NavLink>
                        </p>
                    </div>
                    <Link className="footer-link-logo" href="https://ethereum.org/en/" target="_blank">
                        <img width="50" alt="" src={PoweredByIcon} />
                    </Link>
                </Grid>
                <Grid container lg={6} md={6} sm={12} xs={12}>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <p className="footer-list-title">City of Mars</p>
                        <ul className="footer-list">
                            <li>Docs</li>
                            <li>Get Wood</li>
                            <li>Trading Chart</li>
                            <li>Smart Contracts</li>
                            <li>Whitepaper</li>
                        </ul>
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <p className="footer-list-title">Community</p>
                        <ul className="footer-list">
                            <li>Opensea</li>
                            {/* <li>Coingecko</li>
                            <li>CoinMarketCap</li> */}
                            <li>Twitter</li>
                            <li>Discord</li>
                            <li>Instagram</li>
                            <li>Telegram</li>
                            <li>Contact us</li>
                        </ul>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

export default Footer;
