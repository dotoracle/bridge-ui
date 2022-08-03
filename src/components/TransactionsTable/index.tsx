/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  EuiInMemoryTable,
  EuiToolTip,
  EuiButtonIcon,
  EuiBasicTableColumn,
  EuiConfirmModal,
  Pagination,
  Search,
} from '@elastic/eui'
import { toDate, lightFormat, formatDistanceToNow } from 'date-fns'
import { toast } from 'react-toastify'
import { toHex } from 'web3-utils'
import ToastMessage from '../ToastMessage'
import {
  useAllTransactions,
  useActiveWeb3React,
  useNetworkInfo,
  useBridgeAddress,
  useBridgeContract,
  useAllNetworks,
} from 'hooks'
import { parseResponseToTransactions, setupNetwork } from 'utils'
import Transaction from 'type/Transaction'
import Network from 'type/Network'
import ClaimCountdown from './ClaimCountdown'
import {
  TableWrap,
  TableTitle,
  StyledSpan,
  Wrapper,
  ExplorerLogo,
  Link,
  FakeLink,
  CollapseWrap,
  Row,
  StyledClaimButton,
  ConfirmMessage,
} from './styled'
import UnknownSVG from 'assets/images/unknown.svg'
import NetworkInfo from './NetworkInfo'
import { ConnectorNames, injected } from 'connectors'
import { connectorLocalStorageKey, NATIVE_TOKEN_ADDERSS } from '../../constants'

