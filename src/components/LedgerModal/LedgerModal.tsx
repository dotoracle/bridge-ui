import {
  EuiButton,
  EuiFieldText,
  EuiFlexGroup,
  EuiLoadingSpinner,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOutsideClickDetector,
} from '@elastic/eui'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import EthApp from '@ledgerhq/hw-app-eth'
import CasperApp from '@zondax/ledger-casper'
import BridgeAppContext from 'context/BridgeAppContext'
import { useContext, useState } from 'react'
import styled from 'styled-components/macro'
import ToastMessage from 'components/ToastMessage'
import { toast } from 'react-toastify'
import { useNetworkInfo } from 'hooks'
import { Keys } from 'casper-js-sdk'

const StyledOl = styled.ol`
  line-height: 3;
  color: #dfe5ef;
`
const StyledButton = styled(EuiButton)`
  margin-bottom: 1rem;
  padding: 1rem 1.5rem;
  text-transform: none !important;
  font-weight: 500;
  color: #8a8a8a;
  border-color: #8a8a8a;

  &:hover {
    color: #fff;
  }

  &.is-selected {
    color: #fff;
    background-color: rgba(255, 255, 255, 0.1);
  }

  &.is-wallet-selected {
    color: #fff;
    background-color: rgba(255, 255, 255, 0.1);
  }
`
const HDPathInput = styled(EuiFieldText)`
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 4px;
  border: 1px solid #8a8a8a;
  height: 40px;
  text-align: center;
  color: #fff;
  background-color: transparent;

  &:focus {
    background-image: none;
    background-color: rgba(255, 255, 255, 0.1);
  }

  &::-webkit-input-placeholder {
    color: #8a8a8a;
  }

  &:-ms-input-placeholder {
    color: #8a8a8a;
  }

  &::placeholder {
    color: #8a8a8a;
  }
`
const WalletList = styled.div`
  width: 100%;
  height: 280px;
  overflow: hidden;
`

interface ILedgerWarningModal {
  closeModal: () => void
}

