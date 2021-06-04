import styled from 'styled-components'
import TokenSelect from '../TokenSelect'
import NetworkBox from '../NetworkBox'
import { useActiveWeb3React, useOtherNetworks, useNetworkInfo } from '../../hooks'
import ArrowSVG from '../../assets/images/arrow-right.svg'

const SwapWrapper = styled.div`
  margin: 3rem auto 0;
  border-radius: 40px;
  padding: 2rem;
  width: 90%;
  max-width: 50rem;
  background-color: #0f0f1e;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.3);

  @media (min-width: 992px) {
    width: 100%;
  }
`
const NetworkWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`
const NetworkItem = styled.div`
  flex: 1 1 0;
`
const ArrowImage = styled.img`
  margin: 0 1rem;
  width: 30px;

  @media (min-width: 768px) {
    margin: 0 1.15rem;
  }
`
const StyledLabel = styled.label`
  display: block;
  margin-bottom: 1rem;
  color: #aeaeb3;
`

const SwapForm = (): JSX.Element => {
  const { account, chainId, library } = useActiveWeb3React()
  const sourceNetwork = useNetworkInfo(chainId, library)
  const otherNetworks = useOtherNetworks(sourceNetwork, library)
  const targetNetwork = otherNetworks[0]

  return (
    <SwapWrapper>
      <TokenSelect />
      <NetworkWrapper>
        <NetworkItem>
          <StyledLabel>From</StyledLabel>
          {typeof sourceNetwork !== 'undefined' && (
            <NetworkBox network={sourceNetwork} showDropdown={account ? false : true} />
          )}
        </NetworkItem>

        <div style={{ alignSelf: 'center', marginTop: '2rem' }}>
          <ArrowImage src={ArrowSVG} alt="" />
        </div>

        <NetworkItem>
          <StyledLabel>To</StyledLabel>
          {typeof targetNetwork !== 'undefined' && <NetworkBox network={targetNetwork} showDropdown={true} />}
        </NetworkItem>
      </NetworkWrapper>
    </SwapWrapper>
  )
}

export default SwapForm
