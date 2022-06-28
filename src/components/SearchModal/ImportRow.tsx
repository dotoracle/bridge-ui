import { EuiButton } from '@elastic/eui'
import styled from 'styled-components/macro'
import Token from '../../type/Token'
import UnknownSVG from '../../assets/images/unknown.svg'
import { useIsUserAddedToken } from '../../hooks'

const Row = styled.div`
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto 2fr;
  gap: 16px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 5px 15px;
  min-height: 56px;
  cursor: pointer;

  &:hover {
    background-color: #2c2f36;
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
const AddTokenButton = styled.div`
  text-align: right;
`
interface IImportRow {
  token: Token
  onAddCustomToken: () => void
}

function ImportRow(props: IImportRow): JSX.Element {
  const { token, onAddCustomToken } = props

  // check if already added on local storage tokens
  const isAdded = useIsUserAddedToken(token)

  return (
    <Row>
      <TokenLogo src={token.logoURI ? token.logoURI : UnknownSVG} alt={token.name} />
      <div>
        <p>{token.symbol}</p>
        <TokenName>{token.name}</TokenName>
      </div>
      <div>&nbsp;</div>
      {!isAdded && (
        <AddTokenButton>
          <EuiButton size="s" onClick={onAddCustomToken}>
            Add To List
          </EuiButton>
        </AddTokenButton>
      )}
    </Row>
  )
}

export default ImportRow
