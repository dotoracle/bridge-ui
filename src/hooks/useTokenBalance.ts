/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react'
import Web3 from 'web3'
import { CasperClient, CLPublicKey } from 'casper-js-sdk'
import { ERC20Client } from 'casper-erc20-js-client'
import { fromWei } from 'utils'
import { useTokenContract } from './useContract'
import { NATIVE_TOKEN_ADDERSS } from '../constants'
import NetworkInfo from 'type/Network'

export const useTokenBalanceCallback = (
  tokenAddress: string | undefined,
  decimals: number | undefined,
  account: string | null | undefined,
  library: any | undefined,
  tokenAmount?: number,
  networkInfo?: NetworkInfo,
): (() => Promise<number>) => {
  const tokenContract = useTokenContract(networkInfo && networkInfo.notEVM ? undefined : tokenAddress)

  const getTokenBalance = useCallback(async (): Promise<number> => {
    let _balance = 0

    try {
      if (account && networkInfo) {
        if (tokenAddress === NATIVE_TOKEN_ADDERSS) {
          if (networkInfo.notEVM) {
            const casper = new CasperClient(networkInfo.rpcURL)
            const casperBalance = await casper.balanceOfByPublicKey(CLPublicKey.fromHex(account))
            _balance = casperBalance.toNumber()
          } else {
            const web3 = new Web3(library)
            const ethBalance = await web3.eth.getBalance(account)
            _balance = Number(ethBalance)
          }
        } else {
          if (networkInfo.notEVM) {
            const erc20 = new ERC20Client(networkInfo.rpcURL, networkInfo.key ?? '', networkInfo.eventStream)
            await erc20.setContractHash(tokenAddress ?? '')
            _balance = await erc20.balanceOf(CLPublicKey.fromHex(account))
          } else {
            _balance = await tokenContract?.methods.balanceOf(account).call()
          }
        }
      }

      if (_balance >= 0 && decimals) {
        const _balanceBN = fromWei(_balance, decimals)
        _balance = _balanceBN.toNumber()
      }
    } catch (error) {
      console.log(error)
      console.log(networkInfo)
      _balance = 0
    }
    return _balance
  }, [account, decimals, tokenAddress, tokenContract])

  return getTokenBalance
}
