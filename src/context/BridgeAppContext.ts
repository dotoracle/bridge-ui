/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from 'react'
import Token from '../type/Token'
import Network from '../type/Network'

type BridgeAppContextType = {
  selectedToken: Token | undefined
  setSelectedToken: (value: Token) => void
  sourceNetwork: Network | undefined
  setSourceNetwork: (value: Network) => void
  targetNetwork: Network | undefined
  setTargetNetwork: (value: Network) => void
}

const BridgeAppContext = createContext<BridgeAppContextType>({
  selectedToken: undefined,
  setSelectedToken: () => {},
  sourceNetwork: undefined,
  setSourceNetwork: () => {},
  targetNetwork: undefined,
  setTargetNetwork: () => {},
})
export default BridgeAppContext
