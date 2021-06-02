import styled from 'styled-components'
import TokenSelect from '../TokenSelect'

const SwapWrapper = styled.div`
  margin: 3rem auto 0;
  border-radius: 40px;
  padding: 2rem;
  width: 100%;
  max-width: 50rem;
  background-color: #0f0f1e;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.3);
`

const SwapForm = (): JSX.Element => {
  return (
    <SwapWrapper>
      <TokenSelect />
    </SwapWrapper>
  )
}

export default SwapForm
