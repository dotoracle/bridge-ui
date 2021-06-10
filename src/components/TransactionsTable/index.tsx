/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import axios from 'axios'
import { EuiInMemoryTable, EuiToolTip, EuiButtonIcon, EuiBasicTableColumn, EuiConfirmModal } from '@elastic/eui'
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
} from '../../hooks'
import { parseResponseToTransactions, setupNetwork } from '../../utils'
import Transaction from '../../type/Transaction'
import Network from '../../type/Network'
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
  ActionLink,
  ConfirmMessage,
} from './styled'
import UnknownSVG from '../../assets/images/unknown.svg'
import NetworkInfo from './NetworkInfo'

const TransactionsTable = (): JSX.Element => {
  const { account, chainId: currentChainId } = useActiveWeb3React()
  const defaultMetamaskChainId = [1, 42]
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
  const transactionCallback = useAllTransactions(account, currentChainId, 200, 1)

  // pagination
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const pagination = {
    pageIndex,
    pageSize,
    totalItemCount: 5,
    pageSizeOptions: [10, 15, 20],
  }

  const onTableChange = ({ page = {} }) => {
    // @ts-ignore
    const { index: _pageIndex, size: _pageSize } = page

    setPageIndex(_pageIndex)
    setPageSize(_pageSize)
  }

  const onLoadTransactions = async () => {
    setIsLoading(true)
    const response = await transactionCallback()
    setTranstractions(parseResponseToTransactions(response))
    setIsLoading(false)
  }

  useEffect(() => {
    const fetchTransactions = async () => {
      onLoadTransactions()
    }

    fetchTransactions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, currentChainId])

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

  const changeButtonText = (button: HTMLElement, text: string) => {
    const textTag = button.getElementsByClassName('euiButtonEmpty__text')[0]
    textTag.textContent = text
  }

  const addLoadingState = (button: HTMLElement) => {
    button.setAttribute('disabled', 'true')
    const content = button.getElementsByClassName('euiButtonContent')[0]
    const spinner = document.createElement('span')
    changeButtonText(button, 'Signing transaction...')
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
      name: 'Action',
      width: '15%',
      actions: [
        {
          render: (item: Transaction) => {
            return (
              <>
                {!item.claimed && (
                  <ActionLink isDisabled={isDisabled} color="text" onClick={(e: any) => onClaimToken(e, item)}>
                    Claim Token
                  </ActionLink>
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
          <RefreshButton isLoading={isLoading} iconType="refresh" onClick={onLoadTransactions}>
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
