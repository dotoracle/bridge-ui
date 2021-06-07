import { useState, useEffect, useMemo } from 'react'
import { fromWei } from '../utils'
import { useTokenContract } from './useContract'

const useTokenBalance = (
  tokenAddress: string | undefined,
  decimals: number | undefined,
  account: string | null | undefined,
  tokenAmount?: number,
): number => {
  const [balance, setBalance] = useState(0)

  const tokenContract = useTokenContract(tokenAddress)

  try {
    useEffect(() => {
      const fetchData = async () => {
        const _balance = account ? await tokenContract?.methods.balanceOf(account).call() : -1

        if (_balance >= 0 && decimals) {
          const _balanceBN = fromWei(_balance, decimals)
          setBalance(Number(_balanceBN.toString()))
        } else {
          setBalance(_balance)
        }
      }

      if (tokenAddress && decimals && account) {
        fetchData()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenAddress, decimals, account, tokenAmount])
  } catch (error) {
    console.error(error)
  }

  return useMemo(() => {
    return balance
  }, [balance])
}

export default useTokenBalance
