import { MutableRefObject, useContext } from 'react'
import { FixedSizeList } from 'react-window'
import styled from 'styled-components'
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
  onTokenSelect: (token: Token) => void
  onRemoveCustomToken: (token: Token) => void
}

function TokenList(props: ITokenListProps): JSX.Element {
  const { tokenList, onTokenSelect, onRemoveCustomToken } = props
  const { selectedToken, setSelectedToken } = useContext(BridgeAppContext)

  return (
    <>
      {tokenList.length && (
        <TokenListDiv>
          <div className="eui-yScrollWithShadows">
            {tokenList.map(token => (
              <TokenRow
                key={token.address}
                token={token}
                isSelected={Boolean(token && selectedToken && token.address === selectedToken.address)}
                onSelect={() => {
                  if (token) {
                    onTokenSelect(token)
                    setSelectedToken(token)
                  }
                }}
                onRemoveCustomToken={() => {
                  if (token) {
                    onRemoveCustomToken(token)
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
