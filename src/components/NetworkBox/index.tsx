import { useState } from 'react'
import { EuiPopover, EuiButtonIcon } from '@elastic/eui'
import styled from 'styled-components/macro'
import Network from 'type/Network'
import NetworkList from './NetworkList'
import UnknownSVG from 'assets/images/unknown.svg'

const NetworkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  background-color: #32323c;
  background: linear-gradient(-45deg, #e2007a 0%, #32323c 100%);
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
      width: 40px;
    }
  }
`
const NetworkName = styled.p`
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
  selectedNetwork: Network | undefined
  otherNetwork: Network | undefined
  showDropdown: boolean
  side: 'SOURCE' | 'TARGET'
}

function NetworkBox(props: INetworkBoxProps): JSX.Element {
  const { selectedNetwork, otherNetwork, showDropdown, side } = props
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const onNetworkSelect = () => {
    setIsPopoverOpen(false)
  }

  return (
    <NetworkWrapper>
      {selectedNetwork && otherNetwork ? (
        <>
          <NetworkLogo>
            <img src={selectedNetwork.logoURI ? selectedNetwork.logoURI : UnknownSVG} alt={selectedNetwork.name} />
            {showDropdown && (
              <EuiPopover
                button={
                  <NetworkButton
                    display="fill"
                    iconType="arrowDown"
                    aria-label="Select Network"
                    onClick={() => setIsPopoverOpen(_isPopoverOpen => !_isPopoverOpen)}
                  />
                }
                isOpen={isPopoverOpen}
                closePopover={() => setIsPopoverOpen(false)}
              >
                <NetworkList
                  selectedNetwork={selectedNetwork}
                  otherNetwork={otherNetwork}
                  side={side}
                  onNetworkSelect={onNetworkSelect}
                />
              </EuiPopover>
            )}
          </NetworkLogo>
          <NetworkName>{selectedNetwork.name}</NetworkName>
        </>
      ) : (
        <>
          <NetworkLogo>
            <img src={UnknownSVG} alt="Unknow network logo" />
          </NetworkLogo>
          <NetworkName>Unknow network</NetworkName>
        </>
      )}
    </NetworkWrapper>
  )
}

export default NetworkBox
