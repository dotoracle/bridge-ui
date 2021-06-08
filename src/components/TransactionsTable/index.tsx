import { EuiInMemoryTable } from '@elastic/eui'
import styled from 'styled-components'

const TableWrap = styled.div`
  margin-top: 1.5rem;
  border-top: 1px solid #222;
  padding-top: 2rem;
`
const TableTitle = styled.h2`
  margin-bottom: 1.5rem;
  font-family: MarketSans, sans-serif;
  font-size: 18px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #fff;
`

const TransactionsTable = (): JSX.Element => {
  return (
    <TableWrap>
      <TableTitle>Latest Transactions</TableTitle>
      {/* <EuiInMemoryTable></EuiInMemoryTable> */}
    </TableWrap>
  )
}

export default TransactionsTable
