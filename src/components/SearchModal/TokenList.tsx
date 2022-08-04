import { MutableRefObject, useContext } from 'react'
import { FixedSizeList } from 'react-window'
import styled from 'styled-components/macro'
import TokenRow from './TokenRow'
import Token from '../../type/Token'
import BridgeAppContext from '../../context/BridgeAppContext'

const TokenListDiv = styled.div`
  height: 280px;
  overflow: hidden;
`

interface ITokenListProps {
  tokenList: Token[]
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  onSelectToken: (token: Token) => void
  onRemoveCustomToken: (token: Token) => void
}

function TokenList(props: ITokenListProps): JSX.Element {
  const { tokenList, onSelectToken, onRemoveCustomToken } = props
  const { selectedToken, setSelectedToken, setTokenAmount } = useContext(BridgeAppContext)

  return (
    <>
      {tokenList.length > 0 && (
        <TokenListDiv>
          <div className="eui-yScrollWithShadows">
            {tokenList.map(token => (
              <TokenRow
                key={token.address}
                token={token}
                isSelected={Boolean(token && selectedToken && token.address === selectedToken.address)}
                onSelect={() => {
                  if (token) {
                    onSelectToken(token)
                    setTokenAmount(0)
                    setSelectedToken(token)
                  }
                }}
                onRemoveCustomToken={() => {
                  if (token) {
                    onRemoveCustomToken(token)
                    setTokenAmount(0)
                    setSelectedToken(undefined)
                  }
                }}
              />
            ))}
          </div>
        </TokenListDiv>
      )}
    </>
  )
}

export default TokenList
