import { EuiHeader, EuiHeaderSectionItem, EuiHeaderLogo } from '@elastic/eui'
import styled from 'styled-components'

import Container from '../Container'
import LogoPNG from '../../assets/images/logo.png'

const StyledHeder = styled(EuiHeader)`
  height: 80px;
  border-bottom: none;
  box-shadow: none;
  background-color: ${props => props.theme.headerBg};
`

const StyledLogo = styled(EuiHeaderLogo)`
  padding: 0;

  .euiIcon--large {
    width: 250px;
    height: auto;
  }
`

const Header: React.FC = () => {
  return (
    <StyledHeder position="fixed">
      <Container>
        <EuiHeaderSectionItem border="none">
          <StyledLogo href="/" iconType={LogoPNG} iconTitle="DotOracle" />
        </EuiHeaderSectionItem>
      </Container>
    </StyledHeder>
  )
}

export default Header
