import { Wrapper, NetworkLogo, NetworkName } from './styled'
import Network from '../../type/Network'
import UnknownSVG from '../../assets/images/unknown.svg'

function NetworkInfo({ network }: { network: Network | undefined }): JSX.Element {
  return (
    <Wrapper>
      {network ? (
        <>
          <NetworkLogo src={network.logoURI ? network.logoURI : UnknownSVG} alt={network.name} />
          <NetworkName>{network.name}</NetworkName>
        </>
      ) : (
        <>
          <NetworkLogo src={UnknownSVG} alt="Unknown network" />
          <NetworkName>Unknown network</NetworkName>
        </>
      )}
    </Wrapper>
  )
}

export default NetworkInfo
