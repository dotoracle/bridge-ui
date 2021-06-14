import { useContext } from 'react'
import { EuiFieldNumber, EuiButton } from '@elastic/eui'
import styled from 'styled-components'
import { useActiveWeb3React, useTokenBalance } from '../../hooks'
import BridgeAppContext from '../../context/BridgeAppContext'
import { formatNumber } from '../../utils'

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
  const { account } = useActiveWeb3React()

  const tokenBalance = useTokenBalance(
    selectedToken ? selectedToken.address : undefined,
    selectedToken ? selectedToken.decimals : undefined,
    account,
    tokenAmount,
  )

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
          Available: {formatNumber(tokenBalance)} {selectedToken.symbol}
        </Description>
      )}
    </AmountInputWrapper>
  )
}

export default AmountInput
