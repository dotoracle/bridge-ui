/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from 'react'
import Token from '../type/Token'
import Network from '../type/Network'
import EthApp from '@ledgerhq/hw-app-eth'
import CasperApp from '@zondax/ledger-casper'

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
  ledgerApp: EthApp | CasperApp | undefined
  setLedgerApp: (value: EthApp | CasperApp) => void
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
  ledgerApp: undefined,
  setLedgerApp: () => {},
})
export default BridgeAppContext
