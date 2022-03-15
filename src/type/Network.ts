type Network = {
  name: string
  key?: string
  chainId: number
  logoURI: string
  explorer: string
  txUrl: string
  rpcURL: string
  eventStream?: string
  isTestnet: boolean
  bridge: string
  firstBlockCrawl: number
  notEVM: boolean
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  confirmations: number
  blockTime: number
}

export default Network
