/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import {
  EuiBasicTableColumn,
  EuiButtonIcon,
  EuiHealth,
  EuiInMemoryTable,
  EuiToolTip,
  Pagination,
  Search,
} from '@elastic/eui'
import { formatDistanceToNow, lightFormat, toDate } from 'date-fns'
import NetworkInfo from 'components/TransactionsTable/NetworkInfo'
import {
  CollapseWrap,
  ExplorerLogo,
  FakeLink,
  Link,
  Row,
  StyledSpan,
  Wrapper,
} from 'components/TransactionsTable/styled'
import { useActiveWeb3React, useAllNetworks, useNetworkInfo } from 'hooks'
import Network from 'type/Network'
import Transaction from 'type/Transaction'
import UnknownSVG from 'assets/images/unknown.svg'
import { ExplorerTableWrap } from './styled'
import { NATIVE_TOKEN_ADDERSS } from '../../constants'

interface HistoryTableProps {
  transactions: Transaction[]
}

function HistoryTable(props: HistoryTableProps): JSX.Element {
  const { transactions } = props
  const { chainId: currentChainId } = useActiveWeb3React()
  const currentNetwork = useNetworkInfo(currentChainId)

  const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState<any>({})

  const toggleDetails = (item: Transaction) => {
    const itemIdToExpandedRowMapValues = { ...itemIdToExpandedRowMap }

    if (itemIdToExpandedRowMapValues[item._id]) {
      delete itemIdToExpandedRowMapValues[item._id]
    } else {
      itemIdToExpandedRowMapValues[item._id] = (
        <CollapseWrap>
          <Row>
            <div>
              <span>Transfer</span>
              {item.originNetwork ? (
                <>
                  {item.originToken === NATIVE_TOKEN_ADDERSS ? (
                    <span>{item.amountFormated}</span>
                  ) : (
                    <Wrapper>
                      <a
                        href={`${item.originNetwork.explorer}/token/${item.originToken}`}
                        target="__blank"
                        rel="noopener noreferrer nofollow"
                      >
                        {item.amountFormated}
                      </a>
                    </Wrapper>
                  )}
                </>
              ) : (
                <span>{item.amountFormated}</span>
              )}
            </div>
            <div>
              <span>From</span>
              <NetworkInfo network={item.fromNetwork} />
            </div>
            <div>
              <span>To</span>
              <NetworkInfo network={item.toNetwork} />
            </div>
          </Row>
          {item.account !== item.txCreator && (
            <Row>
              {item.toNetwork?.notEVM ? 'Recipient account hash:' : 'Recipient account address:'}&nbsp;
              <a href={`${item.accountUrl}`} target="__blank">
                {item.account}
              </a>
            </Row>
          )}
          {item.originNetwork && item.originToken !== NATIVE_TOKEN_ADDERSS && (
            <>
              <Row>
                This token was deployed on <NetworkInfo network={item.originNetwork} />
              </Row>
              {(item.fromNetwork?.notEVM || item.toNetwork?.notEVM) &&
                item.account !== item.txCreator &&
                item.contractHash && (
                  <Row>
                    Contrach hash on &nbsp;
                    <NetworkInfo network={item.fromNetwork?.notEVM ? item.fromNetwork : item.toNetwork} />
                    {` ${item.contractHash}`}
                  </Row>
                )}
            </>
          )}
        </CollapseWrap>
      )
    }
    setItemIdToExpandedRowMap(itemIdToExpandedRowMapValues)
  }

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
        const label = claimed ? 'Success' : 'Awaiting claim'
        return <EuiHealth color={color}>{label}</EuiHealth>
      },
    },
    {
      align: 'right',
      width: '40px',
      isExpander: true,
      render: (item: Transaction) => (
        <EuiButtonIcon
          onClick={() => toggleDetails(item)}
          aria-label={itemIdToExpandedRowMap[item._id] ? 'Collapse' : 'Expand'}
          iconType={itemIdToExpandedRowMap[item._id] ? 'arrowUp' : 'arrowDown'}
        />
      ),
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
      placeholder: 'Enter the transaction hash...',
    },
    filters: [
      {
        type: 'field_value_selection',
        field: 'claimed',
        name: 'Status',
        multiSelect: false,
        options: [
          {
            value: true,
            name: 'Success',
            view: <EuiHealth color="success">Success</EuiHealth>,
          },
          {
            value: false,
            name: 'Awaiting claim',
            view: <EuiHealth color="warning">Awaiting claim</EuiHealth>,
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
        itemId="_id"
        items={transactions}
        columns={columns}
        isExpandable={true}
        itemIdToExpandedRowMap={itemIdToExpandedRowMap}
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
