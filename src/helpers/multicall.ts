import { ethers } from "ethers";
import { MulticallContract } from "src/abi";
import { ETH_ADDRESSES, RPC_URL } from "src/constants";
import { BlockTag } from "@ethersproject/abstract-provider";
import { StaticJsonRpcProvider } from '@ethersproject/providers'
import { Contract } from '@ethersproject/contracts'
import { Interface } from '@ethersproject/abi'
import { BigNumberish } from "@ethersproject/bignumber";
import { AccessListish } from "@ethersproject/transactions";

export interface Call {
    address: string // Address of the contract
    name: string // Function name on the contract (example: balanceOf)
    params?: any[] // Function params
}

export interface Overrides {
    gasLimit?: BigNumberish | Promise<BigNumberish>;
    gasPrice?: BigNumberish | Promise<BigNumberish>;
    maxFeePerGas?: BigNumberish | Promise<BigNumberish>;
    maxPriorityFeePerGas?: BigNumberish | Promise<BigNumberish>;
    nonce?: BigNumberish | Promise<BigNumberish>;
    type?: number;
    accessList?: AccessListish;
    customData?: Record<string, any>;
};

export interface PayableOverrides extends Overrides {
    value?: BigNumberish | Promise<BigNumberish>;
}

export interface CallOverrides extends PayableOverrides {
    blockTag?: BlockTag | Promise<BlockTag>;
    from?: string | Promise<string>;
}
  
export interface MulticallOptions extends CallOverrides {
    requireSuccess?: boolean
}

const simpleRpcProvider = new StaticJsonRpcProvider(RPC_URL)

export const multicall = async <T = any>(abi: any[], calls: Call[], options?: MulticallOptions): Promise<T> => {
    const { requireSuccess = true, ...overrides } = options || {}
    const multi = new ethers.Contract(ETH_ADDRESSES.MULTICALL_ADDRESS, MulticallContract, simpleRpcProvider);

    const itf = new Interface(abi)
  
    const calldata = calls.map((call) => ({
      target: call.address.toLowerCase(),
      callData: itf.encodeFunctionData(call.name, call.params),
    }))
  
    const returnData = await multi.tryAggregate(requireSuccess, calldata, overrides)
    const res = returnData.map((call: any, i: any) => {
      const [result, data] = call
      return result ? itf.decodeFunctionResult(calls[i].name, data) : null
    })
  
    return res as any
  }