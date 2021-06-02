import { useCallback, useState, useRef, useMemo } from 'react'
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
import { isAddress } from 'web3-utils'
import { FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import styled from 'styled-components'
import Token from '../../type/Token'
import { filterTokens } from './filtering'
import { useDebounce } from '../../hooks'
import TokenList from './TokenList'
import tokens from '../../tokens/tokenlist.json'

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
  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedQuery = useDebounce(searchQuery, 200)

  // if they input an address, use it
  const isAddressSearch = isAddress(debouncedQuery)

  //  const searchToken = useToken(debouncedQuery)
  const filteredTokens: Token[] = useMemo(() => {
    return filterTokens(tokens, debouncedQuery)
  }, [tokens, debouncedQuery])

  console.log(filteredTokens)

  const onEscKeydown = (e: React.KeyboardEvent) => {
    if (e.key === '27') {
      closeModal()
    }
  }

  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>()

  const handleInput = useCallback(event => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
    fixedList.current?.scrollTo(0)
  }, [])

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
            <EuiFieldSearch
              name="search-token"
              value={searchQuery}
              placeholder="Search name or paste address"
              onChange={handleInput}
            />
            <BreakLine />
            <AutoSizer defaultHeight={280} disableWidth>
              {({ height }) => <TokenList height={height} tokenList={filteredTokens} fixedListRef={fixedList} />}
            </AutoSizer>
          </ModalBody>
        </EuiModal>
      </EuiOutsideClickDetector>
      <EuiWindowEvent event="keydown" handler={onEscKeydown} />
    </>
  )
}

export default SearchModal
