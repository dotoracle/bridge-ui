import { useState } from 'react'
import { EuiTextAlign, EuiButton } from '@elastic/eui'
import styled from 'styled-components'
import WalletModal from '../WalletModal'
import { useActiveWeb3React, useNetworkInfo } from '../../hooks'

const NetworkLogo = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 100%;
  margin-right: 0.5rem;
`
const NetworkName = styled.p`
  font-size: 10px;
  text-transform: none;
`
const ButtonInner = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
`
const StyledButton = styled(EuiButton)`
  height: auto;
  min-height: 40px;

  @media (min-width: 992px) {
    margin-left: 1.25rem;
  }

  @media (min-width: 1200px) {
    margin-left: 2rem;
  }
`

const AccountButton = (): JSX.Element => {
  const { account, chainId, library } = useActiveWeb3React()
  const accountEllipsis = account ? `${account.substring(0, 4)}...${account.substring(account.length - 4)}` : null

  const [showWalletModal, setShowWalletModal] = useState(false)

  const closeModal = () => setShowWalletModal(false)
  const showModal = () => setShowWalletModal(true)

  const networkInfo = useNetworkInfo(chainId, library)

  return (
    <>
      {account ? (
        <>
          <StyledButton fill onClick={showModal}>
            <ButtonInner>
              {networkInfo && networkInfo.logoURI && <NetworkLogo src={networkInfo.logoURI} alt={networkInfo.name} />}
              <EuiTextAlign textAlign="left">
                {accountEllipsis}
                <NetworkName>{networkInfo && networkInfo.name}</NetworkName>
              </EuiTextAlign>
            </ButtonInner>
          </StyledButton>
        </>
      ) : (
        <>
          <StyledButton fill onClick={showModal}>
            Connect Wallet
          </StyledButton>
          {showWalletModal && <WalletModal closeModal={closeModal} />}
        </>
      )}
    </>
  )
}

export default AccountButton
