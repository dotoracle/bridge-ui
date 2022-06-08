/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { EuiBasicTableColumn, EuiHealth, EuiInMemoryTable, EuiToolTip, Pagination, Search } from '@elastic/eui'
import { formatDistanceToNow, lightFormat, toDate } from 'date-fns'
import NetworkInfo from 'components/TransactionsTable/NetworkInfo'
import { ExplorerLogo, FakeLink, Link, StyledSpan, Wrapper } from 'components/TransactionsTable/styled'
import { useActiveWeb3React, useAllNetworks, useNetworkInfo } from 'hooks'
import Network from 'type/Network'
import Transaction from 'type/Transaction'
import UnknownSVG from 'assets/images/unknown.svg'
import { ExplorerTableWrap } from './styled'

interface HistoryTableProps {
  transactions: Transaction[]
}

function HistoryTable(props: HistoryTableProps): JSX.Element {
  const { transactions } = props
  const { chainId: currentChainId } = useActiveWeb3React()
  const currentNetwork = useNetworkInfo(currentChainId)

  const columns: EuiBasicTableColumn<any>[] = [
    {
      field: 'requestTime',
      name: 'Request Time',
      sortable: true,
      width: '15%',
      render: function (time: number): JSX.Element {
        return (
          <EuiToolTip content={lightFormat(toDate(time * 1000), 'yyyy-MM-dd HH:mm:ss')}>
            <StyledSpan>{formatDistanceToNow(time * 1000, { addSuffix: true })}</StyledSpan>
          </EuiToolTip>
        )
      },
    },
    {
      field: 'fromChainId',
      name: 'From Chain Id',
    },
    {
      field: 'tokenSymbol',
      name: 'Token',
      width: '10%',
      render: function (tokenSymbol: string): JSX.Element {
        return <StyledSpan>{tokenSymbol}</StyledSpan>
      },
    },
    {
      field: 'requestHashLink',
      name: 'Request Tx',
      width: '20%',
      render: function ({
        networkName,
        explorerLogo,
        requestHash,
        requestHashUrl,
      }: {
        networkName: string
        explorerLogo: string
        requestHash: string
        requestHashUrl: string
      }): JSX.Element {
        return (
          <EuiToolTip content={networkName}>
            <Wrapper>
              <ExplorerLogo src={explorerLogo ? explorerLogo : UnknownSVG} alt="explorer-logo" />
              <Link href={requestHashUrl} target="__blank" rel="noopener nofollow noreferrer">
                {requestHash}
              </Link>
            </Wrapper>
          </EuiToolTip>
        )
      },
    },
    {
      field: 'amountFormated',
      name: 'Amount',
      width: '20%',
      sortable: true,
      render: function (amountFormated: string): JSX.Element {
        return <StyledSpan>{amountFormated}</StyledSpan>
      },
    },
    {
      field: 'claimHashLink',
      name: 'Claim Tx',
      width: '20%',
      render: function ({
        networkName,
        explorerLogo,
        claimHash,
        claimHashUrl,
      }: {
        networkName: string
        explorerLogo: string
        claimHash: string
        claimHashUrl: string
      }): JSX.Element {
        return (
          <EuiToolTip content={networkName}>
            <Wrapper>
              {claimHash && <ExplorerLogo src={explorerLogo ? explorerLogo : UnknownSVG} alt="explorer-logo" />}
              {claimHashUrl ? (
                <Link href={claimHashUrl} target="__blank" rel="noopener nofollow noreferrer">
                  {claimHash}
                </Link>
              ) : (
                <FakeLink>{claimHash}</FakeLink>
              )}
            </Wrapper>
          </EuiToolTip>
        )
      },
    },
    {
      field: 'toChainId',
      name: 'To Chain Id',
    },
    {
      field: 'claimed',
      name: 'Status',
      width: '15%',
      render: function (claimed: boolean): JSX.Element {
        const color = claimed ? 'success' : 'warning'
        const label = claimed ? 'Success' : 'Pending'
        return <EuiHealth color={color}>{label}</EuiHealth>
      },
    },
  ]

  // pagination
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const pagination = {
    pageIndex,
    pageSize,
    totalItemCount: 5,
    pageSizeOptions: [20, 50, 100],
  } as Pagination

  // Sorting
  const [sortField, setSortField] = useState('requestTime')
  const [sortDirection, setSortDirection] = useState('desc')

  const sorting = {
    sort: {
      field: sortField,
      direction: sortDirection,
    },
  }

  // Search
  const networks = useAllNetworks(currentNetwork?.isTestnet)

  const search = {
    box: {
      incremental: true,
      schema: true,
      placeholder: 'Enter the transaction hash...',
    },
    filters: [
      {
        type: 'field_value_selection',
        field: 'claimed',
        name: 'Pending',
        multiSelect: false,
        options: [
          {
            value: true,
            name: 'Success',
            view: <EuiHealth color="success">Success</EuiHealth>,
          },
          {
            value: false,
            name: 'Pending',
            view: <EuiHealth color="warning">Pending</EuiHealth>,
          },
        ],
      },
      {
        type: 'field_value_selection',
        field: 'fromChainId',
        name: 'From Network',
        multiSelect: false,
        options: networks.map((network: Network) => ({
          value: network.chainId,
          name: network.name,
          view: <NetworkInfo network={network} />,
        })),
      },
      {
        type: 'field_value_selection',
        field: 'toChainId',
        name: 'To Network',
        multiSelect: false,
        options: networks.map((network: Network) => ({
          value: network.chainId,
          name: network.name,
          view: <NetworkInfo network={network} />,
        })),
      },
    ],
  } as Search

  const onTableChange = ({ page = {}, sort = {} }) => {
    // @ts-ignore
    const { index: _pageIndex, size: _pageSize } = page

    setPageIndex(_pageIndex)
    setPageSize(_pageSize)

    // @ts-ignore
    const { field: _sortField, direction: _sortDirection } = sort
    setSortField(_sortField)
    setSortDirection(_sortDirection)
  }

  return (
    <ExplorerTableWrap>
      <EuiInMemoryTable
        itemID="_id"
        items={transactions}
        columns={columns}
        hasActions={false}
        tableLayout="fixed"
        pagination={pagination}
        // @ts-ignore
        sorting={sorting}
        search={search}
        onTableChange={onTableChange}
      />
    </ExplorerTableWrap>
  )
}

export default HistoryTable
