import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import Transaction from '../type/Transaction'

const useAllTransactions = (account?: string, chainId?: number, limit?: number, page?: number): any[] => {
  const [transactions, setTranstractions] = useState<any>([])

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/transactions/${account}/${chainId}`, {
          params: {
            limit,
            page,
          },
          timeout: 20000,
        })

        if (response.status === 200) {
          setTranstractions(response.data)
          console.log(response.data)
        }
      } catch (error) {
        console.error('could not fetch transactions')
      }
    }

    fetchTransactions()
  }, [account, chainId, limit, page])

  return useMemo(() => {
    return transactions
  }, [transactions])
}

export default useAllTransactions
