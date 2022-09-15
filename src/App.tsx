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
import EthApp from '@ledgerhq/hw-app-eth'
import CasperApp from '@zondax/ledger-casper'

const PageContainer = styled.div`
  min-height: calc(100vh - 160px);
  background-image: url(${PageBackgroundPNG});
  background-size: cover;
  background-attachment: fixed;
  padding-top: 3rem;
  padding-bottom: 3rem;
`
const Notification = styled.div`
  padding: 1rem;
  text-align: center;
  font-size: 12px;
  line-height: 1.5;
  background-color: #6d0000;
`
function App(): JSX.Element {
  const [selectedToken, setSelectedToken] = useState<Token>()
  const [tokenAmount, setTokenAmount] = useState(0)
  const [sourceNetwork, setSourceNetwork] = useState<Network>()
  const [targetNetwork, setTargetNetwork] = useState<Network>()
  const [ledgerAddress, setLedgerAddress] = useState('')
  const [ledgerPath, setLedgerPath] = useState('')
  const [ledgerApp, setLedgerApp] = useState<EthApp | CasperApp>()

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
          ledgerApp,
          setLedgerApp,
        }}
      >
        <GlobalStyle />
        <Router>
          {/* <Notification>
            <p>
              For security of the assets locked in DotOracle during the Merge of Ethereum, which is expected to happen
              around 12th September, <br />
              DotOracle Team have discussed with the bridge validators to pause the bridge on 12th, which means the
              validators will not validate bridge transactions around the Merge days.
            </p>
            <p>The bridge will resume to work after The Merge.</p>
          </Notification> */}
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
