/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from 'react'
import Web3 from 'web3'
import { CasperClient, CLAccountHash, CLPublicKey } from 'casper-js-sdk'
import { fromWei } from 'utils'
import { ERC20Client } from 'casper-erc20-js-client'
import { useTokenContract } from './useContract'
import { NativeTokenAddress } from '../constants'
import NetworkInfo from 'type/Network'

export const useTokenBalance = (
  tokenAddress: string | undefined,
  decimals: number | undefined,
  account: string | null | undefined,
  library: any | undefined,
  tokenAmount?: number,
  networkInfo?: NetworkInfo,
): number => {
  const [balance, setBalance] = useState(0)
  const tokenContract = useTokenContract(networkInfo && networkInfo.notEVM ? undefined : tokenAddress)

  try {
    useEffect(() => {
      const fetchData = async () => {
        let _balance = 0

        if (account && networkInfo) {
          if (tokenAddress === NativeTokenAddress) {
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
          setBalance(Number(_balanceBN.toFixed(3)))
        } else {
          setBalance(_balance)
        }
      }

      if (tokenAddress && decimals && account) {
        fetchData()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenAddress, decimals, account, tokenAmount])
  } catch (error) {
    console.error(error)
  }

  return useMemo(() => {
    return balance
  }, [balance])
}
