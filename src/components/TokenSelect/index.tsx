import { useState } from 'react'
import { EuiButton } from '@elastic/eui'
import styled from 'styled-components'
import TokenSearchModal from '../TokenSearchModal'

const Label = styled.label`
  display: block;
  margin-bottom: 1rem;
  color: #aeaeb3;
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
`

const TokenSelect = (): JSX.Element => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const closeModal = () => setIsModalVisible(false)
  const showModal = () => setIsModalVisible(true)

  return (
    <>
      <Label>Assets</Label>
      <SelectButton iconType="arrowRight" iconSide="right" onClick={showModal}>
        Select a Token
      </SelectButton>
      {isModalVisible && <TokenSearchModal closeModal={closeModal} />}
    </>
  )
}

export default TokenSelect
