import { useCallback, useState } from "react";
import { NavLink, Link as ReactLink } from "react-router-dom";
import Social from "./social";
import ZootopiaIcon from "../../../assets/icons/logo.png";
import TigerImg from "../../../assets/icons/tiger.png";
import { trim, shorten } from "../../../helpers";
import { useAddress } from "../../../hooks";
import { Link } from "@material-ui/core";
import "./drawer-content.scss";
import classnames from "classnames";

function NavContent() {
    const [isActive] = useState();
    const address = useAddress();

    const checkPage = useCallback((location: any, page: string): boolean => {
        const currentPath = location.pathname.replace("/", "");
        if (currentPath.indexOf("dashboard") >= 0 && page === "dashboard") {
            return true;
        }
        if (currentPath.indexOf("mint") >= 0 && page === "mint") {
            return true;
        }
        if (currentPath.indexOf("gallery") >= 0 && page === "gallery") {
            return true;
        }
        if (currentPath.indexOf("swap") >= 0 && page === "swap") {
            return true;
        }
        if (currentPath.indexOf("chart") >= 0 && page === "chart") {
            return true;
        }
        return false;
    }, []);

    return (
        <div className="dapp-sidebar">
            <div className="branding-header">
                {/* <Link to="/" component={NavLink}>
                    <img width="150" alt="" src={ZootopiaIcon} />
                </Link> */}

                <div className="nav-title">
                    {/* <img width="200" alt="" src={TextLogoIcon} /> */}
                    <p>
                        C.T&nbsp;
                        <Link to="/" component={NavLink}>
                            <img src={TigerImg} />
                        </Link>
                        N.C
                    </p>
                </div>

                {address && (
                    <div className="wallet-link">
                        <Link href={`https://etherscan.io/address/${address}`} target="_blank">
                            <p>{shorten(address)}</p>
                        </Link>
                    </div>
                )}
            </div>

            <div className="dapp-menu-links">
                <div className="dapp-nav">
                    <Link
                        component={NavLink}
                        to="/dashboard"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "dashboard");
                        }}
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            {/* <img alt="" src={DashboardIcon} /> */}
                            <p>DASHBOARD</p>
                        </div>
                    </Link>

                    <Link
                        component={NavLink}
                        to="/mint"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "mint");
                        }}
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            {/* <img alt="" src={MintIcon} /> */}
                            <p>MY NFTs</p>
                        </div>
                    </Link>

                    <Link
                        component={NavLink}
                        to="/gallery"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "gallery");
                        }}
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            <p>GALLERY</p>
                        </div>
                    </Link>

                    <Link
                        component={NavLink}
                        to="/swap"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "swap");
                        }}
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            {/* <img alt="" src={MintIcon} /> */}
                            <p>BUY ACE</p>
                        </div>
                    </Link>

                    <Link
                        component={NavLink}
                        id="bond-nav"
                        to="/chart"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "chart");
                        }}
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            {/* <img alt="" src={MintIcon} /> */}
                            <p>Chart</p>
                        </div>
                    </Link>

                    {/* <Link
                        id="bond-nav"
                        href="https://dexscreener.com/avalanche/0xf99799fc4e8887582431d7565eedea5750adb4c6"
                        target="_blank"
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            <p>ACE CHART</p>
                        </div>
                    </Link>

                    <Link
                        id="bond-nav"
                        href="https://tofunft.com/collection/ape-universe-ecosystem/"
                        target="_blank"
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            <p>TOFU NFT</p>
                        </div>
                    </Link> */}

                    {/* <div className="bond-discounts">
                        <p>Mint discounts</p>
                        {bonds.map((bond, i) => (
                            <Link component={NavLink} to={`/mints/${bond.name}`} key={i} className={"bond"}>
                                {!bond.bondDiscount ? (
                                    <Skeleton variant="text" width={"150px"} />
                                ) : (
                                    <p>
                                        {bond.displayName}
                                        <span className="bond-pair-roi">{bond.bondDiscount && trim(bond.bondDiscount * 100, 2)}%</span>
                                    </p>
                                )}
                            </Link>
                        ))}
                    </div> */}
                </div>
            </div>
            <div className="dapp-menu-doc-link"></div>
            <Social />
        </div>
    );
}

export default NavContent;
