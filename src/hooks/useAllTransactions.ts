/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import useSWR from 'swr'

export const useAllTransactions = (account?: string | null | undefined, chainId?: number, limit?: number): any => {
  const fetcher = (url: string) => axios.get(url).then(res => res.data)
  const { data, error } = useSWR(
    account && chainId
      ? `${process.env.REACT_APP_API_URL}/transactions/${account.toLowerCase()}/${chainId}?limit=${limit ?? 20}`
      : null,
    fetcher,
    {
      refreshInterval: 60000,
      refreshWhenHidden: true,
    },
  )
  return { data, error }
}
