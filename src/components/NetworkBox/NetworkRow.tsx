import { EuiIcon } from '@elastic/eui'
import styled from 'styled-components/macro'
import Network from '../../type/Network'
import UnknownSVG from '../../assets/images/unknown.svg'

const Row = styled.div`
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
const NetworkNameWrap = styled.div`
  display: flex;
  align-items: center;
`
const NetworkLogo = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 0.5rem;
`
const NetworkName = styled.span`
  font-size: 0.8rem;
  line-height: 1.5;
`
const CheckIcon = styled(EuiIcon)`
  margin-left: 0.75rem;
`

interface INetworkRowProps {
  network: Network
  isSelected: boolean
  isDisabled: boolean
  onSelect: () => void
}

function NetworkRow(props: INetworkRowProps): JSX.Element {
  const { network, isSelected, isDisabled, onSelect } = props

  return (
    <Row className={isDisabled ? 'is-disabled' : ''} onClick={() => (isSelected || isDisabled ? null : onSelect())}>
      <NetworkNameWrap>
        <NetworkLogo src={network.logoURI ? network.logoURI : UnknownSVG} alt={network.name} />
        <NetworkName>{network.name}</NetworkName>
      </NetworkNameWrap>
      {isSelected && <CheckIcon type="check" />}
    </Row>
  )
}

export default NetworkRow
