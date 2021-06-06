import { useState, useContext } from 'react'
import { EuiFieldText, EuiButton } from '@elastic/eui'
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
const Input = styled(EuiFieldText)`
  padding: 1rem;
`
const Button = styled(EuiButton)`
  &.euiButton.euiButton--primary {
    color: #fff;
    border-color: #fff;

    &:hover,
    &:focus {
      border-color: ${props => props.theme.secondary};
      background-color: ${props => props.theme.primary}1a;
    }
  }
`
const Description = styled.p`
  font-size: 0.75rem;
  color: #76808f;
  margin-top: 0.75rem;
`

const AmountInput = (): JSX.Element => {
  const [value, setValue] = useState(0)
  const { selectedToken } = useContext(BridgeAppContext)
  const { account } = useActiveWeb3React()

  const tokenBalance = useTokenBalance(
    selectedToken ? selectedToken.address : undefined,
    selectedToken ? selectedToken.decimals : undefined,
    account,
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChange = (e: any) => {
    const regex = /^[0-9\b]+$/
    const _value = e.target.value

    if (_value === '' || regex.test(_value)) {
      setValue(_value)
    }
  }

  const onMax = () => {
    setValue(tokenBalance)
  }

  return (
    <AmountInputWrapper>
      <StyledLabel>Amount</StyledLabel>
      <Input fullWidth value={value} onChange={onChange} append={<Button onClick={onMax}>Max</Button>} />
      {selectedToken && (
        <Description>
          Your {selectedToken.symbol} amount: {formatNumber(tokenBalance)}
        </Description>
      )}
    </AmountInputWrapper>
  )
}

export default AmountInput
