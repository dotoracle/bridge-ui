/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from 'react'
import Token from '../type/Token'
import Network from '../type/Network'

type BridgeAppContextType = {
  selectedToken: Token | undefined
  setSelectedToken: (value: Token) => void
  fromNetwork: Network | undefined
  setFromNetwork: (value: Network) => void
  toNetwork: Network | undefined
  setToNetwork: (value: Network) => void
}

const BridgeAppContext = createContext<BridgeAppContextType>({
  selectedToken: undefined,
  setSelectedToken: () => {},
  fromNetwork: undefined,
  setFromNetwork: () => {},
  toNetwork: undefined,
  setToNetwork: () => {},
})
export default BridgeAppContext
