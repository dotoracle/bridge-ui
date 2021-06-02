import { useCallback, useContext } from 'react'
import { FixedSizeList } from 'react-window'
import TokenRow from './TokenRow'
import Token from '../../type/Token'
import tokens from '../../tokens/tokenlist.json'
import BridgeAppContext from '../../context/BridgeAppContext'

interface ITokenListProps {
  height: number
}

const TokenList = (props: ITokenListProps): JSX.Element => {
  const { height } = props
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
      height={height}
      width="100%"
      itemData={tokens}
      itemCount={tokens.length}
      itemSize={56}
      itemKey={itemKey}
    >
      {Row}
    </FixedSizeList>
  )
}

export default TokenList
