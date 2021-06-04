import { EuiIcon } from '@elastic/eui'
import styled from 'styled-components'
import Network from '../../type/Network'
import { useActiveWeb3React, useAllNetworksWithFilter, useNetworkInfo } from '../../hooks'
import UnknownSVG from '../../assets/images/unknown.svg'

const NetworkListWrapper = styled.div`
  padding: 0 0.5rem;
`
const NetworkRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #333;
  cursor: pointer;

  &:last-child {
    padding-bottom: 0.5rem;
    border: 0;
  }

  &.is-disabled {
    opacity: 0.5;
    cursor: initial;
  }
`
const NetworkLogo = styled.img`
  display: inline-block;
  vertical-align: middle;
  width: 24px;
  height: 24px;
  margin-right: 0.5rem;
`
const NetworkName = styled.span`
  display: inline-block;
  vertical-align: middle;
  font-size: 0.8rem;
`
const CheckIcon = styled(EuiIcon)`
  color: ${props => props.theme.primary};
  margin-left: 0.75rem;
`

interface INetworkList {
  selectedNetwork: Network
}

const NetworkList = (props: INetworkList): JSX.Element => {
  const { selectedNetwork } = props
  const { chainId, library } = useActiveWeb3React()
  const currentNetwork = useNetworkInfo(chainId, library)

  const networks = useAllNetworksWithFilter(currentNetwork?.isTestnet, library)

  const onSelectNetwork = () => {}

  return (
    <NetworkListWrapper>
      {networks.map(network => {
        return (
          <NetworkRow
            key={network.chainId}
            className={selectedNetwork.chainId === network.chainId ? 'is-selected' : ''}
            onClick={onSelectNetwork}
          >
            <div>
              <NetworkLogo src={network.logoURI ? network.logoURI : UnknownSVG} alt={network.name} />
              <NetworkName>{network.name}</NetworkName>
            </div>
            {selectedNetwork.chainId === network.chainId && <CheckIcon type="check" color="red" />}
          </NetworkRow>
        )
      })}
    </NetworkListWrapper>
  )
}

export default NetworkList
