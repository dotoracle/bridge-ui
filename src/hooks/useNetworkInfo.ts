import { useMemo, useState, useEffect } from 'react'
import Network from '../type/Network'

export const useAllNetworks = (library?: any): Network[] => {
  const [networks, setNetworks] = useState<Network[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const result = (await import(`../config/networks.json`)).default as Network[]
      setNetworks(result)
    }

    fetchData()
  }, [library])

  return useMemo(() => {
    return networks
  }, [networks]) // eslint-disable-line react-hooks/exhaustive-deps
}

export const useNetworkInfo = (chainId?: number, library?: any): Network | undefined => {
  const networks = useAllNetworks(library)

  return useMemo(() => {
    if (chainId) {
      return networks.find(n => n.chainId === chainId)
    }

    return undefined
  }, [networks, chainId])
}
