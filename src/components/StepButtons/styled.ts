import styled from 'styled-components'
import { EuiButton } from '@elastic/eui'

export const StepButton = styled(EuiButton)`
  .euiButton__text {
    display: flex;
    align-items: center;
  }

  &.euiButton-isDisabled span {
    color: #757678;
  }
`
export const StepNumber = styled.span`
  display: inline-block;
  margin-right: 0.5rem;
  width: 24px;
  height: 24px;
  border-radius: 100%;
  opacity: 0.8;
  line-height: 24px;
  font-size: 0.75rem;
  color: ${props => props.theme.primary};
  background-color: #fff;
`
