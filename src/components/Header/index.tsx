import { EuiHeader, EuiHeaderSectionItem, EuiHeaderLogo } from '@elastic/eui'
import Container from '../Container'
import LogoSVG from '../../assets/images/logo.svg'

const Header: React.FC = () => {
  return (
    <EuiHeader position="fixed">
      <Container>
        <EuiHeaderSectionItem border="none">
          <EuiHeaderLogo href="/" iconType={LogoSVG} iconTitle="DotOracle" />
        </EuiHeaderSectionItem>
      </Container>
    </EuiHeader>
  )
}

export default Header
