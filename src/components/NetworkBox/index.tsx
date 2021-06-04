import { useState } from 'react'
import { EuiPopover, EuiButtonIcon } from '@elastic/eui'
import styled from 'styled-components'
import Network from '../../type/Network'
import NetworkList from './NetworkList'
import UnknownSVG from '../../assets/images/unknown.svg'

const NetworkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  background-color: #32323c;
  background: linear-gradient(135deg, #e2007a 0%, #32323c 100%);
  border-radius: 0.5rem;
  min-height: 7.5rem;
`
const NetworkLogo = styled.div`
  display: flex;
  justify-content: space-between;

  img {
    width: 30px;
  }

  @media (min-width: 768px) {
    img {
      width: 50px;
    }
  }
`
const ChooseNetwork = styled.div`
  display: flex;
  align-items: flex-end;
`
const NetworkName = styled.p`
  flex: 1 1 0;
  font-size: 0.75rem;
  line-height: 1.5;
  color: #e6e8ea;

  @media (min-width: 768px) {
    font-size: 0.875rem;
  }
`
const NetworkButton = styled(EuiButtonIcon)`
  &.euiButtonIcon--fill {
    background-color: #fff;
    border-color: #fff;

    &:hover,
    &:focus {
      background-color: ${props => props.theme.primary} !important;
      border-color: ${props => props.theme.primary} !important;
    }
  }
`

interface INetworkBoxProps {
  network: Network
  showDropdown: boolean
}

const NetworkBox = (props: INetworkBoxProps): JSX.Element => {
  const { network, showDropdown } = props
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  return (
    <NetworkWrapper>
      {network && (
        <>
          <NetworkLogo>
            <img src={network.logoURI ? network.logoURI : UnknownSVG} alt={network.name} />
            {showDropdown && (
              <EuiPopover
                button={
                  <NetworkButton
                    display="fill"
                    iconType="arrowDown"
                    onClick={() => setIsPopoverOpen(_isPopoverOpen => !_isPopoverOpen)}
                  />
                }
                isOpen={isPopoverOpen}
                closePopover={() => setIsPopoverOpen(false)}
              >
                <NetworkList selectedNetwork={network} />
              </EuiPopover>
            )}
          </NetworkLogo>
          <ChooseNetwork>
            <NetworkName>{network.name}</NetworkName>
          </ChooseNetwork>
        </>
      )}
    </NetworkWrapper>
  )
}

export default NetworkBox
