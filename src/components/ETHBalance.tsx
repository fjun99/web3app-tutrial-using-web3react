import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { Text} from '@chakra-ui/react'
import { formatEther } from "@ethersproject/units"

const ETHBalance = () => {
    const [ethBalance, setEthBalance] = useState<number | undefined>(undefined)
    const {account, active, library,chainId} = useWeb3React<Web3Provider>()
    const provider = library
      
    useEffect(() => {
      if(active && account){
        provider?.getBalance(account).then((result)=>{
            setEthBalance(Number(formatEther(result)))
        })
      }
    })
  
    return (
        <div>
        {active ? (
            <Text fontSize="md" w='100%' my='2' align='left'>
                ETH in account: {ethBalance?.toFixed(3)} {chainId===31337? 'Test':' '} ETH
            </Text>
        ) : (
            <Text fontSize="md" w='100%' my='2' align='left'>ETH in account:</Text>
        )}
        </div>
    )
  }

export default ETHBalance
  