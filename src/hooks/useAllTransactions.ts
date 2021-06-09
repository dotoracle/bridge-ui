/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react'
import axios from 'axios'

const useAllTransactions = (
  account?: string | null | undefined,
  chainId?: number,
  limit?: number,
  page?: number,
): (() => Promise<any>) => {
  const callback = useCallback(async (): Promise<any> => {
    try {
      if (!account) {
        throw 'missing account'
      }

      if (!chainId) {
        throw 'no chain id'
      }

      return axios.get(`${process.env.REACT_APP_API_URL}/transactions/${account.toLowerCase()}/${chainId}`, {
        params: {
          limit: limit ?? 20,
          page: page ?? 1,
        },
        timeout: 20000,
      })
    } catch (error) {
      console.error(error)
      return []
    }
  }, [account, chainId, limit, page])

  return callback
}

export default useAllTransactions
