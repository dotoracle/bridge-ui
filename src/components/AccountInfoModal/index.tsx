import {
  EuiOutsideClickDetector,
  EuiModal,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiModalFooter,
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHorizontalRule,
  EuiIcon,
} from '@elastic/eui'
import styled from 'styled-components/macro'
import { NativeTokenAddress } from '../../constants'
import { useActiveWeb3React, useNetworkInfo, useTokenBalance } from 'hooks'
import { useEffect } from 'react'
import { useState } from 'react'

interface IAccountInfoModal {
  closeModal: () => void
}

const AccountAddress = styled.h2`
  font-weight: 600;
  margin-bottom: 1rem;
`

function AccountInfoModal(props: IAccountInfoModal): JSX.Element {
  const { closeModal } = props

  const { account, deactivate, chainId, library } = useActiveWeb3React()

  const networkInfo = useNetworkInfo(chainId)
  const tokenBalance = useTokenBalance(
    NativeTokenAddress,
    networkInfo?.nativeCurrency.decimals,
    account,
    library,
    0,
    networkInfo,
  )

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
            <p>
              Balance: {tokenBalance} {networkInfo?.nativeCurrency.symbol}
            </p>
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
            <EuiButton onClick={deactivate}>Logout</EuiButton>
            <EuiButton onClick={closeModal}>Close</EuiButton>
          </EuiModalFooter>
        </EuiModal>
      </EuiOutsideClickDetector>
    </>
  )
}

export default AccountInfoModal
