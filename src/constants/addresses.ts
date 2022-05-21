import { Networks } from "./blockchain";

const AVAX_MAINNET = {
    MIM_ADDRESS: "0xFC39b1C43064bf14584fF074BEE8353f626d0D9D",
    ACE_ADDRESS: "0xd828736B9679A23f375bfd64B2e39BFc21eC6048",
    NFT_MANAGER: "0x01031B55Bd0bc2C0d4371a42EB3EF03e1eF6A98E",
    PAIR_ADDRESS: "0x8f16FC3Fd71047a1293B996E708831976388332A",
};

export const getAddresses = (networkID: number) => {
    if (networkID === Networks.ETH) return AVAX_MAINNET;

    throw Error("Network don't support");
};
