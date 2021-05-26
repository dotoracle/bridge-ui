import { EuiFlexGroup } from '@elastic/eui'
import styled from 'styled-components'

const StyledContainer = styled(EuiFlexGroup)`
  padding: 0 15px;
  margin: 0 auto;
  width: 100%;
  max-width: 80rem;
`

const Container: React.FC = (props) => {
  return <StyledContainer>{props.children}</StyledContainer>
}

export default Container
