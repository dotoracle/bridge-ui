import {
  EuiButton,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOutsideClickDetector,
} from '@elastic/eui'
import BridgeAppContext from 'context/BridgeAppContext'
import { useContext } from 'react'
import styled from 'styled-components/macro'

const StyledOl = styled.ol`
  line-height: 3;
  color: #dfe5ef;
`

interface ILedgerWarningModal {
  closeModal: () => void
}

function LedgerWarningModal(props: ILedgerWarningModal): JSX.Element {
  const { closeModal } = props
  const { sourceNetwork } = useContext(BridgeAppContext)

  return (
    <>
      <EuiOutsideClickDetector onOutsideClick={closeModal}>
        <EuiModal onClose={closeModal}>
          <EuiModalHeader>
            <EuiModalHeaderTitle>
              <h1>Before proceeding make sure</h1>
            </EuiModalHeaderTitle>
          </EuiModalHeader>

          <EuiModalBody>
            <StyledOl>
              <li>1. Ledger Live app is closed</li>
              <li>2. The device is plugged in via USB, NOT bluetooth</li>
              <li>3. The device is unlocked and in the {sourceNetwork?.name} app</li>
              <li>4. "Blind Signing" is enabled in the {sourceNetwork?.name} app</li>
            </StyledOl>
          </EuiModalBody>

          <EuiModalFooter>
            <EuiButton onClick={closeModal}>Contiune</EuiButton>
            <EuiButton fill iconType="arrowRight" iconSide="right">
              Next
            </EuiButton>
          </EuiModalFooter>
        </EuiModal>
      </EuiOutsideClickDetector>
    </>
  )
}

export default LedgerWarningModal
