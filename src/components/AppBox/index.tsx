import { useContext, useEffect } from 'react'
import styled from 'styled-components/macro'
import Container from '../Container'
import TokenSelect from '../TokenSelect'
import NetworkBox from '../NetworkBox'
import AmountInput from '../AmountInput'
import ActionButtons from '../ActionButtons'
import TransactionsTable from '../TransactionsTable'
import BridgeAppContext from '../../context/BridgeAppContext'
import { useActiveWeb3React, useOtherNetworks, useNetworkInfo } from '../../hooks'
import ArrowSVG from '../../assets/images/arrow-right.svg'
import networks from '../../config/networks.json'
import Network from '../../type/Network'

const AppBoxWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin: 3rem auto 0;
  border-radius: 40px;
  padding: 2rem 0;
  background-color: #0f0f1e;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.3);

  @media (min-width: 1200px) {
    flex-direction: row;
  }
`
const FormWrap = styled.div`
  flex: 0 0 40%;
  padding-right: 1rem;
  padding-left: 2rem;
`
const TableWrap = styled.div`
  flex: 0 0 60%;
  padding-left: 1rem;
  padding-right: 2rem;
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

function AppBox(): JSX.Element {
  const { account, chainId } = useActiveWeb3React()
  const {
    sourceNetwork: sourceNetworkContext,
    targetNetwork: targetNetworkContext,
    setSourceNetwork,
    setTargetNetwork,
  } = useContext(BridgeAppContext)

  const sourceNetworkHook = useNetworkInfo(chainId)
  const sourceNetwork = sourceNetworkContext ? sourceNetworkContext : sourceNetworkHook

  const otherNetworks = useOtherNetworks(sourceNetwork, account, chainId)
  const targetNetwork = targetNetworkContext ? targetNetworkContext : otherNetworks[0]

  useEffect(() => {
    // set context
    if (sourceNetwork) {
      setSourceNetwork(sourceNetwork)
    }

    if (targetNetwork) {
      setTargetNetwork(targetNetwork)
    }
  }, [sourceNetwork, targetNetwork, account, chainId])

  // refresh context if change account
  useEffect(() => {
    let _networks = networks as Network[]
    if (sourceNetworkHook) {
      _networks = networks.filter(
        n => n.isTestnet === sourceNetworkHook.isTestnet && n.chainId !== sourceNetworkHook.chainId,
      ) as Network[]
      setSourceNetwork(sourceNetworkHook)
    }

    if (targetNetwork && _networks.length > 0 && targetNetwork.chainId !== _networks[0].chainId) {
      setTargetNetwork(_networks[0])
    }
  }, [account, chainId])

  return (
    <Container>
      <AppBoxWrap>
        <FormWrap>
          <FormRow>
            <TokenSelect showNativeToken={true} />
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
              <NetworkBox
                selectedNetwork={targetNetwork}
                otherNetwork={sourceNetwork}
                showDropdown={true}
                side="TARGET"
              />
            </NetworkItem>
          </FormRow>

          <FormRow>
            <AmountInput />
          </FormRow>

          <FormRow>
            <ActionButtons />
          </FormRow>
        </FormWrap>

        <TableWrap>
          <TransactionsTable />
        </TableWrap>
      </AppBoxWrap>
    </Container>
  )
}

export default AppBox
