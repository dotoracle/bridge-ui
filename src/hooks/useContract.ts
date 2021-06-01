import { useMemo } from 'react'
import Web3 from 'web3'
import { useActiveWeb3React } from './useWeb3'
import { getContract } from '../utils'

// ABI

const useContract = (address: string, abi: any) => {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !abi) return null

    try {
      const web3 = new Web3(library)
      return getContract(address, abi, web3)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, abi, library, account]) // eslint-disable-line react-hooks/exhaustive-deps
}
