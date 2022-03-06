import React from 'react'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'
import { createWeb3ReactRoot, Web3ReactProvider } from '@dotoracle/web3-react-core'
import { ThemeProvider } from 'styled-components/macro'
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

ReactGA.initialize('G-826N01LRMN')
ReactGA.pageview(window.location.pathname + window.location.search)

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
