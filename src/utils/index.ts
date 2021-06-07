import Web3 from 'web3'
import { AbiItem, toBN } from 'web3-utils'
import BigNumber from 'bignumber.js'
import { Contract } from 'web3-eth-contract'
import Token from '../type/Token'

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
  // const result = toBN(number.toString()).mul(toBN(1 * 10 ** _decimals))
  const result = new BigNumber(number).multipliedBy(new BigNumber(1 * 10 ** _decimals))
  return result
}
