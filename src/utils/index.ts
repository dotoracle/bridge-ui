import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { Contract } from 'web3-eth-contract'

export const getContract = (address: string, abi: AbiItem, web3: Web3): Contract | null => {
  try {
    return new web3.eth.Contract(abi, address)
  } catch (error) {
    console.error('Failed to get contract', error)
    return null
  }
}
