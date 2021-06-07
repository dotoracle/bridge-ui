import { useMemo, useCallback } from 'react'
import BN from 'bn.js'
import { toHex } from 'web3-utils'
import { useActiveWeb3React } from './useWeb3'
import useTokenAllowance from './useTokenAllowance'
import { useTokenContract } from './useContract'
import Token from '../type/Token'

export enum ApprovalState {
  UNKNOWN = 'UNKNOWN',
  NOT_APPROVED = 'NOT_APPROVED',
  APPROVED = 'APPROVED',
}

export const useApproveCallback = (
  amountToApprove?: BN,
  token?: Token,
  chainId?: number,
  spender?: string,
): [ApprovalState, () => Promise<any>] => {
  const { account } = useActiveWeb3React()

  const currentAllowance = useTokenAllowance(token, account ?? undefined, spender)

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN

    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance || amountToApprove.toString() === '0') return ApprovalState.UNKNOWN

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lt(amountToApprove) ? ApprovalState.NOT_APPROVED : ApprovalState.APPROVED
  }, [amountToApprove, currentAllowance, spender])

  const tokenContract = useTokenContract(token?.address)

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }

    if (!token) {
      console.error('no token')
      return
    }

    if (!tokenContract) {
      console.error('tokenContract is null')
      return
    }

    if (!chainId) {
      console.error('no chain id')
      return
    }

    if (!amountToApprove) {
      console.error('missing amount to approve')
      return
    }

    if (!spender) {
      console.error('no spender')
      return
    }

    return tokenContract.methods.approve(spender, amountToApprove).send({ chainId: toHex(chainId), from: account })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approvalState, token, tokenContract, amountToApprove, spender])

  return [approvalState, approve]
}
