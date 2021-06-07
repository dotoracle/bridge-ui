import { useState, useEffect } from 'react'
import { Contract } from 'web3-eth-contract'
import { toBN, toHex } from 'web3-utils'
import { toast } from 'react-toastify'
import ToastMessage from '../ToastMessage'
import Token from '../../type/Token'
import { fromWei } from '../../utils'
import { StepButton, StepNumber } from './styled'

interface IApproveButtonProps {
  selectedToken: Token
  tokenBalance: number
  tokenContract: Contract | null
  bridgeAddress: string
  chainId: number | undefined
  account: string
}

const ApproveButton = (props: IApproveButtonProps): JSX.Element => {
  const { selectedToken, tokenBalance, tokenContract, bridgeAddress, chainId, account } = props

  const [isLoading, setLoading] = useState(false)
  const [needApprove, setNeedApprove] = useState(true)

  useEffect(() => {
    const fetchAllowance = async () => {
      try {
        if (tokenContract) {
          const _allowance = await tokenContract.methods.allowance(account, bridgeAddress).call()
          const _allowanceBN = fromWei(_allowance, selectedToken?.decimals)
          setNeedApprove(tokenBalance > 0 && tokenBalance > Number(_allowanceBN.toString()))
        }
      } catch (error) {
        console.error(error)
        toast.error(<ToastMessage color="danger" headerText="Error!" bodyText="Could not get allowance" />, {
          toastId: 'fetchAllowance',
        })
      }
    }

    fetchAllowance()
  }, [selectedToken, tokenBalance]) // eslint-disable-line react-hooks/exhaustive-deps

  const onApprove = async () => {
    try {
      setLoading(true)

      if (tokenContract && chainId) {
        // await tokenContract.methods
        //   .approve(bridgeAddress, toBN(tokenBalance).mul(toBN(1 * 10 ** 18)))
        //   .send({ chainId: toHex(chainId), from: account })
      }

      toast.success(
        <ToastMessage color="success" headerText="Success!" bodyText="Next, click the Request Bridge button" />,
        {
          toastId: 'onApprove',
        },
      )

      setNeedApprove(false)
    } catch (error) {
      // we only care if the error is something _other_ than the user rejected the tx
      if (error?.code !== 4001) {
        const message = `Could not approve ${selectedToken.symbol}. Please try again.`
        toast.error(<ToastMessage color="danger" headerText="Error!" bodyText={message} />, {
          toastId: 'onApprove',
        })
      }
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {needApprove && (
        <StepButton fill isLoading={isLoading} iconSide="right" onClick={onApprove}>
          <StepNumber>1</StepNumber>
          <span>{isLoading ? 'Approving' : `Approve ${selectedToken.symbol}`}</span>
        </StepButton>
      )}
    </>
  )
}

export default ApproveButton
