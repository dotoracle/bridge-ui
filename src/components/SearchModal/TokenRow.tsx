import styled from 'styled-components'
import Token from '../../type/Token'
import UnknownSVG from '../../assets/images/unknown.svg'

const Row = styled.div`
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto minmax(0px, 72px);
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

  &.disabled {
    cursor: initial;
    opacity: 0.3;
  }
`
const TokenLogo = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 100%;
`
const TokenName = styled.span`
  display: block;
  margin-top: 10px;
  font-size: 12px;
  color: #6c7284;
`

interface ITokenRow {
  token: Token
  isSelected: boolean
  onSelect: () => void
}

const TokenRow = (props: ITokenRow): JSX.Element => {
  const { token, isSelected, onSelect } = props
  return (
    <Row onClick={() => (isSelected ? null : onSelect())} className={isSelected ? 'disabled' : ''}>
      <TokenLogo src={token.logoURI ? token.logoURI : UnknownSVG} alt={token.name} />
      <div>
        <p>{token.symbol}</p>
        <TokenName>{token.name}</TokenName>
      </div>
    </Row>
  )
}

export default TokenRow
