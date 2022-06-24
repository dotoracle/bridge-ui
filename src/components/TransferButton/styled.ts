import styled from 'styled-components/macro'
import { EuiButton } from '@elastic/eui'

export const StyledButton = styled(EuiButton)`
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  height: auto;

  &:not(.euiButton-isDisabled) {
    box-shadow: 0 0 10px ${props => props.theme.primary}96;

    &:hover {
      box-shadow: 0 0 20px ${props => props.theme.primary}96;
    }
  }
`
export const UnlockButton = styled(EuiButton)`
  padding: 0.75rem 0.5rem;
  width: 48%;
  height: auto;

  &:not(.euiButton-isDisabled) {
    box-shadow: 0 0 10px ${props => props.theme.primary}96;

    &:hover {
      box-shadow: 0 0 20px ${props => props.theme.primary}96;
    }
  }
`

export const TokenAmount = styled.span`
  color: ${props => props.theme.primary};
  line-height: 2;
  font-weight: 500;
`
export const NetworkLogo = styled.img`
  margin-right: 0.25rem;
  margin-left: 0.25rem;
  margin-bottom: 0 !important;
  display: inline-block !important;
  vertical-align: baseline !important;
  height: 18px !important;
  width: 18px !important;
`
