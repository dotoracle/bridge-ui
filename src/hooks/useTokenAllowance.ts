import { useState, useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import Token from '../type/Token'
import { useTokenContract } from './useContract'

const useTokenAllowance = (token?: Token, owner?: string, spender?: string): BigNumber | undefined => {
  const [allowance, setAllowance] = useState<BigNumber>(new BigNumber(0))
  const tokenContract = useTokenContract(token?.address)

  const fetchAllowance = async () => {
    try {
      if (tokenContract) {
        const _allowance = await tokenContract.methods.allowance(owner, spender).call()
        const _allowanceBN = new BigNumber(_allowance)
        setAllowance(_allowanceBN)
      }
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    fetchAllowance()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return useMemo(() => {
    return allowance
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, allowance])
}

export default useTokenAllowance
