import { Interface } from '@ethersproject/abi'
import { ChainId } from '@wanswap/sdk'
import BRIDGE_MINER_ABI from './bridge-miner.json'
import BRIDGE_TOKEN_ABI from './bridge-token.json'
import ERC20_ABI from './erc20.json'
import HIVE_ABI from './hive.json'
import AUTO_WASP_ABI from './abi.TomVaultV2.json'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'

const WANV2_PAIR_INTERFACE = new Interface(IUniswapV2PairABI)
const BRIDGE_MINER_INTERFACE = new Interface(BRIDGE_MINER_ABI)
const ERC20_INTERFACE = new Interface(ERC20_ABI)
const WANV2BRIDGE_TOKEN_INTERFACE = new Interface(BRIDGE_TOKEN_ABI)
const HIVE_INTERFACE = new Interface(HIVE_ABI);

const V1_MINER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x7E5fE1e587A5c38B4A4A9ba38a35096F8EA35aaC',
  [ChainId.ROPSTEN]: '0x01EcaA58733A9232Ae5F1D2f74c643f2f8b3Bb91',
  [ChainId.RINKEBY]: '0xAfa6C39FDf16446078aEeEE53E4c4843811570A1',
  [ChainId.GÖRLI]: '0xAfa6C39FDf16446078aEeEE53E4c4843811570A1',
  [ChainId.KOVAN]: '0xAfa6C39FDf16446078aEeEE53E4c4843811570A1'
}

const BRIDGE_MINER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x7E5fE1e587A5c38B4A4A9ba38a35096F8EA35aaC',
  [ChainId.ROPSTEN]: '0xe78396135CA0aF3839AD3bD0545A9Bba9e44e42e',
  [ChainId.RINKEBY]: '0xAfa6C39FDf16446078aEeEE53E4c4843811570A1',
  [ChainId.GÖRLI]: '0xAfa6C39FDf16446078aEeEE53E4c4843811570A1',
  [ChainId.KOVAN]: '0xAfa6C39FDf16446078aEeEE53E4c4843811570A1'
}

const BRIDGE_TOKEN_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x8B9F9f4aA70B1B0d586BE8aDFb19c1Ac38e05E9a',
  [ChainId.ROPSTEN]: '0x54A20457a1b1F926C7779245C7f15A9c567fFe01',
  [ChainId.RINKEBY]: '0x0A3B082C1ceDa3d35E5baD2776c5a5236044A03D',
  [ChainId.GÖRLI]: '0x0A3B082C1ceDa3d35E5baD2776c5a5236044A03D',
  [ChainId.KOVAN]: '0x0A3B082C1ceDa3d35E5baD2776c5a5236044A03D'
}

const HIVE_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x93f98C2216B181846e1C92e7Deb06911373e1f37',
  [ChainId.ROPSTEN]: '0xcc1E39c4e2c3cd2DA61ad6511cf9Be69F410DF82',
  [ChainId.RINKEBY]: '0xA45b10Df50D6d0Bb4733Dd54E52fB4CefEc34E38',
  [ChainId.GÖRLI]: '0xA45b10Df50D6d0Bb4733Dd54E52fB4CefEc34E38',
  [ChainId.KOVAN]: '0xA45b10Df50D6d0Bb4733Dd54E52fB4CefEc34E38'
}

const ZOO_TOKEN_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x6e11655d6aB3781C6613db8CB1Bc3deE9a7e111F',
  [ChainId.ROPSTEN]: '0x890589dC8BD3F973dcAFcB02b6e1A133A76C8135',
  [ChainId.RINKEBY]: '0x0A3B082C1ceDa3d35E5baD2776c5a5236044A03D',
  [ChainId.GÖRLI]: '0x0A3B082C1ceDa3d35E5baD2776c5a5236044A03D',
  [ChainId.KOVAN]: '0x0A3B082C1ceDa3d35E5baD2776c5a5236044A03D'
}

