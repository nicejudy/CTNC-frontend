import { Networks } from "./blockchain";

export const ETH_ADDRESSES = {
    USDT_ADDRESS: "0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b",
    CML_ADDRESS: "0x03C911a041893991D335F55686D61B30A0f75486",
    NFT_MANAGER: "0xaFD6df36D7511b7Bd51971B6DCB1182534B6d975",
    PAIR_ADDRESS: "0xA0EC67fCac5CA2f058fcF850E3AACd7D54E69A5A",
};

export const getAddresses = (networkID: number) => {
    if (networkID === Networks.ETH) return ETH_ADDRESSES;

    throw Error("Network don't support");
};
