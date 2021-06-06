import { useState, useContext } from 'react'
import { EuiButton } from '@elastic/eui'
import styled from 'styled-components'
import WalletModal from '../WalletModal'
import { useActiveWeb3React, useTokenBalance } from '../../hooks'
import BridgeAppContext from '../../context/BridgeAppContext'

const StepButtons = (): JSX.Element => {
  const { selectedToken } = useContext(BridgeAppContext)
  const { account } = useActiveWeb3React()

  const tokenBalance = useTokenBalance(
    selectedToken ? selectedToken.address : undefined,
    selectedToken ? selectedToken.decimals : undefined,
    account,
  )

  const [showWalletModal, setShowWalletModal] = useState(false)

  return (
    <div>
      {account ? (
        <></>
      ) : (
        <>
          <EuiButton fill onClick={() => setShowWalletModal(true)}>
            Unlock Wallet
          </EuiButton>
          {showWalletModal && <WalletModal closeModal={() => setShowWalletModal(false)} />}
        </>
      )}
    </div>
  )
}

export default StepButtons
