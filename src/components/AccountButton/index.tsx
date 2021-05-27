import { EuiButton } from '@elastic/eui'
import styled from 'styled-components'

const StyledButton = styled(EuiButton)`
  @media (min-width: 992px) {
    margin-left: 1.25rem;
  }

  @media (min-width: 1200px) {
    margin-left: 2rem;
  }
`

const AccountButton: React.FC = () => {
  return (
    <StyledButton fill>Connect Wallet</StyledButton>
  )
}

export default AccountButton
