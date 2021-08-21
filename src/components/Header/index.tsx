import { EuiHeader, EuiHeaderSectionItem, EuiHeaderLogo, EuiFlexGroup } from '@elastic/eui'
import styled from 'styled-components/macro'
import DesktopNav from './DesktopNav'
import MobileNav from './MobileNav'
import AccountButton from '../AccountButton'
import LogoPNG from '../../assets/images/logo.png'
import LogoMobilePNG from '../../assets/images/logo-mobile.png'

const StyledContainer = styled(EuiFlexGroup)`
  padding: 0 15px;
  margin: 0 auto;
  width: 100%;
  max-width: 1280px;
`
const StyledHeader = styled(EuiHeader)`
  min-height: 80px;
  border-bottom: none;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.4);
  background-color: ${props => props.theme.headerBg};
`
const LogoDekstop = styled(EuiHeaderLogo)`
  display: none;
  padding: 0;

  .euiIcon--large {
    height: auto;
    width: 250px;
  }

  @media (min-width: 992px) {
    display: block;
  }
`
const LogoMobile = styled(EuiHeaderLogo)`
  display: block;
  padding: 0;

  .euiIcon--large {
    height: auto;
    width: 40px;
  }

  @media (min-width: 992px) {
    display: none;
  }
`

function Header(): JSX.Element {
  return (
    <StyledHeader>
      <StyledContainer justifyContent="spaceBetween">
        <EuiHeaderSectionItem border="none">
          <LogoDekstop href="/" iconType={LogoPNG} iconTitle="DotOracle" />
          <LogoMobile href="/" iconType={LogoMobilePNG} iconTitle="DotOracle" />
          <DesktopNav />
        </EuiHeaderSectionItem>

        <EuiHeaderSectionItem border="none">
          <AccountButton />
          <MobileNav />
        </EuiHeaderSectionItem>
      </StyledContainer>
    </StyledHeader>
  )
}

export default Header
