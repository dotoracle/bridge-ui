import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import Network from '../type/Network'
import Transaction from '../type/Transaction'
import networks from '../config/networks.json'
import { formatNumber, fromWei } from '../utils'

const useAllTransactions = (
  account?: string | null | undefined,
  chainId?: number,
  limit?: number,
  page?: number,
): [number, Transaction[]] => {
  const [transactions, setTranstractions] = useState<Transaction[]>([])
  const [totalTxs, setTotalTxs] = useState(0)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (account && chainId) {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/transactions/${account.toLowerCase()}/${chainId}`,
            {
              params: {
                limit: limit ? limit : 20,
                page: page ? page : 1,
              },
              timeout: 20000,
            },
          )

          if (response.status === 200 && response.data.transactions && response.data.total) {
            const _transactions = [] as Transaction[]

            response.data.transactions.forEach((t: Transaction) => {
              const fromNetwork = networks.find(n => n.chainId === t.fromChainId) as Network
              const toNetwork = networks.find(n => n.chainId === t.toChainId) as Network
              const amountFormated = `${formatNumber(fromWei(t.amount).toNumber())} ${t.originSymbol}`

              const requestEllipsis = `${t.requestHash.substring(0, 8)}...${t.requestHash.substring(
                t.requestHash.length - 5,
              )}`
              const requestHashUrl = fromNetwork ? `${fromNetwork.explorer}/tx/${t.requestHash}` : ''

              const claimEllipsis = t.claimHash
                ? `${t.claimHash.substring(0, 8)}...${t.claimHash.substring(t.claimHash.length - 5)}`
                : ''
              const claimHashUrl = toNetwork ? `${toNetwork.explorer}/tx/${t.claimHash}` : ''

              _transactions.push({
                ...t,
                fromNetwork,
                toNetwork,
                amountFormated,
                requestHashLink: {
                  explorerLogo: fromNetwork ? fromNetwork.logoURI : '',
                  requestHash: requestEllipsis,
                  requestHashUrl,
                },
                claimHashLink: {
                  explorerLogo: toNetwork ? toNetwork.logoURI : '',
                  claimHash: claimEllipsis,
                  claimHashUrl,
                },
              })
            })
            setTranstractions(_transactions)
            setTotalTxs(response.data.total)
          }
        }
      } catch (error) {
        console.error('could not fetch transactions', error)
      }
    }

    fetchTransactions()
  }, [account, chainId, limit, page])

  return useMemo(() => {
    return [totalTxs, transactions]
  }, [totalTxs, transactions])
}

export default useAllTransactions
