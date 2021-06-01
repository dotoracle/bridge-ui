import { Currency, CurrencyAmount, Token } from '@uniswap/sdk-core'
import { FixedSizeList } from 'react-window'

function currencyKey(currency: Currency): string {
  return currency.isToken ? currency.address : 'ETHER'
}

const TokenList = (): JSX.Element => {
  return <div></div>
}

export default TokenList
