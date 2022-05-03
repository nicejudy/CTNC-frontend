import { Networks } from "./blockchain";

const AVAX_MAINNET = {
    MIM_ADDRESS: "0xFC39b1C43064bf14584fF074BEE8353f626d0D9D",
    APEU_ADDRESS: "0xDf799D759260A7c4Ae2b63d5E8Bb30d45C50946B",
    APEU_MANAGER_ADDRESS: "0x8EeB40B6662144D029E23270994CF5f32AE018F5",
    APEUNIV_MIM_ADDRESS: "0xDcfa9e83498f4cE91f057B35590C244dFed8e413",
};

export const getAddresses = (networkID: number) => {
    if (networkID === Networks.ETH) return AVAX_MAINNET;

    throw Error("Network don't support");
};
