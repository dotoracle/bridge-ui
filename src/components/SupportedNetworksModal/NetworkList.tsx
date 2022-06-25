import { useActiveWeb3React, useNetworkInfo } from 'hooks'
import { MutableRefObject } from 'react'
import { FixedSizeList } from 'react-window'
import styled from 'styled-components/macro'
import Network from 'type/Network'
import NetworkRow from './NetwokrRow'
import { connectorLocalStorageKey } from '../../constants'
import { caspersigner, ConnectorNames, injected, torus } from 'connectors'
import { setupNetwork } from 'utils'
import ToastMessage from 'components/ToastMessage'
import { toast } from 'react-toastify'

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
  const { chainId, deactivate, activate } = useActiveWeb3React()
  const currentNetwork = useNetworkInfo(chainId)

  const onSetupNetwork = async (network: Network) => {
    try {
      let hasSetup = false

      // if current network is Casper
      if (currentNetwork?.notEVM) {
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
                isSelected={Boolean(network && currentNetwork && network.chainId === currentNetwork.chainId)}
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
