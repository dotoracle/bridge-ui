import { useMemo } from 'react'
import Network from '../type/Network'
import networks from '../config/networks.json'

const useRpcUrl = (chainId?: number): string => {
  const network = networks.find(n => n.chainId === chainId) as Network
  return useMemo(() => {
    return network ? network.rpcURL : ''
  }, [network])
}

export default useRpcUrl
