import { Networks } from "./blockchain";

export const ETH_ADDRESSES = {
    USDT_ADDRESS: "0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b",
    CML_ADDRESS: "0x8fb1a8D6eC22fD07387a08F5dF86bf1075194921",
    NFT_MANAGER: "0x164b6B83D19De7bBc51B8f3c297A661a280b6778",
    PAIR_ADDRESS: "0x3a7e40C800D1dfebEB459a9e2e908c9dcb2F448d",
};

export const getAddresses = (networkID: number) => {
    if (networkID === Networks.ETH) return ETH_ADDRESSES;

    throw Error("Network don't support");
};
