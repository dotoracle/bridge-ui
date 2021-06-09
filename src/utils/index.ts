/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import BigNumber from 'bignumber.js'
import { Contract } from 'web3-eth-contract'
import networks from '../config/networks.json'
import Token from '../type/Token'
import Network from '../type/Network'
import Transaction from '../type/Transaction'

export const getContract = (address: string, abi: AbiItem, web3: Web3): Contract | null => {
  try {
    return new web3.eth.Contract(abi, address)
  } catch (error) {
    console.error('Failed to get contract', error)
    return null
  }
}

export const getTokensFromConfig = async (chainId: number): Promise<Token[]> => {
  const tokens: Token[] = []

  try {
    if (chainId) {
      const response = (await import(`../config/${chainId}.json`)).default as Token[]

      response.forEach(t => {
        tokens.push({
          name: t.name,
          address: t.address,
          symbol: t.symbol,
          decimals: t.decimals,
          logoURI: t.logoURI,
        })
      })
    }
  } catch (error) {
    console.error(error)
  }
  return tokens
}

export const formatNumber = (number: number): string => {
  const seps = number.toString().split('.')
  seps[0] = seps[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return seps.join('.')
}

export const fromWei = (number: string | number, decimals?: number): BigNumber => {
  const _decimals = decimals ? decimals : 18
  // const result = toBN(number).divRound(toBN(1 * 10 ** _decimals))
  const result = new BigNumber(number).div(new BigNumber(1 * 10 ** _decimals))
  return result
}

export const toWei = (number: string | number, decimals?: number): BigNumber => {
  const _decimals = decimals ? decimals : 18
  const result = new BigNumber(number).multipliedBy(new BigNumber(1 * 10 ** _decimals))
  return result
}

export const parseResponseToTransactions = (response: any) => {
  const transactions = [] as Transaction[]

  if (response.status === 200 && response.data.transactions && response.data.total) {
    response.data.transactions.forEach((t: Transaction) => {
      const fromNetwork = networks.find(n => n.chainId === t.fromChainId) as Network
      const toNetwork = networks.find(n => n.chainId === t.toChainId) as Network
      const originNetwork = networks.find(n => n.chainId === t.originChainId) as Network
      const amountFormated = `${formatNumber(fromWei(t.amount).toNumber())} ${t.originSymbol}`

      const requestEllipsis = `${t.requestHash.substring(0, 8)}...${t.requestHash.substring(t.requestHash.length - 5)}`
      const requestHashUrl = fromNetwork ? `${fromNetwork.explorer}/tx/${t.requestHash}` : ''

      const claimEllipsis = t.claimHash
        ? `${t.claimHash.substring(0, 8)}...${t.claimHash.substring(t.claimHash.length - 5)}`
        : ''
      const claimHashUrl = toNetwork ? `${toNetwork.explorer}/tx/${t.claimHash}` : ''

      transactions.push({
        ...t,
        fromNetwork,
        toNetwork,
        originNetwork,
        amountFormated,
        requestHashLink: {
          explorerLogo: fromNetwork ? fromNetwork.logoURI : '',
          requestHash: requestEllipsis,
          requestHashUrl,
        },
        claimHashLink: {
          explorerLogo: toNetwork ? toNetwork.logoURI : '',
          claimHash: claimEllipsis,
          claimHashUrl,
        },
      })
    })
  }

  return transactions
}

interface WindowChain {
  ethereum?: {
    isMetaMask?: true
    request?: (...args: any[]) => void
  }
}

export const setupNetwork = async (network: Network): Promise<boolean> => {
  const provider = (window as WindowChain).ethereum

  if (provider) {
    try {
      // @ts-ignore
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${network.chainId.toString(16)}`,
            chainName: network.name,
            nativeCurrency: {
              name: 'BNB',
              symbol: 'bnb',
              decimals: 18,
            },
            rpcUrls: [network.rpcURL],
            blockExplorerUrls: [network.explorer],
          },
        ],
      })
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  } else {
    console.error("Can't setup the BSC network on metamask because window.ethereum is undefined")
    return false
  }
}
