import { useEffect, useState } from 'react'
import { EuiTextAlign, EuiButton } from '@elastic/eui'
import styled from 'styled-components/macro'
import WalletModal from '../WalletModal'
import AccountInfoModal from '../AccountInfoModal'
import { useActiveWeb3React, useNetworkInfo, useTokenBalanceCallback } from 'hooks'
import { NATIVE_TOKEN_ADDERSS } from '../../constants'
import SupportedNetworksModal from 'components/SupportedNetworksModal'

const NetworkLogo = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 100%;
  margin-right: 0;

  @media (min-width: 768px) {
    margin-right: 0.5rem;
  }
`
const NetworkButton = styled(EuiButton)`
  padding: 0;
  margin-right: 1rem;
  background-color: #98a2b333;
  border: none;
  min-width: 40px;

  @media (min-width: 768px) {
    min-width: 110px;
  }
`
const NetworkButtonInner = styled.div`
  display: flex;
  align-items: center;
  font-weight: 400;
  text-transform: none;

  span {
    display: none;

    @media (min-width: 768px) {
      display: block;
    }
  }
`
const ButtonWrap = styled.div`
  display: flex;
  align-items: center;

  @media (min-width: 992px) {
    margin-left: 1.25rem;
  }

  @media (min-width: 1200px) {
    margin-left: 2rem;
  }
`
const TokenBalance = styled.div`
  display: none;
  padding: 0 1rem;
  background-color: #32323c;
  height: 40px;
  line-height: 40px;
  border-radius: 4px;

  @media (min-width: 768px) {
    display: block;
  }
`
const StyledButton = styled(EuiButton)`
  height: auto;
  min-height: 40px;
`

function AccountButton(): JSX.Element {
  const { account, chainId, library } = useActiveWeb3React()
  const accountEllipsis = account ? `${account.substring(0, 4)}...${account.substring(account.length - 4)}` : ''

  const [showWalletModal, setShowWalletModal] = useState(false)
  const [showAccountModal, setShowAccountModal] = useState(false)
  const [showSupportedNetworkModal, setShowSupportedNetworkModal] = useState(false)

  const networkInfo = useNetworkInfo(chainId)

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
    const _tokenBalance = await tokenBalanceCallback()
    setTokenBalance(_tokenBalance)
  }

  useEffect(() => {
    loadTokenBalance()
  }, [account, chainId])

  return (
    <>
      {account ? (
        <>
          <ButtonWrap>
            <NetworkButton color="text" onClick={() => setShowSupportedNetworkModal(true)}>
              <NetworkButtonInner>
                {networkInfo && networkInfo.logoURI && <NetworkLogo src={networkInfo.logoURI} alt={networkInfo.name} />}
                <span>{networkInfo && networkInfo.name}</span>
              </NetworkButtonInner>
            </NetworkButton>
            <TokenBalance>
              {tokenBalance > 0 ? tokenBalance.toFixed(4) : 0} {networkInfo?.nativeCurrency.symbol}
            </TokenBalance>
            <StyledButton fill onClick={() => setShowAccountModal(true)}>
              <EuiTextAlign textAlign="left">{accountEllipsis}</EuiTextAlign>
            </StyledButton>
          </ButtonWrap>
          {showAccountModal && <AccountInfoModal closeModal={() => setShowAccountModal(false)} />}
          {showSupportedNetworkModal && (
            <SupportedNetworksModal closeModal={() => setShowSupportedNetworkModal(false)} />
          )}
        </>
      ) : (
        <>
          <StyledButton fill onClick={() => setShowWalletModal(true)}>
            Connect Wallet
          </StyledButton>
          {showWalletModal && <WalletModal closeModal={() => setShowWalletModal(false)} />}
        </>
      )}
    </>
  )
}

export default AccountButton
