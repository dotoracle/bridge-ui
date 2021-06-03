import { useMemo, useState, useEffect } from 'react'
import { Contract } from 'web3-eth-contract'
import Token from '../type/Token'
import { useTokenContract } from './useContract'

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
      decimals,
      logoURI: '',
    } as Token
  } catch (error) {
    return undefined
  }
}

export function useToken(tokenAddress?: string): Token | undefined {
  const [tokenInfo, setTokenInfo] = useState<Token>()

  const tokenContract = useTokenContract(tokenAddress)

  useEffect(() => {
    const fetchData = async () => {
      const result = await getTokenInfo(tokenContract)
      setTokenInfo(result)
    }

    fetchData()
  }, [tokenAddress, tokenContract])

  return useMemo(() => {
    if (!tokenInfo) return undefined

    return {
      ...tokenInfo,
      address: tokenAddress,
    } as Token
  }, [tokenAddress, tokenInfo]) // eslint-disable-line react-hooks/exhaustive-deps
}
