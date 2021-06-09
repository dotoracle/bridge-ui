type Network = {
  name: string
  chainId: number
  logoURI: string
  explorer: string
  rpcURL: string
  isTestnet: boolean
  bridge: string
  firstBlockCrawl: number
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
}

export default Network
