import { useState } from 'react'
import { EuiButton } from '@elastic/eui'
import styled from 'styled-components'
import WalletModal from '../WalletModal'
import { useActiveWeb3React } from '../../hooks'

const StyledButton = styled(EuiButton)`
  @media (min-width: 992px) {
    margin-left: 1.25rem;
  }

  @media (min-width: 1200px) {
    margin-left: 2rem;
  }
`

const AccountButton = (): JSX.Element => {
  const { account } = useActiveWeb3React()
  const accountEllipsis = account ? `${account.substring(0, 4)}...${account.substring(account.length - 4)}` : null

  const [showWalletModal, setShowWalletModal] = useState(false)

  const closeModal = () => setShowWalletModal(false)
  const showModal = () => setShowWalletModal(true)

  return (
    <>
      {account ? (
        <StyledButton fill onClick={showModal}>
          {accountEllipsis}
        </StyledButton>
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
