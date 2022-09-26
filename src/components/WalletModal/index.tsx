import { useContext, useState } from 'react'
import { EuiModal, EuiModalHeader, EuiModalHeaderTitle, EuiModalBody, EuiButton } from '@elastic/eui'
// @ts-ignore
import { EuiWindowEvent } from '@elastic/eui/lib/services'
import { useWeb3React, UnsupportedChainIdError } from '@dotoracle/web3-react-core'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from '@web3-react/walletconnect-connector'
import { toast } from 'react-toastify'
import styled from 'styled-components/macro'
import ToastMessage from '../ToastMessage'
import { ConnectorNames, connectorsByName } from 'connectors'
import { connectorLocalStorageKey } from '../../constants'
import MetaMaskSVG from '../../assets/images/metamask.svg'
import OXKJPED from '../../assets/images/okx-wallet.jpeg'
import TorusPNG from '../../assets/images/torus.png'
import CasperPNG from '../../assets/images/casper.png'
import LedgerPNG from '../../assets/images/ledger-wallet.png'
import PontemWalletPNG from 'assets/images/pontem-wallet.png'
import LedgerModal from 'components/LedgerModal/LedgerModal'
import BridgeAppContext from 'context/BridgeAppContext'
import { setupNetwork } from 'utils'

const WalletButton = styled(EuiButton)`
  margin-bottom: 1rem;
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

  &:last-child {
    margin-bottom: 0;
  }

  &.euiButton-isDisabled {
    .euiButton__text {
      color: #757678;
    }

    img {
      opacity: 0.4;
    }
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
  const { sourceNetwork } = useContext(BridgeAppContext)
  const { activate } = useWeb3React()
  const [isLoadingOKX, setIsLoadingOKX] = useState(false)
  const [isLoadingTorus, setIsLoadingTorus] = useState(false)
  const [isLoadingCasper, setIsLoadingCasper] = useState(false)
  const [isLoadingLedger, setIsLoadingLedger] = useState(false)
  const [isLoadingPontem, setIsLoadingPontem] = useState(false)
  const [showLedgerModal, setShowLedgerModal] = useState(false)

  const onConnectWallet = async (connectorID: ConnectorNames) => {
    const connector = connectorsByName[connectorID]

    if (sourceNetwork && connectorID != ConnectorNames.Ledger) {
      await setupNetwork(sourceNetwork)
    }

    if (connector) {
      window.localStorage.setItem(connectorLocalStorageKey, connectorID)

      if (connectorID === ConnectorNames.TorusWallet) {
        setIsLoadingTorus(true)
      }

      if (connectorID === ConnectorNames.CasperSigner) {
        setIsLoadingCasper(true)
      }

      if (connectorID === ConnectorNames.OKXWallet) {
        setIsLoadingOKX(true)
      }

      if (connectorID === ConnectorNames.Ledger) {
        setIsLoadingLedger(true)
        setShowLedgerModal(true)
        return
      }

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
      setIsLoadingTorus(false)
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

  const closeLedgerModal = () => {
    setShowLedgerModal(false)
    setIsLoadingLedger(false)
  }

  return (
    <>
      <EuiModal onClose={closeModal}>
        <EuiModalHeader>
          <EuiModalHeaderTitle>
            <h1>Connect wallet</h1>
          </EuiModalHeaderTitle>
        </EuiModalHeader>

        <EuiModalBody>
          <WalletButton isDisabled={sourceNetwork?.notEVM} onClick={() => onConnectWallet(ConnectorNames.Injected)}>
            <span>Metamask</span>
            <WalletLogo src={MetaMaskSVG} alt="Metamask" />
          </WalletButton>
          <WalletButton
            isDisabled={sourceNetwork?.notEVM}
            isLoading={isLoadingOKX}
            onClick={() => onConnectWallet(ConnectorNames.OKXWallet)}
          >
            <span>OKX Wallet</span>
            <WalletLogo src={OXKJPED} alt="OKX Wallet" />
          </WalletButton>
          <WalletButton
            isDisabled={!sourceNetwork?.notEVM}
            isLoading={isLoadingTorus}
            onClick={() => onConnectWallet(ConnectorNames.TorusWallet)}
          >
            <span>Torus (for Casper)</span>
            <WalletLogo src={TorusPNG} alt="Torus" />
          </WalletButton>
          <WalletButton
            isDisabled={!sourceNetwork?.notEVM}
            isLoading={isLoadingCasper}
            onClick={() => onConnectWallet(ConnectorNames.CasperSigner)}
          >
            <span>Casper Signer</span>
            <WalletLogo src={CasperPNG} alt="Casper Signer" />
          </WalletButton>
          <WalletButton
            isDisabled={sourceNetwork?.notEVM}
            isLoading={isLoadingLedger}
            onClick={() => onConnectWallet(ConnectorNames.Ledger)}
          >
            <span>Ledger Wallet</span>
            <WalletLogo src={LedgerPNG} alt="Ledger Wallet" />
          </WalletButton>
          {/* <WalletButton
            isDisabled={sourceNetwork?.notEVM}
            isLoading={isLoadingPontem}
            onClick={() => onConnectWallet(ConnectorNames.PontemWallet)}
          >
            <span>Pontem Wallet</span>
            <WalletLogo src={PontemWalletPNG} alt="Pontem Wallet" />
          </WalletButton> */}
        </EuiModalBody>
      </EuiModal>
      <EuiWindowEvent event="keydown" handler={onEscKeydown} />
      {showLedgerModal && <LedgerModal closeModal={closeLedgerModal} />}
    </>
  )
}

export default WalletModal
