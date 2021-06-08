import styled from 'styled-components'

const TableTitle = styled.h2`
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  border-top: 1px solid #222;
  padding-top: 2rem;
  font-family: MarketSans, sans-serif;
  font-size: 18px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #fff;
`

const TransactionsTable = (): JSX.Element => {
  return <TableTitle>Latest Transactions</TableTitle>
}

export default TransactionsTable
