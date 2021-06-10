import Network from './Network'

type Transaction = {
  _id: string
  fromNetwork: Network | undefined
  fromChainId: number
  index: number
  toNetwork: Network | undefined
  toChainId: number
  account: string
  amount: string
  amountFormated: string
  originChainId: number
  originNetwork: Network | undefined
  originSymbol: string
  originToken: string
  requestBlock: number
  requestHash: string
  requestHashLink: { networkName: string; explorerLogo: string; requestHash: string; requestHashUrl: string }
  requestTime: number
  claimBlock: number
  claimHash: string
  claimHashLink: { networkName: string; explorerLogo: string; claimHash: string; claimHashUrl: string }
  claimId: string
  claimed: boolean
}

export default Transaction
