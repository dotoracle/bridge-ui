import { useState, useContext } from 'react'
import { EuiButton } from '@elastic/eui'
import BridgeAppContext from '../../context/BridgeAppContext'
import WalletModal from '../WalletModal'
import ApproveButton from './ApproveButton'
import { useActiveWeb3React, useTokenBalance, useTokenContract, useBridgeAddress, useBridgeContract } from '../../hooks'
import { StyledButton } from './styled'

const ActionButtons = (): JSX.Element => {
  const { selectedToken, sourceNetwork, targetNetwork } = useContext(BridgeAppContext)
  const { account, chainId } = useActiveWeb3React()

  const tokenBalance = useTokenBalance(
    selectedToken ? selectedToken.address : undefined,
    selectedToken ? selectedToken.decimals : undefined,
    account,
  )

  const [showWalletModal, setShowWalletModal] = useState(false)

  const bridgeAddress = useBridgeAddress(chainId)
  const tokenContract = useTokenContract(selectedToken?.address)
  const bridgeContract = useBridgeContract(bridgeAddress)

  return (
    <>
      {account ? (
        <>
          {selectedToken ? (
            <>
              <ApproveButton
                selectedToken={selectedToken}
                tokenBalance={tokenBalance}
                tokenContract={tokenContract}
                bridgeAddress={bridgeAddress}
                targetNetwork={targetNetwork}
                sourceNetwork={sourceNetwork}
                account={account}
              />
            </>
          ) : (
            <StyledButton fill isDisabled>
              Select a token to transfer
            </StyledButton>
          )}
        </>
      ) : (
        <>
          <StyledButton fill onClick={() => setShowWalletModal(true)}>
            Unlock Wallet
          </StyledButton>
          {showWalletModal && <WalletModal closeModal={() => setShowWalletModal(false)} />}
        </>
      )}
    </>
  )
}

export default ActionButtons
