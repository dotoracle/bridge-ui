type Token = {
  name: string
  address: string
  originContractAddress?: string
  contractHash?: string
  symbol: string
  decimals: number
  logoURI: string
  minBridge?: string
}

export default Token