function TransactionsTable(): JSX.Element {
  const { account, chainId: currentChainId, deactivate, activate } = useActiveWeb3React()
  const currentNetwork = useNetworkInfo(currentChainId)

  const bridgeAddress = useBridgeAddress(currentChainId)
  const bridgeContract = useBridgeContract(bridgeAddress)

  const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState<any>({})
  const [isDisabled, setIsDisabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showNetworkModal, setShowNetworkModal] = useState(false)
  const [claimTokenSymbol, setClaimTokenSymbol] = useState('')
  const [toNetwork, setToNetwork] = useState<Network>()

  const [transactions, setTranstractions] = useState<Transaction[]>([])
  const { data: response, error: srwError } = useAllTransactions(account, currentChainId, 200)

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
              {item.toNetwork?.notEVM ? 'Your recipient account hash:' : 'Your recipient account address:'}&nbsp;
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
      width: '20%',
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
      field: 'requestHashLink',
      name: 'Request Tx',
      width: '22.5%',
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
      width: '22.5%',
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
      name: 'Action',
      width: '15%',
      actions: [
        {
          render: (item: Transaction) => {
            return (
              <>
                {!item.claimed ? (
                  <>
                    {item.index ? (
                      <>
                        {item.toNetwork?.notEVM ? (
                          <>
                            <span>Processing</span>
                          </>
                        ) : (
                          <>
                            <StyledClaimButton isDisabled={isDisabled} onClick={(e: any) => onClaimToken(e, item)}>
                              Claim Token
                            </StyledClaimButton>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {item.fromNetwork && (
                          <ClaimCountdown
                            transaction={item}
                            network={item.fromNetwork}
                            isDisabled={isDisabled}
                            onClick={(e: any) => onClaimToken(e, item)}
                          />
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <span style={{ opacity: 0.5 }}>Complete</span>
                )}
              </>
            )
          },
        },
      ],
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
  const [pageSize, setPageSize] = useState(10)
  const pagination = {
    pageIndex,
    pageSize,
    totalItemCount: 5,
    pageSizeOptions: [10, 15, 20],
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

  const onLoadTransactions = async () => {
    try {
      setIsLoading(true)
      const _txns = await parseResponseToTransactions(response, currentChainId)
      setTranstractions(_txns)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const fetchTransactions = async () => {
      onLoadTransactions()
    }

    fetchTransactions()
  }, [account, currentChainId, response])

  const changeButtonText = (button: HTMLElement, text: string) => {
    const textTag = button.getElementsByClassName('euiButtonEmpty__text')[0]
    textTag.textContent = text
  }

  const addLoadingState = (button: HTMLElement) => {
    button.setAttribute('disabled', 'true')
    const content = button.getElementsByClassName('euiButtonContent')[0]
    const spinner = document.createElement('span')
    changeButtonText(button, 'Please wait...')
    spinner.classList.add('euiLoadingSpinner', 'euiLoadingSpinner--medium', 'euiButtonContent__spinner')
    content.prepend(spinner)
  }

  const removeLoadingState = (button: HTMLElement) => {
    button.removeAttribute('disabled')
    const spinner = button.getElementsByClassName('euiLoadingSpinner')[0]
    changeButtonText(button, 'Claim Token')
    spinner.remove()
  }

  const onClaimToken = async (e: any, item: Transaction) => {
    const button = e.currentTarget
    addLoadingState(button)

    try {
      setIsDisabled(true)
      setClaimTokenSymbol(item.originSymbol)
      setToNetwork(item.toNetwork)

      const { requestHash, originChainId, fromChainId, toChainId, index, originToken, amount } = item

      // Ask user if the currentChainId is different than the toChainId
      if (currentChainId !== toChainId) {
        setShowNetworkModal(true)
      } else {
        const chainIdData = [originChainId, fromChainId, toChainId, index]

        const _response = await axios.post(`${process.env.REACT_APP_API_URL}/request-withdraw`, {
          requestHash,
          fromChainId,
          toChainId,
          index: index,
        })

        if (_response.status === 200 && _response.data) {
          const sign = _response.data
          const { name, symbol, decimals, r, s, v } = sign

          if (bridgeContract) {
            changeButtonText(button, 'Confirming...')

            const receipt = await bridgeContract.methods
              .claimToken(originToken, account, amount, chainIdData, requestHash, r, s, v, name, symbol, decimals)
              .send({
                chainId: toHex(item.toChainId),
                from: account,
              })

            if (receipt && currentNetwork) {
              toast.success(
                <ToastMessage
                  color="success"
                  headerText="Success!"
                  link={`${currentNetwork.explorer}${currentNetwork.txUrl}${receipt.transactionHash}`}
                  linkText="View Transaction"
                />,
                {
                  toastId: 'onClaimToken',
                },
              )
            }
          }
        } else {
          const signError = new Error('Could not sign the withdrawal request')
          signError.name = 'SignError'
          throw signError
        }
      }
    } catch (error: any) {
      // we only care if the error is something _other_ than the user rejected the tx
      if (error?.code !== 4001) {
        let message = `Could not claim ${item.originSymbol}`

        if (error.name === 'SignError') {
          // eslint-disable-next-line prefer-destructuring
          message = error.message
        }

        toast.error(<ToastMessage color="danger" headerText="Error!" bodyText={message} />, {
          toastId: 'claimToken',
        })
      }
      console.error(error)
    } finally {
      removeLoadingState(button)
      setIsDisabled(false)
    }
  }

  const onSetupNetwork = async () => {
    try {
      let hasSetup = false

      if (toNetwork) {
        if (currentNetwork?.notEVM) {
          window.localStorage.removeItem(connectorLocalStorageKey)
          deactivate()

          window.localStorage.setItem(connectorLocalStorageKey, ConnectorNames.Injected)
          await activate(injected, async (error: Error) => {
            console.error(error)
          })

          window.location.reload()
        }
        hasSetup = await setupNetwork(toNetwork)

        if (!toNetwork || !hasSetup) {
          console.error('Could not setup network')
        }
      }
    } catch (error: any) {
      // we only care if the error is something _other_ than the user rejected the tx
      if (error?.code !== 4001) {
        toast.error(<ToastMessage color="danger" headerText="Error!" bodyText="Could not setup network" />, {
          toastId: 'setupNetwork',
        })
        console.error(error)
      }
    } finally {
      setShowNetworkModal(false)
    }
  }

  return (
    <>
      <TableWrap>
        <TableTitle>Latest Transactions</TableTitle>
        {srwError ? (
          <span>Could not load data</span>
        ) : (
          <EuiInMemoryTable
            loading={isLoading}
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
        )}
      </TableWrap>
      {showNetworkModal && toNetwork && (
        <EuiConfirmModal
          title="Important!"
          onCancel={() => setShowNetworkModal(false)}
          onConfirm={onSetupNetwork}
          cancelButtonText="Cancel"
          confirmButtonText="Change network"
          defaultFocusedButton="confirm"
        >
          <ConfirmMessage>
            You&rsquo;re connected to <NetworkInfo network={currentNetwork}></NetworkInfo>
          </ConfirmMessage>
          <ConfirmMessage>
            Please change the network to <NetworkInfo network={toNetwork}></NetworkInfo> to claim {claimTokenSymbol}.
          </ConfirmMessage>
        </EuiConfirmModal>
      )}
    </>
  )
}

export default TransactionsTable
