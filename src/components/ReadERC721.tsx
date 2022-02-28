import React, { useEffect,useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import {Contract} from "@ethersproject/contracts";
import { Text} from '@chakra-ui/react'
import useSWR from 'swr'
import {ERC721ABI as abi} from "abi/ERC721ABI"
import { fetcher } from 'utils/fetcher'

interface Props {
    addressContract: string
}

export default function ReadERC721(props:Props){
  const addressContract = props.addressContract

  const {  account, active, library} = useWeb3React<Web3Provider>()

  const { data: balance, mutate } = useSWR([addressContract, 'balanceOf', account], {
    fetcher: fetcher(library, abi),
  })

  const {data: symbol}= useSWR([addressContract, 'symbol'], {
    fetcher: fetcher(library, abi),
  })


useEffect(() => {
    if(!(active && account && library)) return

    const erc721:Contract = new Contract(addressContract, abi, library)

    // listen for changes on an Ethereum address
    console.log(`listening for ERC721 Transfer...`)

    const fromMe = erc721.filters.Transfer(account, null)
    erc721.on(fromMe, (from, to, tokenId, event) => {
        console.log('Transfer|sent', { from, to, tokenId, event })
        mutate(undefined, true)
    })

    const toMe = erc721.filters.Transfer(null, account)
    erc721.on(toMe, (from, to, tokenId, event) => {
        console.log('Transfer|received', { from, to, tokenId, event })
        mutate(undefined, true)
    })

    // remove listener when the component is unmounted
    return () => {
        erc721.removeAllListeners(toMe)
        erc721.removeAllListeners(fromMe)
    }
    
    // trigger the effect only on component mount
  }, [active,account])

return (
    <div>
        <Text >NFT Contract: {addressContract}</Text>
        <Text >Current Account: {account}</Text>
        <Text my={4}>ClassToken in current account:{balance
        ? balance.toString()
        : " "
        } {symbol}</Text>
    </div>
  )
}
