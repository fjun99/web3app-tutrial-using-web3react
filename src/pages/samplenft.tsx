// src/pages/samplenft.tsx
import type { NextPage } from 'next'
import Head from 'next/head'
import { VStack, Heading } from "@chakra-ui/layout"
import ConnectMetamask from 'components/ConnectMetamask'
import CardERC721 from 'components/CardERC721'
import { BigNumber } from 'ethers'

const nftAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3'
const tokenId = BigNumber.from(1)
const SampleNFTPage: NextPage = () => {

  return (
    <>
      <Head>
        <title>My DAPP</title>
      </Head>

      <Heading as="h3"  my={4}>NFT Marketplace</Heading>

      <ConnectMetamask />

      <VStack>
          <CardERC721 addressContract={nftAddress} tokenId={tokenId} ></CardERC721>
      </VStack>
    </>
  )
}

export default SampleNFTPage
