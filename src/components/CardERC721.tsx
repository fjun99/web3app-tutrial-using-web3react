import React, { useEffect,useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import {Contract} from "@ethersproject/contracts";
import { Text} from '@chakra-ui/react'
import useSWR from 'swr'
import {ERC721ABI as abi} from "abi/ERC721ABI"
import { BigNumber } from 'ethers'
// import {ERC721ABI} from "abi/ERC721ABI"
const base64 = require( "base-64")
import { Image, Box } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'

interface Props {
    addressContract: string,
    tokenId:BigNumber
}

interface ItemInfo{
  name:string,
  description:string,
  svg:string
}
const fetcher = (library: Web3Provider | undefined, abi: any) => (...args:any) => {
    if (!library) return

    const [arg1, arg2, ...params] = args
    const address = arg1
    const method = arg2
    const contract = new Contract(address, abi, library)
    return contract[method](...params)
  }

export default function CardERC721(props:Props){
  const addressContract = props.addressContract
  const [symbol,setSymbol]= useState<string>("")
  const [itemInfo, setItemInfo] = useState<ItemInfo>()
  // const [totalSupply,setTotalSupply]=useState<string>()

  const {  account, active, library} = useWeb3React<Web3Provider>()

  const { data: balance, mutate } = useSWR([addressContract, 'balanceOf', account], {
    fetcher: fetcher(library, abi),
  })

useEffect( () => {
    if(!(active && account && library)) return

    const erc721:Contract = new Contract(props.addressContract, abi, library);


    // console.log(addressContract,abi,library)
    // const erc721:Contract = new Contract(addressContract, abi, library);
    // console.log(erc721)
    library.getCode(addressContract).then((result:string)=>{
      //check whether it is a contract
      if(result === '0x') return

      erc721.tokenURI(props.tokenId).then((r:any)=>{
        const data = base64.decode(r.slice(29))
        const itemInfo = JSON.parse(data)
        const svg = base64.decode(itemInfo.image.slice(26))
        setItemInfo({
          "name":itemInfo.name,
          "description":itemInfo.description,
          "svg":svg})

          console.log(new Blob([itemInfo.svg], {type: 'image/svg+xml'}))
      })

      // erc721.symbol().then((result:string)=>{
      //     setSymbol(result)
      // }).catch('error', console.error)

      // erc20.totalSupply().then((result:string)=>{
      //     setTotalSupply(formatEther(result))
      // }).catch('error', console.error);
    })

    //called only when changed to active
},[active])

/*
useEffect(() => {
    if(!(active && account && library)) return

    const erc721:Contract = new Contract(addressContract, abi, library)

    // listen for changes on an Ethereum address
    console.log(`listening for Transfer...`)

    const fromMe = erc721.filters.Transfer(account, null)
    console.log(fromMe)
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
*/
  console.log("CardERC721")

return (
    <Box my={8} bg='gray.100' borderRadius='md' width={220} height={260} px={3} py={4}>

        {itemInfo
        ?<Box boxSize='sm'>
          <img src={`data:image/svg+xml;utf8,${itemInfo.svg}`} alt={itemInfo.name} width= '200px' />
          <Text fontSize='xl' py={2}>{itemInfo.name}</Text>
        </Box>
        :<div></div>
        }

    </Box>
  )
}
