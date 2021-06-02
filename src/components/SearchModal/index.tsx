import {
  EuiOutsideClickDetector,
  EuiModal,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiFieldSearch,
} from '@elastic/eui'
// @ts-ignore
import { EuiWindowEvent } from '@elastic/eui/lib/services'
import AutoSizer from 'react-virtualized-auto-sizer'
import styled from 'styled-components'
import TokenList from './TokenList'

const BreakLine = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
  border-top: 1px solid #333;
`

const ModalBody = styled(EuiModalBody)`
  min-height: 370px;

  .euiModalBody__overflow {
    overflow: hidden;
  }
`

interface ITokenSearchModalProps {
  closeModal: () => void
}

const SearchModal = (props: ITokenSearchModalProps): JSX.Element => {
  const { closeModal } = props

  return (
    <>
      <EuiOutsideClickDetector onOutsideClick={closeModal}>
        <EuiModal onClose={closeModal} initialFocus="[name=search-token]" style={{ width: '420px' }}>
          <EuiModalHeader>
            <EuiModalHeaderTitle>
              <h1>Select a token</h1>
            </EuiModalHeaderTitle>
          </EuiModalHeader>

          <ModalBody>
            <EuiFieldSearch name="search-token" placeholder="Search name or paste address" />
            <BreakLine />
            <AutoSizer defaultHeight={280} disableWidth>
              {({ height }) => <TokenList height={height} />}
            </AutoSizer>
          </ModalBody>
        </EuiModal>
      </EuiOutsideClickDetector>
      <EuiWindowEvent event="keydown" handler={closeModal} />
    </>
  )
}

export default SearchModal
