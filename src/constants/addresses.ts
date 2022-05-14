import { Networks } from "./blockchain";

const AVAX_MAINNET = {
    MIM_ADDRESS: "0xFC39b1C43064bf14584fF074BEE8353f626d0D9D",
    ACE_ADDRESS: "0x2f56c98ec2d4075409E727a0F3a14e7804ae355a",
    NFT_MANAGER: "0xD9Bc3124540953Fa8daF3A1cf7A9f6dA443b8cD6",
    PAIR_ADDRESS: "0x712E25A20f1b09a3f37747Af8CeAe4679957c263",
};

export const getAddresses = (networkID: number) => {
    if (networkID === Networks.ETH) return AVAX_MAINNET;

    throw Error("Network don't support");
};
