import styled from 'styled-components/macro'
import Network from '../../type/Network'
import UnknownSVG from '../../assets/images/unknown.svg'

const Row = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) minmax(0px, 72px);
  gap: 16px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 5px 15px;
  height: 56px;
  cursor: pointer;

  &:hover {
    background-color: #2c2f36;
  }

  &.selected {
    cursor: initial;
  }
`
const NetworkLogo = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 100%;
`
const NetworkNameWrap = styled.div`
  display: flex;
  align-items: center;
`
const NetworkName = styled.span`
  display: block;

  a {
    text-decoration: underline;
    color: #6c7284;

    &:hover {
      color: #fff;
    }
  }
`

const ActiveDot = styled.span`
  display: inline-block;
  margin-right: 0.5rem;
  border-radius: 100%;
  width: 8px;
  height: 8px;
  background-color: #27ae60;
`

interface INetworkRow {
  network: Network
  isSelected: boolean
  onSelect: () => void
}

function NetworkRow(props: INetworkRow): JSX.Element {
  const { network, isSelected, onSelect } = props

  return (
    <Row className={isSelected ? 'selected' : ''} onClick={() => (isSelected ? null : onSelect())}>
      <NetworkLogo src={network.logoURI ? network.logoURI : UnknownSVG} alt={network.name} />
      <NetworkNameWrap className="network-name-wrap">
        {isSelected && <ActiveDot />}
        <NetworkName>{network.name}</NetworkName>
      </NetworkNameWrap>
    </Row>
  )
}

export default NetworkRow
