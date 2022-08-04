import { useState, useContext, useEffect } from 'react'
import { EuiButton } from '@elastic/eui'
import styled from 'styled-components/macro'
import UnknownSVG from '../../assets/images/unknown.svg'
import BridgeAppContext from '../../context/BridgeAppContext'
import SearchModal from '../SearchModal'
import { getTokensFromConfig } from 'utils'
import { useActiveWeb3React } from 'hooks'
import { NATIVE_TOKEN_ADDERSS } from '../../constants'

const Label = styled.label`
  display: block;
  margin-bottom: 1rem;
  color: #aeaeb3;
`
const TokenSelectWrapper = styled.div`
  width: 100%;
`
const TokenLogo = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 100%;
  margin-right: 0.75rem;
`
const SelectButton = styled(EuiButton)`
  width: 100%;
  border: 0;
  color: #fff !important;
  background-color: #32323c;

  .euiButtonContent {
    justify-content: space-between;
  }

  &:hover,
  &:focus {
    box-shadow: 0 4px 8px 0 ${props => props.theme.primary}26, 0 2px 2px -1px ${props => props.theme.primary}4d !important;
    background-color: #32323c !important;
  }

  .euiButton__text {
    display: flex;
  }
`

interface ITokenSelect {
  showNativeToken: boolean
}

function TokenSelect(props: ITokenSelect): JSX.Element {
  const { showNativeToken } = props
  const { selectedToken, sourceNetwork, setSelectedToken, ledgerAddress } = useContext(BridgeAppContext)
  const { account: web3Account, chainId: web3ChainId } = useActiveWeb3React()

  const account = ledgerAddress !== '' ? ledgerAddress : web3Account
  const chainId = ledgerAddress !== '' ? sourceNetwork?.chainId : web3ChainId

  // const networkId = chainId ? chainId : Number(process.env.REACT_APP_CHAIN_ID)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const closeModal = () => setIsModalVisible(false)
  const showModal = () => setIsModalVisible(true)

  useEffect(() => {
    const fetchData = async () => {
      const tokens = await getTokensFromConfig(account, chainId)

      if (tokens.length > 0) {
        const nativeToken = tokens.find(t => t.address === NATIVE_TOKEN_ADDERSS)
        setSelectedToken(nativeToken)
      }
    }

    fetchData()
  }, [chainId])

  return (
    <TokenSelectWrapper>
      <Label>Assets</Label>
      {selectedToken ? (
        <SelectButton iconType="arrowRight" iconSide="right" onClick={showModal}>
          <TokenLogo src={selectedToken.logoURI ? selectedToken.logoURI : UnknownSVG} alt={selectedToken.symbol} />
          {selectedToken.symbol ?? selectedToken.name}
        </SelectButton>
      ) : (
        <SelectButton iconType="arrowRight" iconSide="right" onClick={showModal}>
          Select a Token
        </SelectButton>
      )}
      {isModalVisible && <SearchModal showNativeToken={showNativeToken} closeModal={closeModal} />}
    </TokenSelectWrapper>
  )
}

export default TokenSelect
