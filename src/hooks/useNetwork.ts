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

export const useAllNetworksWithFilter = (isTestnet?: boolean, library?: any): Network[] => {
  const networks = useAllNetworks(library)

  return useMemo(() => {
    return isTestnet ? networks.filter(n => n.isTestnet) : networks.filter(n => !n.isTestnet)
  }, [isTestnet, networks])
}

export const useOtherNetworks = (network?: Network, library?: any): Network[] => {
  const networks = useAllNetworksWithFilter(network ? network.isTestnet : false, library)

  return useMemo(() => {
    const chainId = network ? network.chainId : process.env.REACT_APP_CHAIN_ID
    return networks.filter(n => n.chainId !== chainId)
  }, [network, networks])
}

export const useNetworkInfo = (chainId?: number, library?: any): Network | undefined => {
  const networks = useAllNetworks(library)

  return useMemo(() => {
    if (chainId) {
      return networks.find(n => n.chainId === chainId)
    }

    return networks.find(n => n.chainId === Number(process.env.REACT_APP_CHAIN_ID))
  }, [networks, chainId])
}
