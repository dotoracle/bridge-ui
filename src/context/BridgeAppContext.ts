import { createContext } from 'react'
import Token from '../type/Token'

type BridgeAppContextType = {
  token: Token | undefined
  setToken: (value: Token) => void
}

const BridgeAppContext = createContext<BridgeAppContextType>({
  token: undefined,
  setToken: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
})
export default BridgeAppContext
