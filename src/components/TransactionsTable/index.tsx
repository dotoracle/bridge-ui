/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useContext } from 'react'
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
import BridgeAppContext from '../../context/BridgeAppContext'
import ToastMessage from '../ToastMessage'
import {
  useAllTransactions,
  useActiveWeb3React,
  useNetworkInfo,
  useBridgeAddress,
  useBridgeContract,
  useAllNetworks,
} from '../../hooks'
import { parseResponseToTransactions, setupNetwork } from '../../utils'
import Transaction from '../../type/Transaction'
import Network from '../../type/Network'
import ClaimCountdown from './ClaimCountdown'
import {
  TableWrap,
  TableTitle,
  RefreshButton,
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
import UnknownSVG from '../../assets/images/unknown.svg'
import NetworkInfo from './NetworkInfo'

const TransactionsTable = (): JSX.Element => {
  const { account, chainId: currentChainId } = useActiveWeb3React()
  const { refreshLocal, setRefreshLocal } = useContext(BridgeAppContext)
  const defaultMetamaskChainId = [1, 42]
  const currentNetwork = useNetworkInfo(currentChainId)

  const bridgeAddress = useBridgeAddress(currentChainId)
  const bridgeContract = useBridgeContract(bridgeAddress)

  const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState<any>({})
  const [isDisabled, setIsDisabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showNetworkModal, setShowNetworkModal] = useState(false)
  const [claimTokenSymbol, setClaimTokenSymbol] = useState('')
  const [toNetwork, setToNetwork] = useState<Network>()

  const [transactions, setTranstractions] = useState<Transaction[]>([])
  const transactionCallback = useAllTransactions(account, currentChainId, 200, 1)

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

  const onLoadTransactions = async (isHardRefresh: boolean) => {
    const _transactions = localStorage.getItem(`transactions_${account}_${currentChainId}`)

    if (!_transactions || (isHardRefresh && !isProcessing)) {
      setIsLoading(true)
      const response = await transactionCallback()
      setTranstractions(parseResponseToTransactions(response, account, currentChainId))
      setIsLoading(false)
    } else {
      setIsLoading(true)
      setTimeout(() => {
        setTranstractions(JSON.parse(_transactions))
        setIsLoading(false)
      }, 500)
    }
    setRefreshLocal(false)
  }

  useEffect(() => {
    const fetchTransactions = async () => {
      onLoadTransactions(false)

      if (refreshLocal) {
        setIsProcessing(true)
      }
    }

    fetchTransactions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, currentChainId, refreshLocal])

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
          {item.originNetwork && (
            <Row>
              This token was deployed on <NetworkInfo network={item.originNetwork} />
            </Row>
          )}
        </CollapseWrap>
      )
    }
    setItemIdToExpandedRowMap(itemIdToExpandedRowMapValues)
  }

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

        const response = await axios.post(`${process.env.REACT_APP_API_URL}/request-withdraw`, {
          requestHash,
          fromChainId,
          toChainId,
          index: index,
        })

        if (response.status === 200 && response.data) {
          const sign = response.data
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
                  link={`${currentNetwork.explorer}/tx/${receipt.transactionHash}`}
                  linkText="View Transaction"
                />,
                {
                  toastId: 'onClaimToken',
                },
              )

              // Update storage
              const data = localStorage.getItem(`transactions_${account}_${currentChainId}`)

              if (data) {
                const _transactions = JSON.parse(data) as Transaction[]
                const _item = _transactions.find(t => t._id === item._id)
                if (_item && _item.toNetwork) {
                  const claimHashEllipsis = `${receipt.transactionHash.substring(
                    0,
                    6,
                  )}...${receipt.transactionHash.substring(receipt.transactionHash.length - 4)}`

                  _item.claimed = true
                  _item.claimHash = receipt.transactionHash
                  _item.claimHashLink = {
                    networkName: _item.toNetwork.name,
                    explorerLogo: _item.toNetwork.logoURI,
                    claimHash: claimHashEllipsis,
                    claimHashUrl: `${_item.toNetwork.explorer}/tx/${receipt.transactionHash}`,
                  }
                }
                setTranstractions(_transactions)
                localStorage.setItem(`transactions_${account}_${currentChainId}`, JSON.stringify(_transactions))

                setIsProcessing(true)
                onLoadTransactions(false)
              }
            }
          }
        } else {
          const signError = new Error('Could not sign the withdrawal request')
          signError.name = 'SignError'
          throw signError
        }
      }
    } catch (error) {
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
        if (!defaultMetamaskChainId.includes(toNetwork.chainId)) {
          hasSetup = await setupNetwork(toNetwork)

          if (hasSetup) {
            setShowNetworkModal(false)
          }

          if (!toNetwork || !hasSetup) {
            console.error('Could not setup network')
          }
        } else {
          setShowNetworkModal(false)
        }
      }
    } catch (error) {
      // we only care if the error is something _other_ than the user rejected the tx
      if (error?.code !== 4001) {
        toast.error(<ToastMessage color="danger" headerText="Error!" bodyText="Could not setup network" />, {
          toastId: 'claimToken',
        })
        console.error(error)
      }
    }
  }

  const columns: EuiBasicTableColumn<any>[] = [
    {
      field: 'requestTime',
      name: 'Request Time',
      sortable: true,
      width: '20%',
      render: (time: number): JSX.Element => {
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
      render: ({
        networkName,
        explorerLogo,
        requestHash,
        requestHashUrl,
      }: {
        networkName: string
        explorerLogo: string
        requestHash: string
        requestHashUrl: string
      }): JSX.Element => {
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
      render: (amountFormated: string): JSX.Element => {
        return <StyledSpan>{amountFormated}</StyledSpan>
      },
    },
    {
      field: 'claimHashLink',
      name: 'Claim Tx',
      width: '22.5%',
      render: ({
        networkName,
        explorerLogo,
        claimHash,
        claimHashUrl,
      }: {
        networkName: string
        explorerLogo: string
        claimHash: string
        claimHashUrl: string
      }): JSX.Element => {
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
                {!item.claimed && (
                  <>
                    {item.index ? (
                      <StyledClaimButton isDisabled={isDisabled} onClick={(e: any) => onClaimToken(e, item)}>
                        Claim Token
                      </StyledClaimButton>
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

  return (
    <>
      <TableWrap>
        <TableTitle>
          Latest Transactions
          <RefreshButton isLoading={isLoading} iconType="refresh" onClick={() => onLoadTransactions(true)}>
            Refresh
          </RefreshButton>
        </TableTitle>
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
      </TableWrap>
      {showNetworkModal && toNetwork && (
        <EuiConfirmModal
          title="Important!"
          onCancel={() => setShowNetworkModal(false)}
          onConfirm={onSetupNetwork}
          cancelButtonText="Cancel"
          confirmButtonText={defaultMetamaskChainId.includes(toNetwork.chainId) ? 'OK' : 'Switch the network'}
          defaultFocusedButton="confirm"
        >
          <ConfirmMessage>
            You&rsquo;re trying to claim {claimTokenSymbol}
            <>
              {' '}
              on <NetworkInfo network={toNetwork}></NetworkInfo>
            </>
          </ConfirmMessage>
          <ConfirmMessage>
            However, you&rsquo;re connecting to <NetworkInfo network={currentNetwork}></NetworkInfo>
          </ConfirmMessage>
          <ConfirmMessage>Please switch the network to continute.</ConfirmMessage>
        </EuiConfirmModal>
      )}
    </>
  )
}

export default TransactionsTable
