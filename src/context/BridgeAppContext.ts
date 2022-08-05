/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from 'react'
import Token from '../type/Token'
import Network from '../type/Network'
import AppEth from '@ledgerhq/hw-app-eth'

type BridgeAppContextType = {
  selectedToken: Token | undefined
  setSelectedToken: (value: Token | undefined) => void
  tokenAmount: number
  setTokenAmount: (value: number) => void
  sourceNetwork: Network | undefined
  setSourceNetwork: (value: Network) => void
  targetNetwork: Network | undefined
  setTargetNetwork: (value: Network) => void
  ledgerAddress: string
  setLedgerAddress: (value: string) => void
  ledgerPath: string
  setLedgerPath: (value: string) => void
  appEth: AppEth | undefined
  setAppEth: (value: AppEth) => void
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
  ledgerAddress: '',
  setLedgerAddress: () => {},
  ledgerPath: '',
  setLedgerPath: () => {},
  appEth: undefined,
  setAppEth: () => {},
})
export default BridgeAppContext
