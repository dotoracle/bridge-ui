import React from 'react'
import ReactDOM from 'react-dom'
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import { ThemeProvider } from 'styled-components'
import { ToastContainer } from 'react-toastify'
import App from './App'
import theme from './theme'
import { NetworkContextName } from './constants'
import './assets/scss/toastify.scss'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      <ToastContainer />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
