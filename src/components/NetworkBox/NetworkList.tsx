import { useContext } from 'react'
import styled from 'styled-components'
import BridgeAppContext from '../../context/BridgeAppContext'
import Network from '../../type/Network'
import NetworkRow from './NetworkRow'
import { useActiveWeb3React, useAllNetworks, useNetworkInfo } from '../../hooks'

const NetworkListWrapper = styled.div`
  padding: 0 0.5rem;
`

interface INetworkList {
  selectedNetwork: Network
  otherNetwork: Network
  side: 'SOURCE' | 'TARGET'
  onNetworkSelect: (network: Network) => void
}

const NetworkList = (props: INetworkList): JSX.Element => {
  const { selectedNetwork, otherNetwork, side, onNetworkSelect } = props

  const { setSourceNetwork, setTargetNetwork } = useContext(BridgeAppContext)

  const { chainId } = useActiveWeb3React()
  const currentNetwork = useNetworkInfo(chainId)

  const networks = useAllNetworks(currentNetwork?.isTestnet)

  const handleSelectNetwork = (network: Network) => {
    onNetworkSelect(network)

    if (side === 'SOURCE') {
      setSourceNetwork(network)
    }

    if (side === 'TARGET') {
      setTargetNetwork(network)
    }
  }

  return (
    <NetworkListWrapper>
      {networks.map(network => {
        return (
          <NetworkRow
            network={network}
            key={network.chainId}
            isSelected={network.chainId === selectedNetwork.chainId}
            isDisabled={network.chainId === otherNetwork.chainId}
            onSelect={() => handleSelectNetwork(network)}
          />
        )
      })}
    </NetworkListWrapper>
  )
}

export default NetworkList
