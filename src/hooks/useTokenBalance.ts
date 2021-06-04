import { useState, useEffect } from 'react'
import { useTokenContract } from './useContract'

const useTokenBalance = (tokenAddress: string, account?: string | null | undefined): number => {
  const [balance, setBalance] = useState(0)

  const tokenContract = useTokenContract(tokenAddress)
  try {
    useEffect(() => {
      const fetchData = async () => {
        const _balance = account ? await tokenContract?.methods.balanceOf(account).call() : -1
        setBalance(_balance)
      }

      fetchData()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenAddress, account])
  } catch (error) {
    console.error(error)
  }

  return balance
}

export default useTokenBalance
