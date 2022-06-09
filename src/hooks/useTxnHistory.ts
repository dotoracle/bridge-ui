/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import useSWR from 'swr'

export const useTxnHistory = (): any => {
  const fetcher = (url: string) => axios.get(url).then(res => res.data)
  const { data, error } = useSWR(`${process.env.REACT_APP_API_URL}/history?limit=50&page=1`, fetcher, {
    refreshInterval: 60000,
    refreshWhenHidden: true,
  })
  return { data, error }
}
