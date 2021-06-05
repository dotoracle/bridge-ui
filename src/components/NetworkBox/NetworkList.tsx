import styled from 'styled-components'
import Network from '../../type/Network'
import NetworkRow from './NetworkRow'
import { useActiveWeb3React, useAllNetworksWithFilter, useNetworkInfo } from '../../hooks'

const NetworkListWrapper = styled.div`
  padding: 0 0.5rem;
`

interface INetworkList {
  selectedNetwork: Network
  otherNetwork: Network
}

const NetworkList = (props: INetworkList): JSX.Element => {
  const { selectedNetwork, otherNetwork } = props
  const { chainId, library } = useActiveWeb3React()
  const currentNetwork = useNetworkInfo(chainId, library)

  const networks = useAllNetworksWithFilter(currentNetwork?.isTestnet, library)

  const handleSelectNetwork = () => {}

  return (
    <NetworkListWrapper>
      {networks.map(network => {
        return (
          <NetworkRow
            network={network}
            key={network.chainId}
            isSelected={network.chainId === selectedNetwork.chainId}
            isDisabled={network.chainId === otherNetwork.chainId}
            onSelect={handleSelectNetwork}
          />
        )
      })}
    </NetworkListWrapper>
  )
}

export default NetworkList
