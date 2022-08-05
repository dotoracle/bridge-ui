import { useActiveWeb3React } from 'hooks'
import { MutableRefObject, useContext } from 'react'
import { FixedSizeList } from 'react-window'
import styled from 'styled-components/macro'
import Network from 'type/Network'
import NetworkRow from './NetworkRow'
import { connectorLocalStorageKey } from '../../constants'
import { caspersigner, ConnectorNames, injected, torus } from 'connectors'
import { setupNetwork } from 'utils'
import ToastMessage from 'components/ToastMessage'
import { toast } from 'react-toastify'
import BridgeAppContext from 'context/BridgeAppContext'

const NetworkListDiv = styled.div`
  height: 280px;
  overflow: hidden;
`

interface INetworkListProps {
  networkList: Network[]
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  onSelectNetwork: () => void
}

function NetworkList(props: INetworkListProps): JSX.Element {
  const { networkList, onSelectNetwork } = props
  const {
    setSelectedToken,
    setTokenAmount,
    setSourceNetwork,
    setTargetNetwork,
    sourceNetwork,
    targetNetwork: targetNetworkContext,
  } = useContext(BridgeAppContext)
  const { account, deactivate, activate } = useActiveWeb3React()

  const onSetupNetwork = async (network: Network) => {
    try {
      if (targetNetworkContext?.chainId == network.chainId && sourceNetwork) {
        setTargetNetwork(sourceNetwork)
      }
      setSourceNetwork(network)
      setSelectedToken(undefined)
      setTokenAmount(0)

      if (!account) {
        return
      }

      let hasSetup = false

      // if current network is Casper
      if (sourceNetwork?.notEVM) {
        window.localStorage.removeItem(connectorLocalStorageKey)
        deactivate()

        window.localStorage.setItem(connectorLocalStorageKey, ConnectorNames.Injected)
        await activate(injected, async (error: Error) => {
          console.error(error)
        })

        window.location.reload()
      }

      // if we switch to Casper
      if (network.notEVM) {
        window.localStorage.removeItem(connectorLocalStorageKey)
        deactivate()

        if (window.casperlabsHelper === undefined) {
          window.localStorage.setItem(connectorLocalStorageKey, ConnectorNames.TorusWallet)
          await activate(torus, async (error: Error) => {
            console.error(error)
          })
        } else {
          window.localStorage.setItem(connectorLocalStorageKey, ConnectorNames.CasperSigner)
          await activate(caspersigner, async (error: Error) => {
            console.error(error)
          })
        }

        window.location.reload()
      }

      hasSetup = await setupNetwork(network)

      if (!hasSetup) {
        toast.error(<ToastMessage color="danger" headerText="Error!" bodyText="Could not switch network" />, {
          toastId: 'setupNetwork',
        })
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // we only care if the error is something _other_ than the user rejected the tx
      if (error?.code !== 4001) {
        toast.error(<ToastMessage color="danger" headerText="Error!" bodyText="Could not setup network" />, {
          toastId: 'setupNetwork',
        })
        console.error(error)
      }
    } finally {
      onSelectNetwork()
    }
  }

  return (
    <>
      {networkList.length > 0 && (
        <NetworkListDiv>
          <div className="eui-yScrollWithShadows">
            {networkList.map(network => (
              <NetworkRow
                key={network.chainId}
                network={network}
                isSelected={Boolean(network && network.chainId === sourceNetwork?.chainId)}
                onSelect={() => {
                  if (network) {
                    onSetupNetwork(network)
                  }
                }}
              />
            ))}
          </div>
        </NetworkListDiv>
      )}
    </>
  )
}

export default NetworkList
