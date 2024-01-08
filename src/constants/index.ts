import { ChainId, JSBI, Percent, Token, WETH } from '@wanswap/sdk'
import { AbstractConnector } from '@web3-react-wan/abstract-connector'

import { injected, wanwallet, metamask, walletconnect } from '../connectors'

export const ROUTER_ADDRESS = '0xeA300406FE2eED9CD2bF5c47D01BECa8Ad294Ec1'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

export const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')
export const USDC = new Token(ChainId.MAINNET, '0x52a9cea01c4cbdd669883e41758b8eb8e8e2b34b', 6, 'wanUSDC', 'wanUSDC')
export const USDT = new Token(ChainId.MAINNET, '0x11e77e27af5539872efed10abaa0b408cfd9fbbd', 6, 'wanUSDT', 'wanUSDT')
export const COMP = new Token(ChainId.MAINNET, '0xc00e94Cb662C3520282E6f5717214004A7f26888', 18, 'COMP', 'Compound')
export const MKR = new Token(ChainId.MAINNET, '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', 18, 'MKR', 'Maker')
export const AMPL = new Token(ChainId.MAINNET, '0xD46bA6D942050d489DBd938a2C909A5d5039A161', 9, 'AMPL', 'Ampleforth')
export const WBTC = new Token(ChainId.MAINNET, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 18, 'WBTC', 'Wrapped BTC')
export const USDT1 = new Token(ChainId.ROPSTEN, '0x3d5950287b45f361774e5fb6e50d70eea06bc167', 6, 'wanUSDT', 'wanUSDT')

export const wanOBTC = new Token(ChainId.MAINNET, '0xd15e200060fc17ef90546ad93c1c61bfefdc89c7', 8, 'wanOBTC', 'wanOBTC');
export const wanBTC = new Token(ChainId.MAINNET, '0x50c439b6d602297252505a6799d84ea5928bcfb6', 8, 'wanBTC', 'wanBTC');
export const wanETH = new Token(ChainId.MAINNET, '0xe3ae74d1518a76715ab4c7bedf1af73893cd435a', 18, 'wanETH', 'wanETH');
export const wanLINK = new Token(ChainId.MAINNET, '0x06da85475f9d2ae79af300de474968cd5a4fde61', 18, 'wanLINK', 'wanLINK');
export const wanUNI = new Token(ChainId.MAINNET, '0x73eaa7431b11b1e7a7d5310de470de09883529df', 18, 'wanUNI', 'wanUNI');
export const wanSUSHI = new Token(ChainId.MAINNET, '0x9b6863f6ab2047069ad1cd15fff8c45af637d67c', 18, 'wanSUSHI', 'wanSUSHI');

// export const wanMKR = new Token(ChainId.MAINNET, '0xa31b67a8cba75ea6ced8340d8bc0431ab052a4fa', 18, 'wanMKR', 'wanMKR');
// export const wanVIBE = new Token(ChainId.MAINNET, '0xde1a20792553b84ddb254ca78fa7c5996ad5fbe2', 18, 'wanVIBE', 'wanVIBE');
// export const wanZCN = new Token(ChainId.MAINNET, '0xf1d0ad0c4a612ecf4931b673245f1fc2935bccdc', 18, 'wanZCN', 'wanZCN');


// TODO this is only approximate, it's actually based on blocks
export const PROPOSAL_LENGTH_IN_DAYS = 7

export const GOVERNANCE_ADDRESS = '0x5e4be8Bc9637f0EAA1A755019e06A68ce081D58F'

export const TIMELOCK_ADDRESS = '0x1a9C8182C09F50C8318d769245beA52c32BE35BC'

const UNI_ADDRESS = '0x924fd608bf30dB9B099927492FDA5997d7CFcb02'
const UNI_ADDRESS_TESTNET = '0x54A20457a1b1F926C7779245C7f15A9c567fFe01'
export const WASP: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, UNI_ADDRESS, 18, 'WASP', 'WASP_V2'),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, UNI_ADDRESS_TESTNET, 18, 'WASP', 'WASP_V2'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, UNI_ADDRESS_TESTNET, 18, 'WASP', 'WASP_V2'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, UNI_ADDRESS_TESTNET, 18, 'WASP', 'WASP_V2'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, UNI_ADDRESS_TESTNET, 18, 'WASP', 'WASP_V2')
}

