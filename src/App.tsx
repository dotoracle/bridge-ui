import styled from 'styled-components/macro'
import { useState } from 'react'
import BridgeAppContext from './context/BridgeAppContext'
import Token from './type/Token'
import Network from './type/Network'
import GlobalStyle from './theme/global'
import Web3ReactManager from './components/Web3ReactManager'
import Header from './components/Header'
import Footer from './components/Footer'
import PageBackgroundPNG from './assets/images/page-bg.png'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import '@elastic/eui/dist/eui_theme_dark.css'
import './assets/fonts/stylesheet.css'
import Home from 'pages/Home'
import Explorer from 'pages/Explorer'
import AppEth from '@ledgerhq/hw-app-eth'

const PageContainer = styled.div`
  min-height: calc(100vh - 160px);
  background-image: url(${PageBackgroundPNG});
  background-size: cover;
  background-attachment: fixed;
  padding-top: 3rem;
  padding-bottom: 3rem;
`
function App(): JSX.Element {
  const [selectedToken, setSelectedToken] = useState<Token>()
  const [tokenAmount, setTokenAmount] = useState(0)
  const [sourceNetwork, setSourceNetwork] = useState<Network>()
  const [targetNetwork, setTargetNetwork] = useState<Network>()
  const [ledgerAddress, setLedgerAddress] = useState('')
  const [ledgerPath, setLedgerPath] = useState('')
  const [appEth, setAppEth] = useState<AppEth>()

  return (
    <Web3ReactManager>
      <BridgeAppContext.Provider
        value={{
          selectedToken,
          setSelectedToken,
          tokenAmount,
          setTokenAmount,
          sourceNetwork,
          setSourceNetwork,
          targetNetwork,
          setTargetNetwork,
          ledgerAddress,
          setLedgerAddress,
          ledgerPath,
          setLedgerPath,
          appEth,
          setAppEth,
        }}
      >
        <GlobalStyle />
        <Router>
          <Header />
          <PageContainer>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explorer" element={<Explorer />} />
            </Routes>
          </PageContainer>
          <Footer />
        </Router>
      </BridgeAppContext.Provider>
    </Web3ReactManager>
  )
}

export default App
