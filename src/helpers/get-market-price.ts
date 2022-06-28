import { ethers } from "ethers";
import { LpReserveContract } from "../abi";
import { getAddresses, TOKEN_DECIMALS, USDC_DECIMALS } from "../constants";
import { Networks } from "../constants/blockchain";

export async function getMarketPrice(networkID: Networks, provider: ethers.Signer | ethers.providers.Provider): Promise<number> {
    const addresses = getAddresses(networkID);
    const pairContract = new ethers.Contract(addresses.PAIR_ADDRESS, LpReserveContract, provider);
    const reserves = await pairContract.getReserves();
    const marketPrice = (reserves[1] / 10**USDC_DECIMALS) / (reserves[0] / 10**TOKEN_DECIMALS);
    return marketPrice;
}
