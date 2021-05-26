import { EuiHeader, EuiHeaderSectionItem, EuiHeaderLogo, EuiFlexGroup } from '@elastic/eui'
import styled from 'styled-components'
import DesktopNav from './DesktopNav'
import LogoPNG from '../../assets/images/logo.png'

const StyledContainer = styled(EuiFlexGroup)`
  padding: 0 15px;
  margin: 0 auto;
  width: 100%;
  max-width: 1280px;

  > div {
    height: 100%;
  }
`
const StyledHeader = styled(EuiHeader)`
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
    <StyledHeader position="fixed">
      <StyledContainer justifyContent="spaceBetween">
        <EuiHeaderSectionItem border="none">
          <StyledLogo href="/" iconType={LogoPNG} iconTitle="DotOracle" />
        </EuiHeaderSectionItem>
        <EuiHeaderSectionItem border="none">
          <DesktopNav />
        </EuiHeaderSectionItem>
      </StyledContainer>
    </StyledHeader>
  )
}

export default Header
