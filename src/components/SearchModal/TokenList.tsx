import { MutableRefObject, useCallback, useContext } from 'react'
import { FixedSizeList } from 'react-window'
import TokenRow from './TokenRow'
import Token from '../../type/Token'
import BridgeAppContext from '../../context/BridgeAppContext'

interface ITokenListProps {
  height: number
  tokenList: Token[]
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  onTokenSelect: (token: Token) => void
}

const TokenList = (props: ITokenListProps): JSX.Element => {
  const { height, tokenList, fixedListRef, onTokenSelect } = props
  const { selectedToken, setSelectedToken } = useContext(BridgeAppContext)

  const itemKey = useCallback((index: number, data: Token[]) => {
    const token = data[index]
    return token.address
  }, [])

  const Row = useCallback(
    ({ data, index }) => {
      const token: Token = data[index]

      const isSelected = Boolean(token && selectedToken && token.address === selectedToken.address)
      const handleSelect = () => {
        if (token) {
          onTokenSelect(token)
          setSelectedToken(token)
        }
      }

      return <TokenRow token={token} isSelected={isSelected} onSelect={handleSelect} />
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedToken],
  )

  return (
    <FixedSizeList
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={fixedListRef as any}
      height={height}
      width="100%"
      itemData={tokenList}
      itemCount={tokenList.length}
      itemSize={56}
      itemKey={itemKey}
    >
      {Row}
    </FixedSizeList>
  )
}

export default TokenList