export const COMMON_CONTRACT_NAMES: { [address: string]: string } = {
  [UNI_ADDRESS]: 'UNI',
  [GOVERNANCE_ADDRESS]: 'Governance',
  [TIMELOCK_ADDRESS]: 'Timelock'
}

// TODO: specify merkle distributor for mainnet
export const MERKLE_DISTRIBUTOR_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: '0x090D4613473dEE047c3f2706764f49E0821D256e'
}

const WETH_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET]],
  [ChainId.ROPSTEN]: [WETH[ChainId.ROPSTEN]],
  [ChainId.RINKEBY]: [WETH[ChainId.RINKEBY]],
  [ChainId.GÖRLI]: [WETH[ChainId.GÖRLI]],
  [ChainId.KOVAN]: [WETH[ChainId.KOVAN]]
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], wanBTC, wanETH, wanUNI, USDC, USDT, wanLINK, WASP[ChainId.MAINNET], wanSUSHI]
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {
    [AMPL.address]: [DAI, WETH[ChainId.MAINNET]]
  }
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], USDC, USDT]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], wanBTC, wanETH, USDC, USDT, wanLINK, wanUNI, WASP[ChainId.MAINNET], wanSUSHI]
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MAINNET]: [
    [USDC, USDT],
  ]
}

export interface WalletInfo {
  connector?: any | AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

const SUPPORTED_WALLETS_CHROME: { [key: string]: WalletInfo } = {
  METAMASK: {
    connector: metamask,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
    mobile: true
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconName: 'walletConnectIcon.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
  },
  WANMASK: {
    connector: injected,
    name: 'WanMask',
    iconName: 'wanmask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
}

const SUPPORTED_WALLETS_IN_WALLET: { [key: string]: WalletInfo } = {
  WAN_WALLET: {
    connector: wanwallet,
    name: 'WanWallet',
    iconName: 'wanchain-logo.png',
    description: 'Connect to Wan Wallet.',
    href: null,
    color: '#4196FC',
    mobile: true
  }
}

declare global {
  interface Window {
    injectWeb3: any;
  }
}

export let SUPPORTED_WALLETS: { [key: string]: WalletInfo } = !window.injectWeb3 ? SUPPORTED_WALLETS_CHROME : SUPPORTED_WALLETS_IN_WALLET

setTimeout(()=>{
  SUPPORTED_WALLETS = !window.injectWeb3 ? SUPPORTED_WALLETS_CHROME : SUPPORTED_WALLETS_IN_WALLET
  console.debug('update wallet');
}, 500);

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

export const BIG_INT_ZERO = JSBI.BigInt(0)

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much WAN so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 WAN
export const BETTER_TRADE_LINK_THRESHOLD = new Percent(JSBI.BigInt(75), JSBI.BigInt(10000))
export const BUNDLE_ID = '1'
export const TRACKED_OVERRIDES = [
  '0x495c7f3a713870f68f8b418b355c085dfdc412c3',
  '0xc3761eb917cd790b30dad99f6cc5b4ff93c4f9ea',
  '0xe31debd7abff90b06bca21010dd860d8701fd901',
  '0xfc989fbb6b3024de5ca0144dc23c18a063942ac1',
  '0xf4eda77f0b455a12f3eb44f8653835f377e36b76',
  '0x93b2fff814fcaeffb01406e80b4ecd89ca6a021b'
]
export const timeframeOptions = {
  WEEK: '1 week',
  MONTH: '1 month',
  // THREE_MONTHS: '3 months',
  // YEAR: '1 year',
  HALF_YEAR: '6 months',
  ALL_TIME: 'All time'
}

export const SUGGEST_GAS_PRICE = '0x59682f00' // 1.1 gwei
