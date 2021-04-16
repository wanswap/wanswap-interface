import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react-wan/injected-connector'
import { InjectedConnector as MetaMaskConnector } from '@web3-react/injected-connector'

import { WalletConnectConnector } from '@web3-react-wan/walletconnect-connector'
import { WanWalletConnector } from '@web3-react-wan/wanwallet-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { PortisConnector } from '@web3-react/portis-connector'

import { FortmaticConnector } from './Fortmatic'
import { NetworkConnector } from './NetworkConnector'

const NETWORK_URL = process.env.REACT_APP_NETWORK_URL ? process.env.REACT_APP_NETWORK_URL : 'https://gwan-ssl.wandevs.org:56891';
const FORMATIC_KEY = process.env.REACT_APP_FORTMATIC_KEY
const PORTIS_ID = process.env.REACT_APP_PORTIS_ID

export const NETWORK_CHAIN_ID: number = parseInt(process.env.REACT_APP_CHAIN_ID ?? '888')

if (typeof NETWORK_URL === 'undefined') {
  throw new Error(`REACT_APP_NETWORK_URL must be a defined environment variable`)
}

export const network = new NetworkConnector({
  urls: { [NETWORK_CHAIN_ID]: NETWORK_URL }
})

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider as any))
}

export const injected = new InjectedConnector({
  supportedChainIds: [888, 999, 4, 5, 42]
})

export const metamask = new MetaMaskConnector({
  supportedChainIds: [888, 999, 4, 5, 42]
})

// mainnet only
export const walletconnect = new WalletConnectConnector({
  rpc: { 
    888: NETWORK_URL,
  },
  // bridge: 'https://bridge.walletconnect.org',
  // qrcode: true,
  // pollingInterval: 15000
})

// mainnet only
export const wanwallet = new WanWalletConnector({
  chainId: 888,
  url: 'https://gwan-ssl.wandevs.org:56891',
  pollingInterval: 15000,
  requestTimeoutMs: 300000
})

// mainnet only
export const fortmatic = new FortmaticConnector({
  apiKey: FORMATIC_KEY ?? '',
  chainId: 1
})

// mainnet only
export const portis = new PortisConnector({
  dAppId: PORTIS_ID ?? '',
  networks: [1]
})

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: NETWORK_URL,
  appName: 'Uniswap',
  appLogoUrl:
    'https://mpng.pngfly.com/20181202/bex/kisspng-emoji-domain-unicorn-pin-badges-sticker-unicorn-tumblr-emoji-unicorn-iphoneemoji-5c046729264a77.5671679315437924251569.jpg'
})
