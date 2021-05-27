import { EuiHeader, EuiHeaderSectionItem, EuiHeaderLogo, EuiFlexGroup, EuiShowFor } from '@elastic/eui'
import styled from 'styled-components'
import DesktopNav from './DesktopNav'
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
  box-shadow: none;
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

const Header: React.FC = () => {
  return (
    <StyledHeader position="fixed">
      <StyledContainer justifyContent="spaceBetween">
        <EuiHeaderSectionItem border="none">
          <LogoDekstop href="/" iconType={LogoPNG} iconTitle="DotOracle" />
          <LogoMobile href="/" iconType={LogoMobilePNG} iconTitle="DotOracle" />
        </EuiHeaderSectionItem>
        <EuiHeaderSectionItem border="none">
          <EuiShowFor sizes={['m', 'l', 'xl']}>
            <DesktopNav />
          </EuiShowFor>
          <AccountButton />
        </EuiHeaderSectionItem>
      </StyledContainer>
    </StyledHeader>
  )
}

export default Header
