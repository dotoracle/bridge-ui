import { useContext, useEffect, useState } from 'react'
import { EuiFieldNumber, EuiButton, EuiLoadingContent } from '@elastic/eui'
import styled from 'styled-components/macro'
import { useActiveWeb3React, useNetworkInfo, useTokenBalanceCallback } from 'hooks'
import BridgeAppContext from 'context/BridgeAppContext'

const AmountInputWrapper = styled.div`
  width: 100%;
`
const StyledLabel = styled.label`
  display: block;
  margin-bottom: 1rem;
  color: #aeaeb3;
`
const Input = styled(EuiFieldNumber)`
  padding: 1rem;
`
const Button = styled(EuiButton)`
  &.euiButton.euiButton--primary {
    color: #fff;
    background-color: ${props => props.theme.primary}1a;
    border-color: ${props => props.theme.primary};

    &:hover,
    &:focus {
      background-color: ${props => props.theme.primary};
    }
  }
`
const Description = styled.p`
  font-size: 0.75rem;
  color: #76808f;
  margin-top: 0.75rem;
`

function AmountInput(): JSX.Element {
  const { selectedToken, tokenAmount, setTokenAmount } = useContext(BridgeAppContext)
  const { account, chainId, library } = useActiveWeb3React()
  const networkInfo = useNetworkInfo(chainId)

  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  const [tokenBalance, setTokenBalance] = useState(0)
  const tokenBalanceCallback = useTokenBalanceCallback(
    selectedToken ? selectedToken.address : undefined,
    selectedToken ? selectedToken.decimals : undefined,
    account,
    library,
    tokenAmount,
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
  }, [account, chainId, selectedToken])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChange = (e: any) => {
    const _value = e.target.value
    setTokenAmount(_value)
  }

  const onMax = () => {
    setTokenAmount(tokenBalance)
  }

  return (
    <AmountInputWrapper>
      <StyledLabel>Amount</StyledLabel>
      <Input
        fullWidth
        min={0}
        max={tokenBalance}
        step={0.1}
        value={tokenAmount}
        onChange={onChange}
        append={<Button onClick={onMax}>Max</Button>}
      />
      {selectedToken && (
        <Description>
          {isLoadingBalance ? (
            <EuiLoadingContent lines={1} />
          ) : (
            <span>
              Available: {tokenBalance.toFixed(4)} {selectedToken.symbol}
            </span>
          )}
        </Description>
      )}
    </AmountInputWrapper>
  )
}

export default AmountInput