const WRAPPED_WASP_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x9661684e1766aB483CcDf149E8D04d2821025DFb',
  [ChainId.ROPSTEN]: '0x021feFcBfF8ceD547220A7Ed523ff87002729526',
  [ChainId.RINKEBY]: '0xAEECE738A9AFC0E2E28D43E6aA78F13589049D0b',
  [ChainId.GÖRLI]: '0xAEECE738A9AFC0E2E28D43E6aA78F13589049D0b',
  [ChainId.KOVAN]: '0xAEECE738A9AFC0E2E28D43E6aA78F13589049D0b'
}

const AUTO_WASP_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x230AD47D0b5Cddd1f542bEd66648a5282E0bB33e',
  [ChainId.ROPSTEN]: '0x2CED563dc864036bdF1a49Fb65eF018D7E0CE019',
  [ChainId.RINKEBY]: '0x84AeBa7475a5CA1AC258CAf0349Ef069E0CA14Cf',
  [ChainId.GÖRLI]: '0x84AeBa7475a5CA1AC258CAf0349Ef069E0CA14Cf',
  [ChainId.KOVAN]: '0x84AeBa7475a5CA1AC258CAf0349Ef069E0CA14Cf'
}

const STAKE_WASP_EARN_WASP_PID: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '31',
  [ChainId.ROPSTEN]: '4',
  [ChainId.RINKEBY]: '5',
  [ChainId.GÖRLI]: '5',
  [ChainId.KOVAN]: '5'
}

export declare type V1FarmPairInfo = {
  pid: number
  lpAddress: string
  name: string
  type: number
  v2Pid: number
  token0: {
    symbol: string
    decimal: number
    address: string
  }
  token1: {
    symbol: string
    decimal: number
    address: string
  }
}

