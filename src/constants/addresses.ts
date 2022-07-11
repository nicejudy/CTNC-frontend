import { Networks } from "./blockchain";

export const ETH_ADDRESSES = {
    USDT_ADDRESS: "0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b",
    CML_ADDRESS: "0x8FeA31dAc621F14396f2e190b50cBDE83DECF8a8",
    NFT_MANAGER: "0x29D1ccbbbAF29220ae32D748F6eEB191b7a8097D",
    PAIR_ADDRESS: "0xB7E8F5FbE70e287cfC2D074cD96167Ad8247D4cC",
    MULTICALL_ADDRESS: "0xB0048A48863887F945B6B4bF08F70b9a3DF2b079"
};

export const getAddresses = (networkID: number) => {
    if (networkID === Networks.ETH) return ETH_ADDRESSES;

    throw Error("Network don't support");
};
