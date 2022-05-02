import { ethers } from "ethers";
import { LpReserveContract } from "../abi";
import { getAddresses } from "../constants";
import { Networks } from "../constants/blockchain";

export async function getMarketPrice(networkID: Networks, provider: ethers.Signer | ethers.providers.Provider): Promise<number> {
    const addresses = getAddresses(networkID);
    const pairContract = new ethers.Contract(addresses.APEUNIV_MIM_ADDRESS, LpReserveContract, provider);
    const reserves = await pairContract.getReserves();
    const marketPrice = reserves[0] / reserves[1];
    return marketPrice;
}
