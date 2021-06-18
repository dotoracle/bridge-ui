import {
  EuiOutsideClickDetector,
  EuiModal,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiButton,
} from '@elastic/eui'
// @ts-ignore
import { EuiWindowEvent } from '@elastic/eui/lib/services'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from '@web3-react/walletconnect-connector'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import ToastMessage from '../ToastMessage'
import { ConnectorNames, connectorsByName } from '../../connectors'
import { connectorLocalStorageKey } from '../../constants'
import MetaMaskSVG from '../../assets/images/metamask.svg'

const WalletButton = styled(EuiButton)`
  width: 100%;
  height: auto;
  background-color: #32323c;
  border-color: transparent !important;

  .euiButton__content {
    padding: 1rem;
  }

  .euiButton__text {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    color: #fff;
  }

  &:hover,
  &:focus {
    background-color: ${props => props.theme.primary}0d !important;
    border-color: ${props => props.theme.primary} !important;
  }
`

const WalletLogo = styled.img`
  height: 2rem;
  border-radius: 100%;
`

interface IWalletModalProps {
  closeModal: () => void
}

function WalletModal(props: IWalletModalProps): JSX.Element {
  const { closeModal } = props
  const { activate } = useWeb3React()

  const onConnectWallet = async (connectorID: ConnectorNames) => {
    const connector = connectorsByName[connectorID]

    if (connector) {
      window.localStorage.setItem(connectorLocalStorageKey, connectorID)

      await activate(connector, async (error: Error) => {
        if (error instanceof UnsupportedChainIdError) {
          toast.error(
            <ToastMessage color="danger" headerText="Wrong network" bodyText="Please check your chain id." />,
            {
              toastId: connectorID,
            },
          )
        } else if (error instanceof NoEthereumProviderError) {
          toast.error(<ToastMessage color="danger" headerText="No provider was found" />, {
            toastId: connectorID,
          })
        } else if (
          error instanceof UserRejectedRequestErrorInjected ||
          error instanceof UserRejectedRequestErrorWalletConnect
        ) {
          if (connector instanceof WalletConnectConnector) {
            const walletConnector = connector as WalletConnectConnector
            walletConnector.walletConnectProvider = null
          }
          toast.error(<ToastMessage color="danger" headerText="Please authorize to access your account" />, {
            toastId: connectorID,
          })
        } else {
          toast.error(<ToastMessage color="danger" headerText={error.name} bodyText={error.message} />, {
            toastId: connectorID,
          })
        }
      })
    } else {
      toast.error(<ToastMessage color="danger" headerText="Can't find connector" />, {
        toastId: connectorID,
      })
    }

    closeModal()
  }

  const onEscKeydown = (e: React.KeyboardEvent) => {
    if (e.key === '27') {
      closeModal()
    }
  }

  return (
    <>
      <EuiOutsideClickDetector onOutsideClick={closeModal}>
        <EuiModal onClose={closeModal}>
          <EuiModalHeader>
            <EuiModalHeaderTitle>
              <h1>Connect wallet</h1>
            </EuiModalHeaderTitle>
          </EuiModalHeader>

          <EuiModalBody>
            <WalletButton onClick={() => onConnectWallet(ConnectorNames.Injected)}>
              <span>Metamask</span>
              <WalletLogo src={MetaMaskSVG} alt="Metamask" />
            </WalletButton>
          </EuiModalBody>
        </EuiModal>
      </EuiOutsideClickDetector>
      <EuiWindowEvent event="keydown" handler={onEscKeydown} />
    </>
  )
}

export default WalletModal
