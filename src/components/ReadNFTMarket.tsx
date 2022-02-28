import React, { useEffect,useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import {Contract} from "@ethersproject/contracts";
import  CardERC721  from "./CardERC721"
import {Grid, GridItem, Box, Text} from "@chakra-ui/react"
import useSWR from 'swr'
import { ethers } from 'ethers';
// import { fetcher } from "utils/fetcher"

interface Props {
    addressContract: string,
    option: number
}

export default function ReadNFTMarket(props:Props){
  const abiJSON = require("abi/NFTMarketplace.json")
  const abi = abiJSON.abi
  // const addressContract = props.addressContract
  const [items,setItems] = useState<[]>()

  const {  account, active, library} = useWeb3React<Web3Provider>()
  
  // const { data: items} = useSWR([addressContract, 'fetchActiveItems'], {
  //   fetcher: fetcher(library, abi),
  // })

useEffect( () => {
    if(! active)
      setItems(undefined)

    if(!(active && account && library)) return

    // console.log(addressContract,abi,library)
    const market:Contract = new Contract(props.addressContract, abi, library);
    console.log(market.provider)
    console.log(account)

    library.getCode(props.addressContract).then((result:string)=>{
      //check whether it is a contract
      if(result === '0x') return

      switch(props.option){
        case 0:
          market.fetchActiveItems({from:account}).then((items:any)=>{
            setItems(items)
          })    
          break;
        case 1:
          console.log(account)
          market.fetchMyPurchasedItems({from:account}).then((items:any)=>{
            setItems(items)
          })    
            break;
        case 2:
          market.fetchMyCreatedItems({from:account}).then((items:any)=>{
            setItems(items)
            console.log(items)
          })    
            break;
        default:
      }

    })

    //called only when changed to active
},[active,account])

const state = ["On Sale","Sold","Inactive"]

return (
  <Grid templateColumns='repeat(3, 1fr)' gap={0} w='100%'>
    {items
    ? 
    (items.length ==0)
      ?<Box>no item</Box>
      :items.map((item:any)=>{
        return(
          <GridItem key={item.id} >
            <CardERC721 addressContract={item.nftContract} tokenId={item.tokenId} ></CardERC721>
            <Text fontSize='sm' px={5} pb={1}> {state[item.state]} </Text> 
            {((item.seller == account && item.buyer == ethers.constants.AddressZero) || (item.buyer == account))
            ?<Text fontSize='sm' px={5} pb={1}> owned by you </Text> 
            :<Text></Text>
            }
          </GridItem>)
      })
    :<Box></Box>}
  </Grid>
  )
}
