import { useCallback, useState, useRef, useMemo, useContext } from 'react'
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
import { useDebounce, useToken } from '../../hooks'
import TokenList from './TokenList'
import TokenRow from './TokenRow'
import BridgeAppContext from '../../context/BridgeAppContext'
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
const NoResultsFound = styled.p`
  text-align: center;
  color: #6c7284;
`

interface ITokenSearchModalProps {
  closeModal: () => void
}

const SearchModal = (props: ITokenSearchModalProps): JSX.Element => {
  const { closeModal } = props
  const { token: selectedToken, setToken } = useContext(BridgeAppContext)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedQuery = useDebounce(searchQuery, 200)
  const searchToken = useToken(isAddress(debouncedQuery) ? debouncedQuery : undefined)

  const filteredTokens: Token[] = useMemo(() => {
    return filterTokens(tokens, debouncedQuery)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens, debouncedQuery])

  const onEscKeydown = (e: React.KeyboardEvent) => {
    if (e.key === '27') {
      closeModal()
    }
  }

  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>()

  const handleInput = useCallback(event => {
    const input = event.target.value
    const checksummedInput = isAddress(input) ? input : false
    setSearchQuery(checksummedInput || input)
    fixedList.current?.scrollTo(0)
  }, [])

  const handleSelect = () => {
    closeModal()
  }

  const handleSelectSearchToken = () => {
    if (searchToken) {
      setToken(searchToken)
      closeModal()
    }
  }

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
              autoComplete="off"
              placeholder="Search name or paste address"
              onChange={handleInput}
            />
            <BreakLine />
            {searchToken ? (
              <TokenRow
                token={searchToken}
                isSelected={selectedToken?.address === searchToken.address}
                onSelect={handleSelectSearchToken}
              />
            ) : filteredTokens.length > 0 ? (
              <AutoSizer defaultHeight={280} disableWidth>
                {({ height }) => (
                  <TokenList
                    height={height}
                    tokenList={filteredTokens}
                    fixedListRef={fixedList}
                    onTokenSelect={handleSelect}
                  />
                )}
              </AutoSizer>
            ) : (
              <NoResultsFound>No results found.</NoResultsFound>
            )}
          </ModalBody>
        </EuiModal>
      </EuiOutsideClickDetector>
      <EuiWindowEvent event="keydown" handler={onEscKeydown} />
    </>
  )
}

export default SearchModal
