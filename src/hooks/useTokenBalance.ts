import { useState, useEffect } from 'react'
import { useTokenContract } from './useContract'
import { toBN } from 'web3-utils'

const useTokenBalance = (
  tokenAddress: string | undefined,
  decimals: number | undefined,
  account: string | null | undefined,
): number => {
  const [balance, setBalance] = useState(0)

  const tokenContract = useTokenContract(tokenAddress)

  try {
    useEffect(() => {
      const fetchData = async () => {
        const _balance = account ? await tokenContract?.methods.balanceOf(account).call() : -1

        if (_balance >= 0 && decimals) {
          const _balanceBN = toBN(_balance).divRound(toBN(1 * 10 ** decimals))
          setBalance(Number(_balanceBN.toString()))
        } else {
          setBalance(_balance)
        }
      }

      if (tokenAddress && decimals && account) {
        fetchData()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenAddress, decimals, account])
  } catch (error) {
    console.error(error)
  }

  return balance
}

export default useTokenBalance
