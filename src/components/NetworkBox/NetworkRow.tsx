import { EuiIcon } from '@elastic/eui'
import styled from 'styled-components'
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
  margin-left: 0.75rem;
`

interface INetworkRowProps {
  network: Network
  isSelected: boolean
  isDisabled: boolean
  onSelect: () => void
}

const NetworkRow = (props: INetworkRowProps): JSX.Element => {
  const { network, isSelected, isDisabled, onSelect } = props

  return (
    <Row className={isDisabled ? 'is-disabled' : ''}>
      <div>
        <NetworkLogo
          src={network.logoURI ? network.logoURI : UnknownSVG}
          alt={network.name}
          onClick={() => (isSelected || isDisabled ? null : onSelect())}
        />
        <NetworkName>{network.name}</NetworkName>
      </div>
      {isSelected && <CheckIcon type="check" />}
    </Row>
  )
}

export default NetworkRow
