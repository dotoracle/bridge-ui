import { EuiFlexItem, EuiText } from '@elastic/eui'
import { FaTwitter, FaGithub, FaTelegramPlane } from 'react-icons/fa'
import Container from '../Container'
import styled from 'styled-components'

const StyledFooter = styled.div`
  padding-top: 1rem;
  padding-bottom: 1rem;
  background-color: ${props => props.theme.footerBg};
  color: #fff;
`
const SocialLinks = styled.ul`
  @media (min-width: 768px) {
    text-align: right;
  }
`
const SocialItem = styled.li`
  display: inline-block;
  vertial-align: middle;
  margin-right: 2rem;

  @media (min-width: 768px) {
    margin-right: 0;
    margin-left: 2rem;
  }

  a {
    color: #fff;
    transition: 0.5s ease all;

    &:hover {
      color: ${props => props.theme.primary};
    }
  }
`

const Footer = (): JSX.Element => {
  return (
    <StyledFooter>
      <Container justifyContent="spaceBetween">
        <EuiFlexItem>
          <EuiText>Copyright &copy; {new Date().getFullYear()} DotOracle</EuiText>
        </EuiFlexItem>
        <EuiFlexItem>
          <SocialLinks>
            <SocialItem>
              <a href="https://t.me/dotoracle" target="_blank" rel="nofollw noreferrer noopener">
                <FaTelegramPlane size="1.5rem" />
              </a>
            </SocialItem>
            <SocialItem>
              <a href="https://twitter.com/DotOracle" target="_blank" rel="nofollw noreferrer noopener">
                <FaTwitter size="1.5rem" />
              </a>
            </SocialItem>
            <SocialItem>
              <a href="https://github.com/dotoracle" target="_blank" rel="nofollw noreferrer noopener">
                <FaGithub size="1.5rem" />
              </a>
            </SocialItem>
          </SocialLinks>
        </EuiFlexItem>
      </Container>
    </StyledFooter>
  )
}

export default Footer
