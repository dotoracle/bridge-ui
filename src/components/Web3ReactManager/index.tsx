import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { network } from '../../connectors'
import { useEagerConnect, useInactiveListener } from '../../hooks'
import { NetworkContextName } from '../../constants'

function Web3ReactManager({ children }: { children: JSX.Element }): JSX.Element | null {
  const { active } = useWeb3React()
  const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React(NetworkContextName)

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate it
  useEffect(() => {
    if (triedEager && !networkActive && !networkError && !active) {
      activateNetwork(network)
    }
  }, [triedEager, networkActive, networkError, activateNetwork, active])

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  useInactiveListener(!triedEager)

  // on page load, do nothing until we've tried to connect to the injected connector
  if (!triedEager) {
    return null
  }

  // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
  if (!active && networkError) {
    return <p>Oops! An unknown error occurred. Please refresh the page, or visit from another browser or device.</p>
  }

  return children
}

export default Web3ReactManager
