/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from 'react'
import Token from '../type/Token'
import Network from '../type/Network'

type BridgeAppContextType = {
  selectedToken: Token | undefined
  setSelectedToken: (value: Token) => void
  tokenAmount: number
  setTokenAmount: (value: number) => void
  sourceNetwork: Network | undefined
  setSourceNetwork: (value: Network) => void
  targetNetwork: Network | undefined
  setTargetNetwork: (value: Network) => void
  refreshLocal: boolean
  setRefreshLocal: (value: boolean) => void
}

const BridgeAppContext = createContext<BridgeAppContextType>({
  selectedToken: undefined,
  setSelectedToken: () => {},
  tokenAmount: 0,
  setTokenAmount: () => {},
  sourceNetwork: undefined,
  setSourceNetwork: () => {},
  targetNetwork: undefined,
  setTargetNetwork: () => {},
  refreshLocal: false,
  setRefreshLocal: () => {},
})
export default BridgeAppContext
