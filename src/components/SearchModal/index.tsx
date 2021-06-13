import { useCallback, useState, useRef, useMemo, useEffect } from 'react'
import {
  EuiOutsideClickDetector,
  EuiModal,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiFieldSearch,
  EuiLoadingSpinner,
} from '@elastic/eui'
// @ts-ignore
import { EuiWindowEvent } from '@elastic/eui/lib/services'
import { isAddress } from 'web3-utils'
import { FixedSizeList } from 'react-window'
import styled from 'styled-components'
import Token from '../../type/Token'
import { filterTokens } from './filtering'
import { useDebounce, useToken, useActiveWeb3React } from '../../hooks'
import { getTokensFromConfig } from '../../utils'
import TokenList from './TokenList'
import ImportRow from './ImportRow'

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

  const { library, chainId, account } = useActiveWeb3React()
  const networkId = chainId ? chainId : Number(process.env.REACT_APP_CHAIN_ID)
  const [tokenList, setTokenList] = useState<Token[]>([])
  const [isFetching, setFetching] = useState(false)

  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedQuery = useDebounce(searchQuery, 200)
  const searchToken = useToken(isAddress(debouncedQuery) ? debouncedQuery : undefined)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true)
        setTokenList(await getTokensFromConfig(account, networkId))
      } catch (error) {
        console.error(error)
      } finally {
        setFetching(false)
      }
    }

    fetchData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [library, chainId, account])

  const filteredTokens: Token[] = useMemo(() => {
    return filterTokens(tokenList, debouncedQuery)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenList, debouncedQuery])

  const onEscKeydown = (e: React.KeyboardEvent) => {
    if (e.key === '27') {
      closeModal()
    }
  }

  const handleInput = useCallback(event => {
    const input = event.target.value
    const checksummedInput = isAddress(input) ? input : false
    setSearchQuery(checksummedInput || input)
  }, [])

  const handleSelect = () => {
    closeModal()
  }

  const onAddCustomToken = () => {
    let _tokens = [] as Token[]
    const data = localStorage.getItem(`tokens_${account}_${chainId}`)

    if (data) {
      _tokens = JSON.parse(data) as Token[]
    }

    if (searchToken) {
      _tokens.unshift(searchToken)
    }

    if (_tokens.length) {
      localStorage.setItem(`tokens_${account}_${chainId}`, JSON.stringify(_tokens))
    }

    closeModal()
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
            <>
              {isFetching ? (
                <EuiLoadingSpinner />
              ) : (
                <>
                  {searchToken ? (
                    <ImportRow token={searchToken} onAddCustomToken={onAddCustomToken} />
                  ) : filteredTokens.length > 0 ? (
                    <TokenList tokenList={filteredTokens} onTokenSelect={handleSelect} />
                  ) : (
                    <NoResultsFound>No results found.</NoResultsFound>
                  )}
                </>
              )}
            </>
          </ModalBody>
        </EuiModal>
      </EuiOutsideClickDetector>
      <EuiWindowEvent event="keydown" handler={onEscKeydown} />
    </>
  )
}

export default SearchModal
