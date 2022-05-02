import { Networks } from "./blockchain";

const AVAX_MAINNET = {
    MIM_ADDRESS: "0x49eCd03A2C7663a2Fa488530A1bcAEdA75FBaa7A",
    APEU_ADDRESS: "0xee7244231DF6A0D8c4D9b54886ebdA92b6580dA9",
    APEU_MANAGER_ADDRESS: "0xe6B8152b6F936eC4F201CB92D0406c476924DB94",
    APEUNIV_MIM_ADDRESS: "0xF5cA390De7D0d59Ea23dfe923B786a5e2fF0d6ef",
};

export const getAddresses = (networkID: number) => {
    if (networkID === Networks.ETH) return AVAX_MAINNET;

    throw Error("Network don't support");
};
