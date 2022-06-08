import Container from 'components/Container'
import { useActiveWeb3React, useNetworkInfo } from 'hooks'
import { useTxnHistory } from 'hooks'
import { useEffect, useState } from 'react'
import { Title, TitleShadow, TitleWrapper } from 'styled'
import Transaction from 'type/Transaction'
import { parseResponseToTransactionsAllChain } from 'utils'
import HistoryTable from './HistoryTable'
import { BoxWrap } from './styled'

function Explorer(): JSX.Element {
  const { chainId } = useActiveWeb3React()
  const currentNetwork = useNetworkInfo(chainId)
  const { data: response, error } = useTxnHistory()
  const [transactions, setTranstractions] = useState<Transaction[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const _txns = await parseResponseToTransactionsAllChain(response, currentNetwork?.isTestnet)
      setTranstractions(_txns)
    }

    fetchData()
  }, [response])

  return (
    <>
      <TitleWrapper>
        <Title>Explorer</Title>
        <TitleShadow>Explorer</TitleShadow>
      </TitleWrapper>
      <Container>
        <BoxWrap>{error ? <span>Failed to load data</span> : <HistoryTable transactions={transactions} />}</BoxWrap>
      </Container>
    </>
  )
}

export default Explorer
