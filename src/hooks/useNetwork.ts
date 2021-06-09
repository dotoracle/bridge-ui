/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMemo, useState, useEffect } from 'react'
import Network from '../type/Network'

export const useAllNetworks = (account?: string | null | undefined, chainId?: number, library?: any): Network[] => {
  const [networks, setNetworks] = useState<Network[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const result = (await import(`../config/networks.json`)).default as Network[]
      setNetworks(result)
    }

    fetchData()
  }, [account, chainId, library])

  return useMemo(() => {
    return networks
  }, [networks])
}

export const useAllNetworksWithFilter = (
  isTestnet?: boolean,
  account?: string | null | undefined,
  chainId?: number,
  library?: any,
): Network[] => {
  const networks = useAllNetworks(account, chainId, library)

  return useMemo(() => {
    return isTestnet ? networks.filter(n => n.isTestnet) : networks.filter(n => !n.isTestnet)
  }, [isTestnet, networks, account, chainId])
}

export const useOtherNetworks = (
  network?: Network,
  account?: string | null | undefined,
  chainId?: number,
  library?: any,
): Network[] => {
  const networks = useAllNetworksWithFilter(network ? network.isTestnet : false, account, chainId, library)
  return useMemo(() => {
    const _chainId = network ? network.chainId : chainId ? chainId : process.env.REACT_APP_CHAIN_ID
    return networks.filter(n => n.chainId !== _chainId)
  }, [network, networks, account, chainId])
}

export const useNetworkInfo = (
  account?: string | null | undefined,
  chainId?: number,
  library?: any,
): Network | undefined => {
  const networks = useAllNetworks(account, chainId, library)

  return useMemo(() => {
    if (chainId) {
      return networks.find(n => n.chainId === chainId)
    }

    return networks.find(n => n.chainId === Number(process.env.REACT_APP_CHAIN_ID))
  }, [networks, account, chainId])
}
