import { useState, useContext } from 'react'
import { EuiButton } from '@elastic/eui'
import styled from 'styled-components'
import UnknownSVG from '../../assets/images/unknown.svg'
import BridgeAppContext from '../../context/BridgeAppContext'
import SearchModal from '../SearchModal'

const Label = styled.label`
  display: block;
  margin-bottom: 1rem;
  color: #aeaeb3;
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
  color: #fff;
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

const TokenSelect = (): JSX.Element => {
  const { selectedToken } = useContext(BridgeAppContext)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const closeModal = () => setIsModalVisible(false)
  const showModal = () => setIsModalVisible(true)

  return (
    <>
      <Label>Assets</Label>
      {selectedToken ? (
        <SelectButton iconType="arrowRight" iconSide="right" onClick={showModal}>
          <TokenLogo src={selectedToken.logoURI ? selectedToken.logoURI : UnknownSVG} alt={selectedToken.symbol} />
          {selectedToken.symbol}
        </SelectButton>
      ) : (
        <SelectButton iconType="arrowRight" iconSide="right" onClick={showModal}>
          Select a Token
        </SelectButton>
      )}
      {isModalVisible && <SearchModal closeModal={closeModal} />}
    </>
  )
}

export default TokenSelect
