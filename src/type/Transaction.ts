type Transaction = {
  id: string
  fromChainId: number
  index: number
  toChainId: number
  account: string
  amount: string
  originChainId: number
  originSymbol: string
  originToken: string
  requestBlock: number
  requestHash: string
  requestTime: number
}

export default Transaction
