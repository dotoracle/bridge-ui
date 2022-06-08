import { useContext, useEffect, useState } from 'react'
import { EuiFieldText } from '@elastic/eui'
import { BsLightbulb } from 'react-icons/bs'
import TransferButton from 'components/TransferButton'
import Container from '../Container'
import TokenSelect from '../TokenSelect'
import NetworkBox from '../NetworkBox'
import AmountInput from '../AmountInput'
import ActionButtons from '../ActionButtons'
import TransactionsTable from '../TransactionsTable'
import BridgeAppContext from 'context/BridgeAppContext'
import { useActiveWeb3React, useOtherNetworks, useNetworkInfo } from '../../hooks'
import ArrowSVG from 'assets/images/arrow-right.svg'
import networks from 'config/networks.json'
import Network from 'type/Network'
import { AppBoxWrap, ArrowImage, FormRow, FormWrap, NetworkItem, Reminder, StyledLabel, TableWrap } from './Styled'
import { fromWei } from 'utils'

function AppBox(): JSX.Element {
  const { account, chainId } = useActiveWeb3React()
  const [receipient, setReceipient] = useState('')
  const {
    selectedToken,
    sourceNetwork: sourceNetworkContext,
    targetNetwork: targetNetworkContext,
    setSourceNetwork,
    setTargetNetwork,
  } = useContext(BridgeAppContext)

  const [minBridge, setMinBridge] = useState('0')

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

  useEffect(() => {
    const _minBridge = selectedToken ? selectedToken.minBridge ?? '0' : '0'
    setMinBridge(_minBridge)
  }, [selectedToken])

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onReceipientChange = (e: any) => {
    const { value } = e.target
    setReceipient(value)
  }

  const onClearInput = () => {
    setReceipient('')
  }

  return (
    <Container>
      <AppBoxWrap>
        <FormWrap>
          <FormRow>
            <TokenSelect showNativeToken={sourceNetwork && sourceNetwork.notEVM ? false : true} />
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

          {sourceNetwork?.notEVM && (
            <FormRow>
              <div style={{ width: '100%' }}>
                <StyledLabel>Receiver Address</StyledLabel>
                <EuiFieldText fullWidth value={receipient} onChange={onReceipientChange} />
              </div>
            </FormRow>
          )}

          <FormRow>
            {sourceNetwork?.notEVM ? (
              <TransferButton receipient={receipient} onRefresh={onClearInput} />
            ) : (
              <ActionButtons />
            )}
          </FormRow>

          <Reminder>
            <div>
              <BsLightbulb color="#e2007a" />
              <span>&nbsp;Reminder:</span>
            </div>
            <ul>
              <li>Bridge Fee: 0.1%</li>
              {selectedToken && minBridge != '0' && (
                <li>
                  Minimum Bridge Amount is {fromWei(minBridge, selectedToken.decimals).toNumber()}{' '}
                  {selectedToken.symbol.toUpperCase()}
                </li>
              )}
              <li>Estimated Time of Crosschain Arrival is 3-10 mins</li>
            </ul>
          </Reminder>
        </FormWrap>

        <TableWrap>
          <TransactionsTable />
        </TableWrap>
      </AppBoxWrap>
    </Container>
  )
}

export default AppBox
