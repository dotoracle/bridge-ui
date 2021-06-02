import { useState } from 'react'
import { EuiButton } from '@elastic/eui'
import styled from 'styled-components'
import WalletModal from '../WalletModal'

const StyledButton = styled(EuiButton)`
  @media (min-width: 992px) {
    margin-left: 1.25rem;
  }

  @media (min-width: 1200px) {
    margin-left: 2rem;
  }
`

const AccountButton = (): JSX.Element => {
  const [showWalletModal, setShowWalletModal] = useState(false)

  const closeModal = () => setShowWalletModal(false)
  const showModal = () => setShowWalletModal(true)

  return (
    <>
      <StyledButton fill onClick={showModal}>Connect Wallet</StyledButton>
      {showWalletModal && <WalletModal closeModal={closeModal} />}
    </>
  )
}

export default AccountButton
