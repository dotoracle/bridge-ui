import { useContext, useEffect } from 'react'
import styled from 'styled-components'
import TokenSelect from '../TokenSelect'
import NetworkBox from '../NetworkBox'
import AmountInput from '../AmountInput'
import ActionButtons from '../ActionButtons'
import BridgeAppContext from '../../context/BridgeAppContext'
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
const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
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
  const {
    sourceNetwork: sourceNetworkContext,
    targetNetwork: targetNetworkContext,
    setSourceNetwork,
    setTargetNetwork,
  } = useContext(BridgeAppContext)

  const sourceNetworkHook = useNetworkInfo(chainId, library)
  const sourceNetwork = sourceNetworkContext ? sourceNetworkContext : sourceNetworkHook

  const otherNetworks = useOtherNetworks(sourceNetwork, library)
  const targetNetwork = targetNetworkContext ? targetNetworkContext : otherNetworks[0]

  useEffect(() => {
    // set context
    if (sourceNetwork) {
      setSourceNetwork(sourceNetwork)
    }

    if (targetNetwork) {
      setTargetNetwork(targetNetwork)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceNetwork, targetNetwork])

  return (
    <SwapWrapper>
      <FormRow>
        <TokenSelect />
      </FormRow>

      <FormRow>
        <NetworkItem>
          <StyledLabel>From</StyledLabel>
          <NetworkBox
            selectedNetwork={sourceNetwork}
            otherNetwork={targetNetwork}
            showDropdown={account ? false : true}
            side="SOURCE"
          />
        </NetworkItem>

        <div style={{ alignSelf: 'center', marginTop: '2rem' }}>
          <ArrowImage src={ArrowSVG} alt="" />
        </div>

        <NetworkItem>
          <StyledLabel>To</StyledLabel>
          <NetworkBox selectedNetwork={targetNetwork} otherNetwork={sourceNetwork} showDropdown={true} side="TARGET" />
        </NetworkItem>
      </FormRow>

      <FormRow>
        <AmountInput />
      </FormRow>

      <FormRow>
        <ActionButtons />
      </FormRow>
    </SwapWrapper>
  )
}

export default SwapForm
