import { useContext } from 'react'
import { TitleWrapper, Title, TitleShadow, SubHeading } from 'styled'
import styled from 'styled-components/macro'
import { EuiFieldText } from '@elastic/eui'
import Container from 'components/Container'
import TokenSelect from 'components/TokenSelect'
import AmountInput from 'components/AmountInput'
import NetworkBox from 'components/NetworkBox'
import BridgeAppContext from 'context/BridgeAppContext'
import { useOtherNetworks, useNetworkInfo, useActiveWeb3React } from 'hooks'
import TransferButton from 'components/TransferButton'

const AppBoxWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin: 3rem auto 0;
  border-radius: 40px;
  padding: 2rem;
  background-color: #0f0f1e;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.3);
  width: 100%;

  @media (min-width: 1200px) {
    width: 50%;
  }
`
const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  width: 100%;
`
const StyledLabel = styled.label`
  display: block;
  margin-bottom: 1rem;
  color: #aeaeb3;
`

function TransferERC20(): JSX.Element {
  const { account, chainId } = useActiveWeb3React()
  const { sourceNetwork: sourceNetworkContext, targetNetwork: targetNetworkContext } = useContext(BridgeAppContext)

  const sourceNetworkHook = useNetworkInfo(chainId)
  const sourceNetwork = sourceNetworkContext ? sourceNetworkContext : sourceNetworkHook

  const otherNetworks = useOtherNetworks(sourceNetwork, account, chainId)
  const targetNetwork = targetNetworkContext ? targetNetworkContext : otherNetworks[0]

  return (
    <>
      <SubHeading>Dot Oracle</SubHeading>
      <TitleWrapper>
        <Title>Cross-chain bridge</Title>
        <TitleShadow>Cross-chain bridge</TitleShadow>
      </TitleWrapper>
      <Container>
        <AppBoxWrap>
          <FormRow>
            <TokenSelect showNativeToken={false} />
          </FormRow>

          <FormRow>
            <AmountInput />
          </FormRow>

          <FormRow>
            <div style={{ width: '100%' }}>
              <StyledLabel>To Chain</StyledLabel>
              <NetworkBox
                selectedNetwork={targetNetwork}
                otherNetwork={sourceNetwork}
                showDropdown={true}
                side="TARGET"
              />
            </div>
          </FormRow>

          <FormRow>
            <div style={{ width: '100%' }}>
              <StyledLabel>Receiver Address</StyledLabel>
              <EuiFieldText fullWidth aria-label="Use aria labels when no actual label is in use" />
            </div>
          </FormRow>

          <FormRow>
            <TransferButton />
          </FormRow>
        </AppBoxWrap>
      </Container>
    </>
  )
}

export default TransferERC20
