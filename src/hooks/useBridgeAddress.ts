import { useMemo } from 'react'
import Network from '../type/Network'
import networks from '../config/networks.json'

const useBridgeAddress = (chainId?: number): string => {
  const network = networks.find(n => n.chainId === chainId) as Network
  return useMemo(() => {
    return network ? network.bridge : ''
  }, [network])
}

export default useBridgeAddress
