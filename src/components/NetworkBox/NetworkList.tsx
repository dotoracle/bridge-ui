import { useContext } from 'react'
import styled from 'styled-components/macro'
import BridgeAppContext from '../../context/BridgeAppContext'
import Network from '../../type/Network'
import NetworkRow from './NetworkRow'
import { useActiveWeb3React, useAllNetworks, useNetworkInfo } from '../../hooks'

const NetworkListWrapper = styled.div`
  padding: 0 0.5rem;
  max-height: 280px;
  overflow: auto;
`

interface INetworkList {
  selectedNetwork: Network
  otherNetwork: Network
  side: 'SOURCE' | 'TARGET'
  onNetworkSelect: (network: Network) => void
}

function NetworkList(props: INetworkList): JSX.Element {
  const { selectedNetwork, otherNetwork, side, onNetworkSelect } = props

  const { setSourceNetwork, setTargetNetwork } = useContext(BridgeAppContext)

  const { chainId } = useActiveWeb3React()
  const currentNetwork = useNetworkInfo(chainId)

  let networks = useAllNetworks(currentNetwork?.isTestnet)

  // if current network is Casper
  if (currentNetwork?.notEVM) {
    networks = networks.filter(n => n.chainId != currentNetwork.chainId)
  }

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
