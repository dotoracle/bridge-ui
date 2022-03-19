/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMemo } from 'react'
import networks from 'config/networks.json'
import Network from 'type/Network'

export const useAllNetworks = (isTestnet?: boolean): Network[] => {
  return useMemo(() => {
    return (isTestnet ? networks.filter(n => n.isTestnet) : networks.filter(n => !n.isTestnet)) as Network[]
  }, [isTestnet, networks])
}

export const useOtherNetworks = (
  network?: Network,
  account?: string | null | undefined,
  chainId?: number,
): Network[] => {
  const _networks = useAllNetworks(network ? network.isTestnet : false)
  return useMemo(() => {
    const _chainId = network ? network.chainId : chainId ? chainId : process.env.REACT_APP_CHAIN_ID
    return _networks.filter(n => n.chainId !== _chainId)
  }, [network, _networks, account, chainId])
}

export const useNetworkInfo = (chainId?: number): Network | undefined => {
  return useMemo(() => {
    if (chainId) {
      return networks.find(n => n.chainId === chainId) as Network | undefined
    }
    return networks.find(n => n.chainId === Number(process.env.REACT_APP_CHAIN_ID)) as Network | undefined
  }, [networks, chainId])
}
