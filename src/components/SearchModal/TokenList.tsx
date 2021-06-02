import { MutableRefObject, useCallback, useContext } from 'react'
import { FixedSizeList } from 'react-window'
import TokenRow from './TokenRow'
import Token from '../../type/Token'
import BridgeAppContext from '../../context/BridgeAppContext'

interface ITokenListProps {
  height: number
  tokenList: Token[]
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
}

const TokenList = (props: ITokenListProps): JSX.Element => {
  const { height, tokenList, fixedListRef } = props
  const { token: selectedToken } = useContext(BridgeAppContext)

  const itemKey = useCallback((index: number, data: Token[]) => {
    const token = data[index]
    return token.address
  }, [])

  const Row = useCallback(
    ({ data, index }) => {
      const token: Token = data[index]
      const isSelected = Boolean(token && selectedToken && token.address === selectedToken.address)

      return <TokenRow token={token} isSelected={isSelected} />
    },
    [selectedToken],
  ) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <FixedSizeList
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
