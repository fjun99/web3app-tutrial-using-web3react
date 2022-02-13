import React, { useEffect,useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import {Contract} from "@ethersproject/contracts";
import { formatEther}from "@ethersproject/units"
import { Text} from '@chakra-ui/react'
import useSWR from 'swr'
import {ERC20ABI as abi} from "abi/ERC20ABI"

interface Props {
    addressContract: string
}

const fetcher = (library: Web3Provider | undefined, abi: any) => (...args:any) => {
    if (!library) return

    const [arg1, arg2, ...params] = args
    const address = arg1
    const method = arg2
    const contract = new Contract(address, abi, library)
    return contract[method](...params)
  }

export default function ReadERC20(props:Props){
  const addressContract = props.addressContract
  const [symbol,setSymbol]= useState<string>("")
  const [totalSupply,setTotalSupply]=useState<string>()

  const {  account, active, library} = useWeb3React<Web3Provider>()

  const { data: balance, mutate } = useSWR([addressContract, 'balanceOf', account], {
    fetcher: fetcher(library, abi),
  })

useEffect( () => {
    if(!(active && account && library)) return

    const erc20:Contract = new Contract(addressContract, abi, library);
    library.getCode(addressContract).then((result:string)=>{
      //check whether it is a contract
      if(result === '0x') return

      erc20.symbol().then((result:string)=>{
          setSymbol(result)
      }).catch('error', console.error)

      erc20.totalSupply().then((result:string)=>{
          setTotalSupply(formatEther(result))
      }).catch('error', console.error);
    })
//called only when changed to active
},[active])

useEffect(() => {
    if(!(active && account && library)) return

    const erc20:Contract = new Contract(addressContract, abi, library)

    // listen for changes on an Ethereum address
    console.log(`listening for Transfer...`)

    const fromMe = erc20.filters.Transfer(account, null)
    erc20.on(fromMe, (from, to, amount, event) => {
        console.log('Transfer|sent', { from, to, amount, event })
        mutate(undefined, true)
    })

    const toMe = erc20.filters.Transfer(null, account)
    erc20.on(toMe, (from, to, amount, event) => {
        console.log('Transfer|received', { from, to, amount, event })
        mutate(undefined, true)
    })

    // remove listener when the component is unmounted
    return () => {
        erc20.removeAllListeners(toMe)
        erc20.removeAllListeners(fromMe)
    }
    
    // trigger the effect only on component mount
  }, [active,account])


return (
    <div>
        <Text >ERC20 Contract: {addressContract}</Text>
        <Text>token totalSupply:{totalSupply} {symbol}</Text>
        <Text my={4}>ClassToken in current account:{balance
        ? parseFloat(formatEther(balance)).toFixed(1)
        : " "
        } {symbol}</Text>
    </div>
  )
}
