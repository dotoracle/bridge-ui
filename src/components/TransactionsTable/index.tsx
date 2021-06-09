import { useState } from 'react'
import { EuiInMemoryTable, EuiToolTip, EuiButtonIcon, EuiBasicTableColumn } from '@elastic/eui'
import styled from 'styled-components'
import { toDate, lightFormat, formatDistanceToNow } from 'date-fns'
import { useAllTransactions, useActiveWeb3React } from '../../hooks'
import Transaction from '../../type/Transaction'
import Network from '../../type/Network'
import UnknownSVG from '../../assets/images/unknown.svg'

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
const StyledSpan = styled.span`
  font-size: 0.75rem;
`
const Wrapper = styled.div`
  display: flex;
  align-items: center;
`
const NetworkLogo = styled.img`
  margin-right: 0.25rem;
  margin-left: 0.25rem;
  height: 12px;
  width: 12px;
`
const NetworkName = styled.p`
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.5;
  color: #fff;
`
const ExplorerLogo = styled.img`
  height: 12px;
  width: 12px;
  margin-right: 0.5rem;
`
const Link = styled.a`
  font-size: 0.75rem;
  color: #fff;

  &:hover {
    text-decoration: underline;
  }
`
const FakeLink = styled.span`
  font-size: 0.75rem;
  color: #fff;

  &:hover {
    text-decoration: underline;
  }
`
const CollapseWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0.5rem;
  width: 100%;
  font-size: 0.75rem;
  line-height: 2;
  color: #aeaeb5;

  a {
    color: ${props => props.theme.primary};

    &:hover {
      text-decoration: underline;
    }
  }
`
const Row = styled.div`
  display: flex;
  align-items: center;

  > div {
    display: flex;
    align-items: center;
    margin-right: 0.5rem;

    > span {
      margin-right: 0.25rem;
    }
  }
`

const NetworkInfo = ({ network }: { network: Network | undefined }): JSX.Element => {
  return (
    <Wrapper>
      {network ? (
        <>
          <NetworkLogo src={network.logoURI ? network.logoURI : UnknownSVG} alt={network.name} />
          <NetworkName>{network.name}</NetworkName>
        </>
      ) : (
        <>
          <NetworkLogo src={UnknownSVG} alt="Unknown network" />
          <NetworkName>Unknown network</NetworkName>
        </>
      )}
    </Wrapper>
  )
}

const TransactionsTable = (): JSX.Element => {
  const { account, chainId } = useActiveWeb3React()
  const [totalTxs, transactions] = useAllTransactions(account, chainId, 20, 1)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                <Wrapper>
                  <a
                    href={`${item.originNetwork.explorer}/token/${item.originToken}`}
                    target="__blank"
                    rel="noopener noreferrer nofollow"
                  >
                    {item.amountFormated}
                  </a>
                </Wrapper>
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
          <Row>
            This token was deployed on <NetworkInfo network={item.originNetwork} />
          </Row>
        </CollapseWrap>
      )
    }
    setItemIdToExpandedRowMap(itemIdToExpandedRowMapValues)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: EuiBasicTableColumn<any>[] = [
    {
      field: 'requestTime',
      name: 'Request Time',
      sortable: true,
      width: '15%',
      render: (time: number): JSX.Element => {
        return (
          <EuiToolTip content={lightFormat(toDate(time * 1000), 'yyyy-MM-dd HH:mm:ss')}>
            <StyledSpan>{formatDistanceToNow(time * 1000, { addSuffix: true })}</StyledSpan>
          </EuiToolTip>
        )
      },
    },
    {
      field: 'requestHashLink',
      name: 'Request Tx',
      width: '25%',
      render: ({
        explorerLogo,
        requestHash,
        requestHashUrl,
      }: {
        explorerLogo: string
        requestHash: string
        requestHashUrl: string
      }): JSX.Element => {
        return (
          <Wrapper>
            <ExplorerLogo src={explorerLogo ? explorerLogo : UnknownSVG} alt="explorer-logo" />
            <Link href={requestHashUrl} target="__blank" rel="noopener nofollow noreferrer">
              {requestHash}
            </Link>
          </Wrapper>
        )
      },
    },
    {
      field: 'amountFormated',
      name: 'Amount',
      width: '25%',
      sortable: true,
      render: (amountFormated: string): JSX.Element => {
        return <StyledSpan>{amountFormated}</StyledSpan>
      },
    },
    {
      field: 'claimHashLink',
      name: 'Claim Tx',
      width: '25%',
      render: ({
        explorerLogo,
        claimHash,
        claimHashUrl,
      }: {
        explorerLogo: string
        claimHash: string
        claimHashUrl: string
      }): JSX.Element => {
        return (
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
        )
      },
    },
    {
      name: 'Action',
      width: '10%',
      actions: [],
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

  return (
    <TableWrap>
      <TableTitle>Latest Transactions</TableTitle>
      <EuiInMemoryTable
        itemId="_id"
        items={transactions}
        columns={columns}
        isExpandable={true}
        itemIdToExpandedRowMap={itemIdToExpandedRowMap}
        hasActions={true}
        tableLayout="fixed"
      />
    </TableWrap>
  )
}

export default TransactionsTable