function LedgerModal(props: ILedgerWarningModal): JSX.Element {
  const { closeModal } = props
  const { sourceNetwork, setLedgerAddress, setLedgerPath, setLedgerApp } = useContext(BridgeAppContext)

  const networkInfo = useNetworkInfo(sourceNetwork?.chainId)

  const [step, setStep] = useState(1)
  const [pathType, setPathType] = useState(0)
  const [path, setPath] = useState('')
  const [disableButton, setDisableButton] = useState(true)
  const [isLoading, setLoading] = useState(false)
  const [isButtonLoading, setButtonLoading] = useState(false)
  const [accountList, setAddressList] = useState<{ address: string; path: string }[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAddress, setSelectedAddress] = useState('')
  const [selectedPath, setSelectedPath] = useState('')

  const onSelectedPath = (id: number) => {
    setPathType(id)

    switch (id) {
      case 1:
        setPath("44'/60'/x'/0/0")
        setDisableButton(false)
        break
      case 2:
        setPath("44'/60'/0'/x")
        setDisableButton(false)
        break
      case 3:
        setPath("m/44'/506'/0'/0/x")
        setDisableButton(false)
        break
      default:
        setPath('')
        setDisableButton(true)
        break
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPathChanged = (e: any) => {
    const { value } = e.currentTarget
    setDisableButton(value === '')

    if (value) {
      setPath(value)
    }
  }

  const onLoadAddresses = async (loadingButton: boolean) => {
    try {
      if (!loadingButton) {
        setLoading(true)
      }
      setButtonLoading(true)
      const transport = await TransportWebUSB.create()

      // is Casper
      let _ledgerApp
      if (sourceNetwork?.notEVM) {
        _ledgerApp = new CasperApp(transport)
      } else {
        _ledgerApp = new EthApp(transport)
      }
      setLedgerApp(_ledgerApp)
      setStep(3)

      const _list = accountList

      // Load first 5 wallets
      if (path.includes('x')) {
        for (let i = currentIndex; i < currentIndex + 5; i++) {
          const currentPath = path.replace('x', i.toString())

          if (_ledgerApp instanceof EthApp) {
            const account = await _ledgerApp.getAddress(currentPath, false)
            _list.push({ address: account.address, path: currentPath })
          } else if (_ledgerApp instanceof CasperApp) {
            const account = await _ledgerApp.getAddressAndPubKey(currentPath)
            const { publicKey } = account
            const accountHash = Keys.Secp256K1.accountHex(publicKey)
            _list.push({ address: accountHash, path: currentPath })
          }
        }

        setAddressList(_list)
        setCurrentIndex(currentIndex + 5)
      } else {
        if (_ledgerApp instanceof EthApp) {
          const account = await _ledgerApp.getAddress(path)
          setAddressList([{ address: account.address, path }])
        } else if (_ledgerApp instanceof CasperApp) {
          const account = await _ledgerApp.getAddressAndPubKey(path)
          const accountHash = Keys.Secp256K1.accountHex(account.publicKey)
          setAddressList([{ address: accountHash, path }])
        }
        setCurrentIndex(0)
      }
    } catch (error) {
      toast.error(
        <ToastMessage color="danger" headerText="Error" bodyText="Unable to connect your hardware wallet" />,
        {
          toastId: 'onLoadAddresses',
        },
      )
      console.error(error)
      closeModal()
    } finally {
      if (!loadingButton) {
        setLoading(false)
      }
      setButtonLoading(false)
    }
  }

  const onSelectAccount = (account: { address: string; path: string }) => {
    setSelectedAddress(account.address)
    setSelectedPath(account.path)
  }

  const onCofirm = () => {
    setLedgerAddress(selectedAddress)
    setLedgerPath(selectedPath)
    closeModal()
  }

  return (
    <>
      <EuiOutsideClickDetector onOutsideClick={closeModal}>
        <EuiModal onClose={closeModal}>
          <EuiModalHeader>
            <EuiModalHeaderTitle>
              <h1>
                {step == 1 && <span>Before proceeding make sure</span>}
                {step == 2 && <span>Select a derivation path</span>}
                {step == 3 && <span>Available Ledger Account</span>}
              </h1>
            </EuiModalHeaderTitle>
          </EuiModalHeader>

          <EuiModalBody>
            {step == 1 && (
              <StyledOl>
                <li>1. Ledger Live app is closed</li>
                <li>2. The device is plugged in via USB, NOT bluetooth</li>
                <li>
                  3. The device is unlocked and in the {sourceNetwork?.notEVM ? sourceNetwork?.name : 'Ethereum'} app
                </li>
                <li>
                  4. "Blind Signing" is enabled in the {sourceNetwork?.notEVM ? sourceNetwork?.name : 'Ethereum'} app
                </li>
              </StyledOl>
            )}
            {step == 2 && (
              <>
                {networkInfo?.notEVM ? (
                  <StyledButton
                    fullWidth
                    color="ghost"
                    className={pathType == 3 ? 'is-selected' : ''}
                    iconType={pathType == 3 ? 'check' : ''}
                    onClick={() => onSelectedPath(3)}
                  >
                    m/44'/506'/0'/0/x
                  </StyledButton>
                ) : (
                  <>
                    <StyledButton
                      fullWidth
                      color="ghost"
                      className={pathType == 1 ? 'is-selected' : ''}
                      iconType={pathType == 1 ? 'check' : ''}
                      onClick={() => onSelectedPath(1)}
                    >
                      44'/60'/x'/0/0
                    </StyledButton>
                    <StyledButton
                      fullWidth
                      color="ghost"
                      className={pathType == 2 ? 'is-selected' : ''}
                      iconType={pathType == 2 ? 'check' : ''}
                      onClick={() => onSelectedPath(2)}
                    >
                      44'/60'/0'/x
                    </StyledButton>
                  </>
                )}
                <HDPathInput placeholder="Custom path" onFocus={() => onSelectedPath(0)} onChange={onPathChanged} />
              </>
            )}
            {step == 3 && (
              <EuiFlexGroup alignItems="center" direction="column" justifyContent="center" gutterSize="none">
                {isLoading ? (
                  <EuiLoadingSpinner size="l" />
                ) : (
                  <>
                    {accountList.length > 0 && (
                      <>
                        <WalletList>
                          <div className="eui-yScroll">
                            {accountList.map(account => (
                              <StyledButton
                                key={account.address}
                                fullWidth
                                className={selectedAddress == account.address ? 'is-wallet-selected' : ''}
                                color="ghost"
                                iconType={selectedAddress == account.address ? 'check' : ''}
                                onClick={() => onSelectAccount(account)}
                              >
                                {account.address.substring(0, 8)}...
                                {account.address.substring(account.address.length - 6)}
                              </StyledButton>
                            ))}
                          </div>
                        </WalletList>
                      </>
                    )}
                  </>
                )}
              </EuiFlexGroup>
            )}
          </EuiModalBody>

          <EuiModalFooter>
            {step == 1 && <EuiButton onClick={closeModal}>Cancel</EuiButton>}
            {step == 1 && (
              <EuiButton fill iconType="arrowRight" iconSide="right" onClick={() => setStep(step + 1)}>
                Continue
              </EuiButton>
            )}
            {step == 2 && (
              <EuiButton fill isDisabled={disableButton} isLoading={isLoading} onClick={() => onLoadAddresses(false)}>
                Confirm
              </EuiButton>
            )}
            {step == 3 && (
              <>
                {!isLoading && (
                  <EuiButton onClick={() => onLoadAddresses(true)} isLoading={isButtonLoading}>
                    Load more...
                  </EuiButton>
                )}
                <EuiButton fill isDisabled={selectedAddress == ''} isLoading={isLoading} onClick={onCofirm}>
                  Confirm
                </EuiButton>
              </>
            )}
          </EuiModalFooter>
        </EuiModal>
      </EuiOutsideClickDetector>
    </>
  )
}

export default LedgerModal
