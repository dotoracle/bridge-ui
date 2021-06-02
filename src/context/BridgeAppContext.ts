import { createContext } from 'react'
import Token from '../type/Token'
import tokens from '../tokens/tokenlist.json'

type BridgeAppContextType = {
  token: Token
  setToken: (value: Token) => void
}

const BridgeAppContext = createContext<BridgeAppContextType>({
  token: tokens[0],
  setToken: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
})
export default BridgeAppContext
