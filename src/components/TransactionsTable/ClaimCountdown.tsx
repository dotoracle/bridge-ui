import Countdown, { zeroPad } from 'react-countdown'
import styled from 'styled-components/macro'
import { StyledClaimButton } from './styled'
import Network from '../../type/Network'
import Transaction from '../../type/Transaction'

const CountdownText = styled.p`
  font-size: 0.75rem;
  color: #aeaeb5;
`

interface IClaimCountdownProps {
  transaction: Transaction
  network: Network
  isDisabled: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick: (e: any) => Promise<void>
}

function ClaimCountdown(props: IClaimCountdownProps): JSX.Element {
  const { transaction, network, isDisabled, onClick } = props

  return (
    <>
      {transaction.toNetwork?.notEVM ? (
        <>
          <span>Processing</span>
        </>
      ) : (
        <>
          <Countdown
            zeroPadTime={2}
            date={transaction.requestTime * 1000 + (network.confirmations + 1) * (network.blockTime + 10) * 1000}
            renderer={props2 =>
              !props2.completed ? (
                <CountdownText>
                  Claimable in {zeroPad(props2.minutes)}m : {zeroPad(props2.seconds)}s
                </CountdownText>
              ) : (
                <StyledClaimButton isDisabled={isDisabled} onClick={onClick}>
                  Claim Token
                </StyledClaimButton>
              )
            }
          />
        </>
      )}
    </>
  )
}

export default ClaimCountdown
