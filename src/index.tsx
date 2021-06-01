import React from 'react'
import ReactDOM from 'react-dom'
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import App from './App'
import { ThemeProvider } from 'styled-components'
import theme from './theme'
import { NetworkContextName } from './constants'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

const getLibrary = (provider: any) => {
  return provider
}

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ProviderNetwork getLibrary={getLibrary}>
          <App />
        </Web3ProviderNetwork>
      </Web3ReactProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
