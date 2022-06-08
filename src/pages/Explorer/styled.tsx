import { TableWrap } from 'components/TransactionsTable/styled'
import styled from 'styled-components/macro'

export const BoxWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin: 3rem auto 0;
  border-radius: 40px;
  padding: 2rem;
  width: 100%;
  background-color: #0f0f1e;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.3);
  justify-content: center;
`
export const ExplorerTableWrap = styled(TableWrap)`
  .euiTable {
    .euiTableHeaderCell:nth-child(2),
    .euiTableRowCell:nth-child(2),
    .euiTableHeaderCell:nth-child(7),
    .euiTableRowCell:nth-child(7) {
      display: none;
    }

    .euiTableHeaderCell:nth-child(6),
    .euiTableRowCell:nth-child(6) {
      display: table-cell;
    }
  }
`
