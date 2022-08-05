import { useState, useContext, useEffect } from 'react'
import { EuiConfirmModal, EuiFieldText, EuiFormRow } from '@elastic/eui'
import { toast } from 'react-toastify'
import styled from 'styled-components/macro'
import { toHex } from 'web3-utils'
import BridgeAppContext from 'context/BridgeAppContext'
import ToastMessage from '../ToastMessage'
import WalletModal from '../WalletModal'
import {
  ApprovalState,
  useApproveCallback,
  useActiveWeb3React,
  useBridgeAddress,
  useBridgeContract,
  useNetworkInfo,
  useTokenBalanceCallback,
} from 'hooks'
import { StyledButton, UnlockButton } from './styled'
import { toWei } from 'utils'
import UnknownSVG from 'assets/images/unknown.svg'
import { NATIVE_TOKEN_ADDERSS } from '../../constants'
import Web3 from 'web3'
import { CLPublicKey } from 'casper-js-sdk'

const TokenAmount = styled.span`
  color: ${props => props.theme.primary};
  line-height: 2;
  font-weight: 500;
`
const NetworkLogo = styled.img`
  margin-right: 0.25rem;
  margin-left: 0.25rem;
  margin-bottom: 0 !important;
  display: inline-block !important;
  vertical-align: baseline !important;
  height: 18px !important;
  width: 18px !important;
`
const ApproveWrap = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`

function ActionButtons(): JSX.Element {
  const { selectedToken, sourceNetwork, targetNetwork, tokenAmount, setTokenAmount, ledgerAddress } =
    useContext(BridgeAppContext)
  const { account: web3Account, chainId: web3ChainId, library: web3Library } = useActiveWeb3React()

  const account = ledgerAddress !== '' ? ledgerAddress : web3Account
  const chainId = ledgerAddress !== '' ? sourceNetwork?.chainId : web3ChainId

  const networkInfo = useNetworkInfo(chainId)
  const library = ledgerAddress !== '' ? new Web3.providers.HttpProvider(networkInfo?.rpcURL ?? '') : web3Library

  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  const [tokenBalance, setTokenBalance] = useState(0)
  const tokenBalanceCallback = useTokenBalanceCallback(
    selectedToken ? selectedToken.address : undefined,
    selectedToken ? selectedToken.decimals : undefined,
    account,
    library,
    tokenAmount,
    networkInfo,
  )

  const [showWalletModal, setShowWalletModal] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [isInfinteLoading, setInfiniteLoading] = useState(false)
  const [infinityApprove, setInfinityApprove] = useState(false)
  const [showAccountHashError, setShowAccountHashError] = useState(false)
  const [accountHash, setAccountHash] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const bridgeAddress = useBridgeAddress(chainId)
  const bridgeContract = useBridgeContract(bridgeAddress)
  const [approval, approveCallback] = useApproveCallback(
    toWei(tokenAmount, selectedToken?.decimals),
    selectedToken,
    sourceNetwork?.chainId,
    bridgeAddress,
  )
  const originNetwork = useNetworkInfo(selectedToken?.originChainId)
  const [needApprove, setNeedApprove] = useState(true)

  const loadTokenBalance = async () => {
    setIsLoadingBalance(true)
    const _tokenBalance = await tokenBalanceCallback()
    setTokenBalance(_tokenBalance)
    setIsLoadingBalance(false)
  }

  useEffect(() => {
    loadTokenBalance()
  }, [account, chainId, selectedToken])

  const approveToken = async (infinity?: boolean) => {
    try {
      if (selectedToken && targetNetwork) {
        const receipt = await approveCallback(infinity)

        if (receipt) {
          toast.success(
            <ToastMessage
              color="success"
              headerText="Success!"
              bodyText={`Now you can transfer your ${selectedToken.symbol} to ${targetNetwork.name}.`}
            />,
            {
              toastId: 'onApprove',
            },
          )
          setNeedApprove(false)
          setInfinityApprove(typeof infinityApprove === 'undefined' ? false : infinityApprove)
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // we only care if the error is something _other_ than the user rejected the tx
      if (error?.code !== 4001) {
        const message = `Could not approve this token. Please try again.`
        toast.error(<ToastMessage color="danger" headerText="Error!" bodyText={message} />, {
          toastId: 'onApprove',
        })
      }
      console.error(error)
    } finally {
      setLoading(false)
      setInfiniteLoading(false)
    }
  }

  const onApprove = async () => {
    setLoading(true)
    await approveToken()
  }

  const onApproveInfinite = async () => {
    setInfiniteLoading(true)
    await approveToken(true)
  }

  const onTransferToken = async () => {
    try {
      setLoading(true)

      if (selectedToken && sourceNetwork && targetNetwork && bridgeContract) {
        const amountInWei = toWei(tokenAmount, selectedToken.decimals)
        let value = 0

        if (account && selectedToken.address === NATIVE_TOKEN_ADDERSS) {
          value = amountInWei.toNumber()
        }

        const web3 = new Web3()
        let encoded = web3.eth.abi.encodeParameters(['string'], [account?.toLowerCase()])

        if (targetNetwork.notEVM) {
          encoded = web3.eth.abi.encodeParameters(['string'], [accountHash.toLowerCase()])
        }
        console.log(bridgeContract)

        const receipt = await bridgeContract.methods
          .requestBridge(selectedToken.address, encoded, amountInWei.toString(10), targetNetwork.chainId)
          .send({
            chaindId: toHex(sourceNetwork.chainId),
            from: account,
            value: value.toString(),
          })

        if (receipt) {
          toast.success(
            <ToastMessage
              color="success"
              headerText="Success!"
              bodyText={`Now you can claim your ${selectedToken.symbol} on ${targetNetwork.name}.`}
              link={`${sourceNetwork.explorer}${sourceNetwork.txUrl}${receipt.transactionHash}`}
              linkText="View Transaction"
            />,
            {
              toastId: 'onTransferToken',
            },
          )

          loadTokenBalance()
          setTokenAmount(0)

          // Reset approve state
          if (!infinityApprove) {
            setNeedApprove(true)
          }
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // we only care if the error is something _other_ than the user rejected the tx
      if (error?.code !== 4001) {
        const message = `Could not transfer this token to our bridge. Please try again.`
        toast.error(<ToastMessage color="danger" headerText="Error!" bodyText={message} />, {
          toastId: 'onTransferToken',
        })
      }
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const onOpenConfirmModal = () => {
    setLoading(true)
    setShowConfirmModal(true)
  }

  const onCancelTransfer = () => {
    setShowConfirmModal(false)
    setLoading(false)
  }

  const onConfirmTransfer = () => {
    if (!accountHash && (sourceNetwork?.notEVM || targetNetwork?.notEVM)) {
      toast.error(<ToastMessage color="danger" headerText="Error!" bodyText="Invalid Casper Address" />, {
        toastId: 'onTransferToken',
      })
    } else {
      setShowConfirmModal(false)
      onTransferToken()
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onAccountHashChange = (e: any) => {
    const { value } = e.currentTarget

    try {
      setAccountHash(CLPublicKey.fromHex(value).toAccountHashStr())
      setErrorMsg('')
      setShowAccountHashError(false)
    } catch (error) {
      setErrorMsg('Invalid Casper Address')
      setShowAccountHashError(true)
    }
  }

  return (
    <>
      {account ? (
        <>
          {selectedToken && tokenAmount > 0 ? (
            <>
              {!needApprove || approval === ApprovalState.APPROVED ? (
                <StyledButton
                  fill
                  isLoading={isLoading || isLoadingBalance}
                  isDisabled={tokenAmount <= 0 || tokenAmount > tokenBalance}
                  onClick={onOpenConfirmModal}
                >
                  {tokenAmount > 0 && tokenAmount <= tokenBalance
                    ? `Transfer ${selectedToken.symbol} to bridge`
                    : 'Insufficient balance'}
                </StyledButton>
              ) : (
                <ApproveWrap>
                  <UnlockButton
                    fill
                    isLoading={isLoading}
                    isDisabled={approval === ApprovalState.UNKNOWN || isInfinteLoading}
                    onClick={onApprove}
                  >
                    Unlock <br /> {tokenAmount ? `${tokenAmount} ${selectedToken.symbol}` : `${selectedToken.symbol}`}
                  </UnlockButton>
                  <UnlockButton
                    isLoading={isInfinteLoading}
                    isDisabled={approval === ApprovalState.UNKNOWN || isLoading}
                    onClick={onApproveInfinite}
                  >
                    Infinite Unlock
                  </UnlockButton>
                </ApproveWrap>
              )}
            </>
          ) : (
            <StyledButton fill isDisabled>
              Select a token to transfer
            </StyledButton>
          )}
          {showConfirmModal && selectedToken && tokenAmount > 0 && originNetwork && sourceNetwork && targetNetwork && (
            <EuiConfirmModal
              title="Note!"
              onCancel={onCancelTransfer}
              onConfirm={onConfirmTransfer}
              cancelButtonText="No, don't do it"
              confirmButtonText="Yes, do it"
            >
              <>
                <p style={{ lineHeight: 2 }}>
                  Are you sure you want to transfer{' '}
                  <TokenAmount>
                    {tokenAmount} {selectedToken.symbol}
                  </TokenAmount>{' '}
                  from{' '}
                  <strong>
                    <NetworkLogo src={sourceNetwork.logoURI ? sourceNetwork.logoURI : UnknownSVG}></NetworkLogo>
                    {sourceNetwork.name}
                  </strong>{' '}
                  to{' '}
                  <strong>
                    <NetworkLogo src={targetNetwork.logoURI ? targetNetwork.logoURI : UnknownSVG}></NetworkLogo>
                    {targetNetwork.name}
                  </strong>{' '}
                  ?
                  <br />
                  <>
                    {selectedToken.address == NATIVE_TOKEN_ADDERSS && originNetwork.chainId != targetNetwork.chainId && (
                      <span>
                        This token was deployed originally on
                        <strong>
                          <NetworkLogo src={originNetwork.logoURI ? originNetwork.logoURI : UnknownSVG}></NetworkLogo>
                          {originNetwork.name}
                        </strong>
                        , you will receive DotOracle Wrapped {originNetwork.nativeCurrency.symbol} on
                        <strong>
                          <NetworkLogo src={targetNetwork.logoURI ? targetNetwork.logoURI : UnknownSVG}></NetworkLogo>
                          {targetNetwork.name}
                        </strong>
                      </span>
                    )}
                  </>
                </p>
                {targetNetwork.notEVM && (
                  <EuiFormRow
                    label="Your Casper Address (Public Key)1"
                    isInvalid={showAccountHashError}
                    error={errorMsg}
                  >
                    <EuiFieldText onChange={onAccountHashChange} />
                  </EuiFormRow>
                )}
              </>
            </EuiConfirmModal>
          )}
        </>
      ) : (
        <>
          <StyledButton fill onClick={() => setShowWalletModal(true)}>
            Unlock Wallet
          </StyledButton>
          {showWalletModal && <WalletModal closeModal={() => setShowWalletModal(false)} />}
        </>
      )}
    </>
  )
}

export default ActionButtons