const V1_FARM_PAIRS: { [chainId in ChainId]: V1FarmPairInfo[] } = {
  [ChainId.MAINNET]: [
    {
      pid: 0,
      lpAddress: '0x0a886Dc4d584d55E9A1FA7eB0821762296b4ec0E',
      name: 'WAN/FNX',
      type: 0,
      v2Pid: 0,
      token0: {
        symbol: 'WWAN',
        decimal: 18,
        address: '0x916283CC60FDAF05069796466Af164876E35D21F',
      },
      token1: {
        symbol: 'FNX',
        decimal: 18,
        address: '0x974AB46969D3D9a4569546051a797729E301d6Eb',
      },
    },
    {
      pid: 1,
      lpAddress: '0xb0f36B469DDA3917AbbC8520F4CF80A5D1e9e9E2',
      name: 'wanOBTC/WAN',
      type: 0,
      v2Pid: 1,
      token0: {
        symbol: 'wanOBTC',
        decimal: 8,
        address: '0x89a3E1494bC3dB81DaDc893deD7476D33d47Dcbd',
      },
      token1: {
        symbol: 'WWAN',
        decimal: 18,
        address: '0x916283CC60FDAF05069796466Af164876E35D21F',
      },
    },
    {
      pid: 3,
      lpAddress: '0xB1b5Dada5795F174F1f62edE70EdB4365fB07fb1',
      name: 'wanETH/WAN',
      type: 0,
      v2Pid: 2,
      token0: {
        symbol: 'wanETH',
        decimal: 18,
        address: '0x48344649B9611a891987b2Db33fAada3AC1d05eC',
      },
      token1: {
        symbol: 'WWAN',
        decimal: 18,
        address: '0x916283CC60FDAF05069796466Af164876E35D21F',
      },
    },
    {
      pid: 4,
      lpAddress: '0xeC79FfAB94db4F6AE7eE51B20f0E8cA1eCa93468',
      name: 'wanUSDT/WAN',
      type: 0,
      v2Pid: 3,
      token0: {
        symbol: 'wanUSDT',
        decimal: 6,
        address: '0x3D5950287b45F361774E5fB6e50d70eEA06Bc167',
      },
      token1: {
        symbol: 'WWAN',
        decimal: 18,
        address: '0x916283CC60FDAF05069796466Af164876E35D21F',
      },
    },
    {
      pid: 6,
      lpAddress: '0xEe700Cd7C33DE6E86f2B35ef0D05dFF2A15Ccdd9',
      name: 'WASPv1/WAN',
      type: 1,
      v2Pid: 5,
      token0: {
        symbol: 'WASPv1',
        decimal: 18,
        address: '0x830053DABd78b4ef0aB0FeC936f8a1135B68da6f',
      },
      token1: {
        symbol: 'WWAN',
        decimal: 18,
        address: '0x916283CC60FDAF05069796466Af164876E35D21F',
      },
    },
  ],
  [ChainId.ROPSTEN]: [
    {
      pid: 0,
      lpAddress: '0x0a886Dc4d584d55E9A1FA7eB0821762296b4ec0E',
      name: 'WAN/FNX',
      type: 0,
      v2Pid: 0,
      token0: {
        symbol: 'WWAN',
        decimal: 18,
        address: '0x916283CC60FDAF05069796466Af164876E35D21F',
      },
      token1: {
        symbol: 'FNX',
        decimal: 18,
        address: '0x974AB46969D3D9a4569546051a797729E301d6Eb',
      },
    },
    {
      pid: 1,
      lpAddress: '0xb0f36B469DDA3917AbbC8520F4CF80A5D1e9e9E2',
      name: 'wanOBTC/WAN',
      type: 0,
      v2Pid: 1,
      token0: {
        symbol: 'wanOBTC',
        decimal: 8,
        address: '0x89a3E1494bC3dB81DaDc893deD7476D33d47Dcbd',
      },
      token1: {
        symbol: 'WWAN',
        decimal: 18,
        address: '0x916283CC60FDAF05069796466Af164876E35D21F',
      },
    },
    {
      pid: 3,
      lpAddress: '0xB1b5Dada5795F174F1f62edE70EdB4365fB07fb1',
      name: 'wanETH/WAN',
      type: 0,
      v2Pid: 2,
      token0: {
        symbol: 'wanETH',
        decimal: 18,
        address: '0x48344649B9611a891987b2Db33fAada3AC1d05eC',
      },
      token1: {
        symbol: 'WWAN',
        decimal: 18,
        address: '0x916283CC60FDAF05069796466Af164876E35D21F',
      },
    },
    {
      pid: 4,
      lpAddress: '0xeC79FfAB94db4F6AE7eE51B20f0E8cA1eCa93468',
      name: 'wanUSDT/WAN',
      type: 0,
      v2Pid: 3,
      token0: {
        symbol: 'wanUSDT',
        decimal: 6,
        address: '0x3D5950287b45F361774E5fB6e50d70eEA06Bc167',
      },
      token1: {
        symbol: 'WWAN',
        decimal: 18,
        address: '0x916283CC60FDAF05069796466Af164876E35D21F',
      },
    },
    {
      pid: 6,
      lpAddress: '0xEe700Cd7C33DE6E86f2B35ef0D05dFF2A15Ccdd9',
      name: 'WASPv1/WAN',
      type: 1,
      v2Pid: 5,
      token0: {
        symbol: 'WASPv1',
        decimal: 18,
        address: '0x830053DABd78b4ef0aB0FeC936f8a1135B68da6f',
      },
      token1: {
        symbol: 'WWAN',
        decimal: 18,
        address: '0x916283CC60FDAF05069796466Af164876E35D21F',
      },
    },
  ],
  [ChainId.RINKEBY]: [],
  [ChainId.GÖRLI]: [],
  [ChainId.KOVAN]: [],
}






export {
  BRIDGE_MINER_ABI,
  BRIDGE_MINER_ADDRESS,
  BRIDGE_TOKEN_ABI,
  BRIDGE_TOKEN_ADDRESS,
  ZOO_TOKEN_ADDRESS,
  HIVE_ABI,
  AUTO_WASP_ABI,
  HIVE_ADDRESS,
  HIVE_INTERFACE,
  WANV2_PAIR_INTERFACE,
  BRIDGE_MINER_INTERFACE,
  ERC20_INTERFACE,
  WANV2BRIDGE_TOKEN_INTERFACE,
  WRAPPED_WASP_ADDRESS,
  AUTO_WASP_ADDRESS,
  STAKE_WASP_EARN_WASP_PID,
  V1_FARM_PAIRS,
  V1_MINER_ADDRESS,
}
