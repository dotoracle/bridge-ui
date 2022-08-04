import { useContext, useMemo } from 'react'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import { useActiveWeb3React } from './useWeb3'
import { getContract } from '../utils'

// ABI
import ERC20_ABI from '../constants/abi/ERC20.abi.json'
import BRIDGE_ABI from '../constants/abi/GenericBridge.abi.json'
import BridgeAppContext from 'context/BridgeAppContext'
import { useNetworkInfo } from './useNetwork'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useContract = (address?: string, abi?: any) => {
  const { sourceNetwork, ledgerAddress } = useContext(BridgeAppContext)
  const { library: web3Library, account: web3Account, chainId: web3ChainId } = useActiveWeb3React()
  const account = ledgerAddress !== '' ? ledgerAddress : web3Account
  const chainId = ledgerAddress !== '' ? sourceNetwork?.chainId : web3ChainId
  const networkInfo = useNetworkInfo(chainId)
  const library = ledgerAddress !== '' ? new Web3.providers.HttpProvider(networkInfo?.rpcURL ?? '') : web3Library

  return useMemo(() => {
    if (!address || !abi) return null

    try {
      const web3 = new Web3(library)
      return getContract(address, abi, web3)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, abi, library, account])
}

export const useTokenContract = (address?: string): Contract | null => {
  return useContract(address, ERC20_ABI)
}

export const useBridgeContract = (address?: string): Contract | null => {
  return useContract(address, BRIDGE_ABI)
}
