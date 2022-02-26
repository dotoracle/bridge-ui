type Network = {
  name: string
  chainId: number
  logoURI: string
  explorer: string
  txUrl: string
  rpcURL: string
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
