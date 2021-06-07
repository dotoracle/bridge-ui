import { useState, useContext } from 'react'
import { toast } from 'react-toastify'
import ToastMessage from '../ToastMessage'
import BridgeAppContext from '../../context/BridgeAppContext'
import WalletModal from '../WalletModal'
import {
  ApprovalState,
  useApproveCallback,
  useActiveWeb3React,
  useTokenBalance,
  useTokenContract,
  useBridgeAddress,
  useBridgeContract,
} from '../../hooks'
import { StyledButton } from './styled'
import { toWei } from '../../utils'
import { toHex } from 'web3-utils'

const ActionButtons = (): JSX.Element => {
  const { selectedToken, sourceNetwork, targetNetwork, tokenAmount, setTokenAmount } = useContext(BridgeAppContext)
  const { account, chainId } = useActiveWeb3React()

  const tokenBalance = useTokenBalance(
    selectedToken ? selectedToken.address : undefined,
    selectedToken ? selectedToken.decimals : undefined,
    account,
  )

  const [showWalletModal, setShowWalletModal] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const bridgeAddress = useBridgeAddress(chainId)
  const tokenContract = useTokenContract(selectedToken?.address)
  const bridgeContract = useBridgeContract(bridgeAddress)
  const [approval, approveCallback] = useApproveCallback(
    toWei(tokenBalance),
    selectedToken,
    sourceNetwork?.chainId,
    bridgeAddress,
  )

  const [needApprove, setNeedApprove] = useState(true)

  const onApprove = async () => {
    try {
      setLoading(true)

      if (selectedToken && targetNetwork) {
        const receipt = await approveCallback()

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
        }
      }
    } catch (error) {
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
    }
  }

  const onTransferToken = async () => {
    try {
      setLoading(true)

      if (selectedToken && sourceNetwork && targetNetwork && bridgeContract) {
        const amountInWei = toWei(tokenAmount, selectedToken.decimals)

        const receipt = await bridgeContract.methods
          .requestBridge(selectedToken.address, amountInWei, targetNetwork.chainId)
          .send({
            chaindId: toHex(sourceNetwork.chainId),
            from: account,
            value: 0,
          })

        if (receipt) {
          toast.success(
            <ToastMessage
              color="success"
              headerText="Success!"
              bodyText={`Now you can claim your ${selectedToken.symbol} on ${targetNetwork.name}.`}
              link={`${sourceNetwork.explorer}/tx/${receipt.transactionHash}`}
              linkText="View Transaction"
            />,
            {
              toastId: 'onTransferToken',
            },
          )

          setTokenAmount(0)
        }
      }
    } catch (error) {
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

  return (
    <>
      {account ? (
        <>
          {selectedToken ? (
            <>
              {!needApprove || approval === ApprovalState.APPROVED ? (
                <StyledButton fill isLoading={isLoading} isDisabled={tokenAmount <= 0} onClick={onTransferToken}>
                  Transfer {selectedToken.symbol} to bridge
                </StyledButton>
              ) : (
                <StyledButton
                  fill
                  isLoading={isLoading}
                  isDisabled={approval === ApprovalState.UNKNOWN}
                  onClick={onApprove}
                >
                  Approve {selectedToken.symbol}
                </StyledButton>
              )}
            </>
          ) : (
            <StyledButton fill isDisabled>
              Select a token to transfer
            </StyledButton>
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
