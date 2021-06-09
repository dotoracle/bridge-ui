/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  EuiInMemoryTable,
  EuiToolTip,
  EuiButtonEmpty,
  EuiButtonIcon,
  EuiBasicTableColumn,
  EuiConfirmModal,
} from '@elastic/eui'
import styled from 'styled-components'
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
const ActionLink = styled(EuiButtonEmpty)`
  padding: 0;
  height: auto;

  &.euiButtonEmpty {
    color: ${props => props.theme.primary};
  }

  &:focus {
    background: transparent;
  }
`
const ConfirmMessage = styled.div`
  img {
    width: 24px !important;
    height: 24px !important;
  }

  > div {
    margin-top: 1rem;
  }

  p {
    font-size: 1rem;
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
  const { account, library, chainId: currentChainId } = useActiveWeb3React()
  const currentNetwork = useNetworkInfo(currentChainId, library)

  const bridgeAddress = useBridgeAddress(currentChainId)
  const bridgeContract = useBridgeContract(bridgeAddress)

  const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState<any>({})
  const [isDisabled, setIsDisabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showNetworkModal, setShowNetworkModal] = useState(false)
  const [claimTokenSymbol, setClaimTokenSymbol] = useState('')
  const [toNetwork, setToNetwork] = useState<Network>()

  const [transactions, setTranstractions] = useState<Transaction[]>([])
  const transactionCallback = useAllTransactions(account, currentChainId, 20, 1)

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true)
      const response = await transactionCallback()
      setTranstractions(parseResponseToTransactions(response))
      setIsLoading(false)
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
          setClaimTokenSymbol(item.originSymbol)
          setToNetwork(item.toNetwork)

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
      let message = `Could not claim ${item.originSymbol}`

      if (error.name === 'SignError') {
        // eslint-disable-next-line prefer-destructuring
        message = error.message
      }

      toast.error(<ToastMessage color="danger" headerText="Error!" bodyText={message} />, {
        toastId: 'claimToken',
      })
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
        hasSetup = await setupNetwork(toNetwork)

        if (hasSetup) {
          setShowNetworkModal(false)
        }
      }

      if (!toNetwork || !hasSetup) {
        throw 'Could not setup network'
      }
    } catch (error) {
      toast.error(<ToastMessage color="danger" headerText="Error!" bodyText="Could not setup network" />, {
        toastId: 'claimToken',
      })
      console.error(error)
    }
  }

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
      width: '20%',
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
        <TableTitle>Latest Transactions</TableTitle>
        <EuiInMemoryTable
          loading={isLoading}
          itemId="_id"
          items={transactions}
          columns={columns}
          isExpandable={true}
          itemIdToExpandedRowMap={itemIdToExpandedRowMap}
          hasActions={false}
          tableLayout="fixed"
        />
      </TableWrap>
      {showNetworkModal && (
        <EuiConfirmModal
          title="Important!"
          onCancel={() => setShowNetworkModal(false)}
          onConfirm={onSetupNetwork}
          cancelButtonText="Cancel"
          confirmButtonText="Switch the network"
          defaultFocusedButton="confirm"
        >
          <ConfirmMessage>
            You&rsquo;re trying to claim {claimTokenSymbol}
            {toNetwork && (
              <>
                {' '}
                on <NetworkInfo network={toNetwork}></NetworkInfo>
              </>
            )}
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
