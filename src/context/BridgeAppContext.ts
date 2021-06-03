import { createContext } from 'react'
import Token from '../type/Token'

type BridgeAppContextType = {
  selectedToken: Token | undefined
  setSelectedToken: (value: Token) => void
}

const BridgeAppContext = createContext<BridgeAppContextType>({
  selectedToken: undefined,
  setSelectedToken: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
})
export default BridgeAppContext
