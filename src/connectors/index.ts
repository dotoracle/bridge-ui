import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { TorusConnector } from '@dotoracle/web3-react-torus-connector-casper'
import { NetworkConnector } from './NetworkConnector'
import { CasperSignerConnector } from '@dotoracle/web3-react-caspersigner-connector'

export enum ConnectorNames {
  Injected = 'injected',
  WalletConnect = 'walletconnect',
  TorusWallet = 'torus',
  CasperSigner = 'caspersigner',
}

const NETWORK_CHAIN_ID = Number(process.env.REACT_APP_CHAIN_ID)
const NETWORK_URL = process.env.REACT_APP_RPC_URL

if (typeof NETWORK_URL === 'undefined') {
  throw new Error(`REACT_APP_NETWORK_URL must be a defined environment variable`)
}

export const injected = new InjectedConnector({
  supportedChainIds: [1, 56, 43114, 1284, 42, 89, 97, 1287, 4002, 43113, 80001],
})

export const walletconnect = new WalletConnectConnector({
  rpc: { [NETWORK_CHAIN_ID]: NETWORK_URL },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 15000,
})

export const network = new NetworkConnector({
  urls: { [NETWORK_CHAIN_ID]: NETWORK_URL },
})

const CASPER_CHAINS = {
  CASPER_MAINNET: 'casper',
  CASPER_TESTNET: 'casper-test',
}

const SUPPORTED_NETWORKS = {
  [CASPER_CHAINS.CASPER_MAINNET]: {
    blockExplorerUrl: 'https://cspr.live',
    chainId: '131614895977472',
    displayName: 'Casper Mainnet',
    logo: 'https://cspr.live/assets/icons/logos/cspr-live-full.svg',
    rpcTarget: 'https://casper-node.tor.us',
    ticker: 'CSPR',
    tickerName: 'Casper Token',
    networkKey: CASPER_CHAINS.CASPER_MAINNET,
  },
  [CASPER_CHAINS.CASPER_TESTNET]: {
    blockExplorerUrl: 'https://testnet.cspr.live',
    chainId: '96945816564243',
    displayName: 'Casper Testnet',
    logo: 'https://testnet.cspr.live/assets/icons/logos/cspr-live-full.svg',
    rpcTarget: 'https://testnet.casper-node.tor.us',
    ticker: 'CSPR',
    tickerName: 'Casper Token',
    networkKey: CASPER_CHAINS.CASPER_TESTNET,
  },
}

export const torus = new TorusConnector({
  chainId: '131614895977472', // '96945816564243',
  initOptions: {
    showTorusButton: false,
    // network: SUPPORTED_NETWORKS[CASPER_CHAINS.CASPER_TESTNET],
    network: SUPPORTED_NETWORKS[CASPER_CHAINS.CASPER_MAINNET],
  },
})

export const caspersigner = new CasperSignerConnector({
  chainId: '131614895977472', // '96945816564243',
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.TorusWallet]: torus,
  [ConnectorNames.CasperSigner]: caspersigner,
}
