import BridgeAppContext from 'context/BridgeAppContext'
import { useMemo, useState, useEffect, useContext } from 'react'
// import { getTokensFromConfig } from 'utils'
import { Contract } from 'web3-eth-contract'
import Token from '../type/Token'
import { useTokenContract } from './useContract'
import { useActiveWeb3React } from './useWeb3'

// undefined if invalid or does not exist
// otherwise returns the token
const getTokenInfo = async (tokenContract: Contract | null): Promise<Token | undefined> => {
  try {
    const tokenName = await tokenContract?.methods.name().call()
    const symbol = await tokenContract?.methods.symbol().call()
    const decimals = await tokenContract?.methods.decimals().call()

    if (!decimals || !symbol || !tokenName) return undefined

    return {
      name: tokenName,
      symbol,
      decimals: Number(decimals),
      logoURI: '',
    } as Token
  } catch (error) {
    return undefined
  }
}

// export const useToken = (chainId: number, tokenAddress?: string): Token | undefined => {
export const useToken = (tokenAddress?: string): Token | undefined => {
  const [tokenInfo, setTokenInfo] = useState<Token>()

  const tokenContract = useTokenContract(tokenAddress)

  useEffect(() => {
    const fetchData = async () => {
      const result = await getTokenInfo(tokenContract)
      setTokenInfo(result)
      // const tokens = await getTokensFromConfig(chainId)
      // const _token = tokens.find(t => t.address === tokenAddress)

      // if (_token) {
      //   setTokenInfo(_token)
      // }
    }

    fetchData()
  }, [tokenAddress, tokenContract])

  return useMemo(() => {
    if (!tokenInfo) return undefined

    return {
      ...tokenInfo,
      address: tokenAddress,
    } as Token
  }, [tokenAddress, tokenInfo])
}

export const useIsUserAddedToken = (token: Token): boolean => {
  const { sourceNetwork, ledgerAddress } = useContext(BridgeAppContext)
  const { account: web3Account, chainId: web3ChainId } = useActiveWeb3React()

  const account = ledgerAddress !== '' ? ledgerAddress : web3Account
  const chainId = ledgerAddress !== '' ? sourceNetwork?.chainId : web3ChainId

  const data = localStorage.getItem(`tokens_${account}_${chainId}`)

  if (!data) {
    return false
  }

  const tokens = JSON.parse(data) as Token[]
  return !!tokens.find(t => t.address === token.address)
}
