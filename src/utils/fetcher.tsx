import { Web3Provider } from '@ethersproject/providers'
import {Contract} from "@ethersproject/contracts";

export const fetcher = (library: Web3Provider | undefined, abi: any) => (...args:any) => {
    if (!library) return

    const [arg1, arg2, ...params] = args
    const address = arg1
    const method = arg2
    const contract = new Contract(address, abi, library)
    return contract[method](...params)
  }