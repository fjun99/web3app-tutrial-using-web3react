import React, { useEffect,useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import {Contract} from "@ethersproject/contracts";
import { Text} from '@chakra-ui/react'
import useSWR from 'swr'
import { formatEther }from "@ethersproject/units"
import {ERC721ABI} from "abi/ERC721ABI"
import { BigNumber } from 'ethers';
import { addressNFTContract, addressMarketContract }  from '../constants'
import  CardERC721  from "./CardERC721"
const base64 = require( "base-64")
import {Grid, GridItem, Box} from "@chakra-ui/react"

interface Props {
    addressContract: string
}

// const fetcher = (library: Web3Provider | undefined, abi: any) => (...args:any) => {
//     if (!library) return

//     const [arg1, arg2, ...params] = args
//     const address = arg1
//     const method = arg2
//     const contract = new Contract(address, abi, library)
//     return contract[method](...params)
//   }

export default function ReadNFTMarket(props:Props){
  const abiJSON = require("abi/NFTMarketplace.json")
  const abi = abiJSON.abi
  const addressContract = props.addressContract
  const [listingFee,setListingFee] = useState<string>()
  const [items,setItems] = useState<[]>()
  const [itemsMeta, setItemsMeta] = useState<any []>()

  const {  account, active, library} = useWeb3React<Web3Provider>()

  // const { data: balance, mutate } = useSWR([addressContract, 'balanceOf', account], {
  //   fetcher: fetcher(library, abi),
  // })

useEffect( () => {
    if(!(active && account && library)) return

    console.log(addressContract,abi,library)
    const market:Contract = new Contract(addressContract, abi, library);
    console.log(market)
    library.getCode(addressContract).then((result:string)=>{
      //check whether it is a contract
      if(result === '0x') return

      market.listingFee().then((result:string)=>{
        setListingFee(formatEther(result))
      }).catch('error', console.error)

      market.fetchActiveItems().then((items:any)=>{
        // console.log(items)
        items.map((item:any)=>{
          console.log(item.nftContract)
          console.log(item.tokenId.toString())
        })
        setItems(items)

        // const abiJSON = require("abi/BadgeToken.json")
        const erc721:Contract = new Contract(addressNFTContract, ERC721ABI, library);
        
        // let metas= new Array(items.length)
        // setItemsMeta(metas)

        for(let i=0;i<items.length;i++){
          const item = items[i]
          console.log("item.tokenId",item.tokenId.toString())
          erc721.tokenURI(item.tokenId).then((r:any)=>{
            const data = base64.decode(r.slice(29))
            const itemInfo = JSON.parse(data)
            const svg = base64.decode(itemInfo.image.slice(26))
            console.log({
              "name":itemInfo.name,
              "description":itemInfo.description,
              "svg":svg})
          })
        }

      })

      // erc20.totalSupply().then((result:string)=>{
      //     setTotalSupply(formatEther(result))
      // }).catch('error', console.error);
    })

    //called only when changed to active
},[active])

// console.log(items)
console.log(itemsMeta)
return (
  
<Grid templateColumns='repeat(3, 1fr)' gap={6} w='100%'>
          {items?
        items.map((item:any)=>{
          return(
          <GridItem key={item.id} >
            <CardERC721 addressContract={item.nftContract} tokenId={item.tokenId} ></CardERC721>
          </GridItem>)
        })
        :<Box></Box>}

  </Grid>
  )
}
