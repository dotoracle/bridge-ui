import { useMemo, useCallback } from 'react'
import BigNumber from 'bignumber.js'
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
  amountToApprove?: BigNumber,
  token?: Token,
  chainId?: number,
  spender?: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): [ApprovalState, (infinity?: boolean) => Promise<any>] => {
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

  const approve = useCallback(
    async (infinity?: boolean): Promise<void> => {
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

      const infiniteAmount = new BigNumber(2 ** 255 - 1)

      return tokenContract.methods
        .approve(spender, infinity ? infiniteAmount.toString(10) : amountToApprove.toString(10))
        .send({ chainId: toHex(chainId), from: account })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [approvalState, token, tokenContract, amountToApprove, spender],
  )

  return [approvalState, approve]
}
