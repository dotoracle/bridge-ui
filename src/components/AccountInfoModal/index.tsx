import {
  EuiOutsideClickDetector,
  EuiModal,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiModalFooter,
  EuiButton,
  EuiLoadingContent,
} from '@elastic/eui'
import styled from 'styled-components/macro'
import { NATIVE_TOKEN_ADDERSS } from '../../constants'
import { useActiveWeb3React, useNetworkInfo, useTokenBalanceCallback } from 'hooks'
import { useContext, useEffect, useState } from 'react'
import BridgeAppContext from 'context/BridgeAppContext'
import Web3 from 'web3'

interface IAccountInfoModal {
  closeModal: () => void
}

const AccountAddress = styled.h2`
  font-weight: 600;
  margin-bottom: 1rem;
`

function AccountInfoModal(props: IAccountInfoModal): JSX.Element {
  const { closeModal } = props
  const { account: web3Account, deactivate, chainId: web3ChainId, library: web3Library } = useActiveWeb3React()
  const { ledgerAddress, setLedgerAddress, sourceNetwork } = useContext(BridgeAppContext)

  const account = ledgerAddress !== '' ? ledgerAddress : web3Account
  const chainId = ledgerAddress !== '' ? sourceNetwork?.chainId : web3ChainId

  const networkInfo = useNetworkInfo(chainId)
  const library = ledgerAddress !== '' ? new Web3.providers.HttpProvider(networkInfo?.rpcURL ?? '') : web3Library

  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  const [tokenBalance, setTokenBalance] = useState(0)
  const tokenBalanceCallback = useTokenBalanceCallback(
    NATIVE_TOKEN_ADDERSS,
    networkInfo?.nativeCurrency.decimals,
    account,
    library,
    0,
    networkInfo,
  )

  const loadTokenBalance = async () => {
    setIsLoadingBalance(true)
    const _tokenBalance = await tokenBalanceCallback()
    setTokenBalance(_tokenBalance)
    setIsLoadingBalance(false)
  }

  useEffect(() => {
    loadTokenBalance()
  }, [account, chainId])

  const onLogout = () => {
    if (ledgerAddress != '') {
      setLedgerAddress('')
    } else {
      deactivate()
    }
  }

  return (
    <>
      <EuiOutsideClickDetector onOutsideClick={closeModal}>
        <EuiModal onClose={closeModal}>
          <EuiModalHeader>
            <EuiModalHeaderTitle>
              <h1>Your Account</h1>
            </EuiModalHeaderTitle>
          </EuiModalHeader>

          <EuiModalBody>
            <AccountAddress>{account}</AccountAddress>
            {isLoadingBalance ? (
              <EuiLoadingContent lines={1} />
            ) : (
              <p>
                Balance: {tokenBalance > 0 ? tokenBalance.toFixed(4) : 0} {networkInfo?.nativeCurrency.symbol}
              </p>
            )}
          </EuiModalBody>

          <EuiModalFooter>
            <EuiButton
              fill
              iconType="link"
              iconSide="right"
              target="_blank"
              href={`${networkInfo?.explorer}/${networkInfo?.notEVM ? 'account' : 'address'}/${account}`}
            >
              View in Explorer
            </EuiButton>
            <EuiButton onClick={onLogout}>Logout</EuiButton>
            <EuiButton onClick={closeModal}>Close</EuiButton>
          </EuiModalFooter>
        </EuiModal>
      </EuiOutsideClickDetector>
    </>
  )
}

export default AccountInfoModal
