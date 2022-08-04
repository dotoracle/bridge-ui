import Container from 'components/Container'
import BridgeAppContext from 'context/BridgeAppContext'
import { useActiveWeb3React, useNetworkInfo } from 'hooks'
import { useTxnHistory } from 'hooks'
import { useContext, useEffect, useState } from 'react'
import { Title, TitleShadow, TitleWrapper } from 'styled'
import Transaction from 'type/Transaction'
import { parseResponseToTransactionsAllChain } from 'utils'
import HistoryTable from './HistoryTable'
import { BoxWrap } from './styled'

function Explorer(): JSX.Element {
  const { sourceNetwork, ledgerAddress } = useContext(BridgeAppContext)
  const { chainId: web3ChainId } = useActiveWeb3React()
  const chainId = ledgerAddress !== '' ? sourceNetwork?.chainId : web3ChainId

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
