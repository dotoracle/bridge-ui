import { EuiHeader, EuiHeaderSectionItem, EuiHeaderLogo } from '@elastic/eui'
import styled from 'styled-components'

import Container from '../Container'
import LogoSVG from '../../assets/images/logo.svg'

const StyledHeder = styled(EuiHeader)`
  height: 80px;
  border-bottom: none;
  box-shadow: none;
`

const StyledLogo = styled(EuiHeaderLogo)`
  width: 80px;
`

const Header: React.FC = () => {
  return (
    <StyledHeder position="fixed">
      <Container>
        <EuiHeaderSectionItem border="none">
          <StyledLogo href="/" iconType={LogoSVG} iconTitle="DotOracle" />
        </EuiHeaderSectionItem>
      </Container>
    </StyledHeder>
  )
}

export default Header
