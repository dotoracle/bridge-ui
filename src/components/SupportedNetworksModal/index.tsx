import {
  EuiOutsideClickDetector,
  EuiModal,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiFieldSearch,
} from '@elastic/eui'
import { useActiveWeb3React, useAllNetworks, useDebounce, useNetworkInfo } from 'hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components/macro'
import Network from 'type/Network'
import { filterNetworks } from './filtering'
import NetworkList from './NetworkList'

const BreakLine = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
  border-top: 1px solid #333;
`
const NoResultsFound = styled.p`
  text-align: center;
  color: #6c7284;
`

interface IAccountInfoModal {
  closeModal: () => void
}

function SupportedNetworksModal(props: IAccountInfoModal): JSX.Element {
  const { closeModal } = props
  const { chainId } = useActiveWeb3React()
  const currentNetwork = useNetworkInfo(chainId)
  const networks = useAllNetworks(currentNetwork?.isTestnet)
  const [networkList, setNetworkList] = useState<Network[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedQuery = useDebounce(searchQuery, 200)

  const handleInput = useCallback(event => {
    const input = event.target.value
    setSearchQuery(input)
  }, [])

  const handleSelect = () => {
    closeModal()
  }

  const filteredNetworks: Network[] = useMemo(() => {
    return filterNetworks(networkList, debouncedQuery)
  }, [networkList, debouncedQuery])

  useEffect(() => {
    setNetworkList(networks)
  })

  return (
    <>
      <EuiOutsideClickDetector onOutsideClick={closeModal}>
        <EuiModal onClose={closeModal}>
          <EuiModalHeader>
            <EuiModalHeaderTitle>
              <h1>Supported Networks</h1>
            </EuiModalHeaderTitle>
          </EuiModalHeader>

          <EuiModalBody>
            <EuiFieldSearch
              name="search-network"
              value={searchQuery}
              autoComplete="off"
              placeholder="Search name or chain id"
              onChange={handleInput}
            />
            <BreakLine />
            {filteredNetworks.length > 0 ? (
              <NetworkList networkList={filteredNetworks} onSelectNetwork={handleSelect} />
            ) : (
              <NoResultsFound>No results found.</NoResultsFound>
            )}
          </EuiModalBody>
        </EuiModal>
      </EuiOutsideClickDetector>
    </>
  )
}

export default SupportedNetworksModal
