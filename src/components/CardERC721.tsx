// components/CardERC721.tsx
import React, { useEffect,useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { Box, Text} from '@chakra-ui/react'
import useSWR from 'swr'
import { ERC721ABI as abi} from "abi/ERC721ABI"
import { BigNumber } from 'ethers'
import { fetcher } from 'utils/fetcher'
const base64 = require( "base-64")

interface Props {
    addressContract: string,
    tokenId:BigNumber
}

interface ItemInfo{
  name:string,
  description:string,
  svg:string
}

export default function CardERC721(props:Props){
  const addressContract = props.addressContract
  const {  account, active, library } = useWeb3React<Web3Provider>()

  const [itemInfo, setItemInfo] = useState<ItemInfo>()

  const { data: nftURI } = useSWR([addressContract, 'tokenURI', props.tokenId], {
    fetcher: fetcher(library, abi),
  })

useEffect( () => {
  if(!nftURI) return

  const data = base64.decode(nftURI.slice(29))
  const itemInfo = JSON.parse(data)
  const svg = base64.decode(itemInfo.image.slice(26))
  setItemInfo({
    "name":itemInfo.name,
    "description":itemInfo.description,
    "svg":svg})

},[nftURI])

return (
  <Box my={2} bg='gray.100' borderRadius='md' width={220} height={260} px={3} py={4}>
  {itemInfo
  ?<Box>
    <img src={`data:image/svg+xml;utf8,${itemInfo.svg}`} alt={itemInfo.name} width= '200px' />
    <Text fontSize='xl' px={2} py={2}>{itemInfo.name}</Text>
  </Box>
  :<Box />
  }
  </Box>
)
}
