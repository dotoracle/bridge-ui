import { useState, useEffect, useMemo } from 'react'
import BN from 'bn.js'
import Token from '../type/Token'
import { useTokenContract } from './useContract'

const useTokenAllowance = (token?: Token, owner?: string, spender?: string): BN | undefined => {
  const [allowance, setAllowance] = useState<BN>(new BN(0))
  const tokenContract = useTokenContract(token?.address)

  const fetchAllowance = async () => {
    try {
      if (tokenContract) {
        const _allowance = await tokenContract.methods.allowance(owner, spender).call()
        const _allowanceBN = new BN(_allowance)
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
