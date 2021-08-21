import { EuiFlexGroup, EuiFlexGroupProps } from '@elastic/eui'
import styled from 'styled-components/macro'

const StyledContainer = styled(EuiFlexGroup)`
  padding: 0 15px;
  margin: 0 auto;
  width: 100%;
  max-width: 1280px;
  justify-content: ${props => props.justifyContent};

  > div {
    height: 100%;
  }
`

function Container(props: EuiFlexGroupProps): JSX.Element {
  return <StyledContainer>{props.children}</StyledContainer>
}

export default Container
