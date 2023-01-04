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
  [ChainId.MAINNET]: '0x44169EFfEB3F62aD2Ee2c9cE30C0739271B70e43',
  [ChainId.ROPSTEN]: '0xe78396135CA0aF3839AD3bD0545A9Bba9e44e42e',
  [ChainId.RINKEBY]: '0xAfa6C39FDf16446078aEeEE53E4c4843811570A1',
  [ChainId.GÖRLI]: '0xAfa6C39FDf16446078aEeEE53E4c4843811570A1',
  [ChainId.KOVAN]: '0xAfa6C39FDf16446078aEeEE53E4c4843811570A1'
}

const BRIDGE_TOKEN_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x924fd608bf30dB9B099927492FDA5997d7CFcb02',
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
  [ChainId.MAINNET]: '0x6d9987Fc3fE07C16eCa2b2F9e8980d50d46fd565',
  [ChainId.ROPSTEN]: '0x021feFcBfF8ceD547220A7Ed523ff87002729526',
  [ChainId.RINKEBY]: '0xAEECE738A9AFC0E2E28D43E6aA78F13589049D0b',
  [ChainId.GÖRLI]: '0xAEECE738A9AFC0E2E28D43E6aA78F13589049D0b',
  [ChainId.KOVAN]: '0xAEECE738A9AFC0E2E28D43E6aA78F13589049D0b'
}

const AUTO_WASP_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xb9D0915179050BC5824B9EAd7705542A0E50B95F',
  [ChainId.ROPSTEN]: '0x2CED563dc864036bdF1a49Fb65eF018D7E0CE019',
  [ChainId.RINKEBY]: '0x84AeBa7475a5CA1AC258CAf0349Ef069E0CA14Cf',
  [ChainId.GÖRLI]: '0x84AeBa7475a5CA1AC258CAf0349Ef069E0CA14Cf',
  [ChainId.KOVAN]: '0x84AeBa7475a5CA1AC258CAf0349Ef069E0CA14Cf'
}

const STAKE_WASP_EARN_WASP_PID: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '14',
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
      name: 'WAN/wanUSDT',
      type: 0,
      v2Pid: 0,
      token0: {
        symbol: 'WWAN',
        decimal: 18,
        address: '0xdabD997aE5E4799BE47d6E69D9431615CBa28f48',
      },
      token1: {
        symbol: 'wanUSDT',
        decimal: 6,
        address: '0x11e77E27Af5539872efEd10abaA0b408cfd9fBBD',
      },
    },
    {
      pid: 4,
      lpAddress: '0xB1b5Dada5795F174F1f62edE70EdB4365fB07fb1',
      name: 'WAN/wanETH',
      type: 0,
      v2Pid: 1,
      token0: {
        symbol: 'WWAN',
        decimal: 18,
        address: '0xdabD997aE5E4799BE47d6E69D9431615CBa28f48',
      },
      token1: {
        symbol: 'wanETH',
        decimal: 18,
        address: '0xE3aE74D1518A76715aB4C7BeDF1af73893cd435A',
      },
    },
    {
      pid: 5,
      lpAddress: '0x22D41262d4587ab2Ac32d67CFEeF7449d566920d',
      name: 'wanUSDT/wanUSDC',
      type: 0,
      v2Pid: 2,
      token0: {
        symbol: 'wanUSDT',
        decimal: 6,
        address: '0x11e77E27Af5539872efEd10abaA0b408cfd9fBBD',
      },
      token1: {
        symbol: 'wanUSDC',
        decimal: 6,
        address: '0x52A9CEA01c4CBDd669883e41758B8eB8e8E2B34b',
      },
    },
    {
      pid: 6,
      lpAddress: '0x29239A9b93a78DECeC6e0dD58DDbB854b7Ffb0AF',
      name: 'WASP/WAN',
      type: 1,
      v2Pid: 3,
      token0: {
        symbol: 'WASP',
        decimal: 18,
        address: '0x8B9F9f4aA70B1B0d586BE8aDFb19c1Ac38e05E9a',
      },
      token1: {
        symbol: 'WWAN',
        decimal: 18,
        address: '0xdabD997aE5E4799BE47d6E69D9431615CBa28f48',
      },
    },
    {
      pid: 11,
      lpAddress: '0x56290cdbd88D5516877Cbc1c892Aa7A77f3b0301',
      name: 'wanBTC/WAN',
      type: 0,
      v2Pid: 4,
      token0: {
        symbol: 'wanBTC',
        decimal: 8,
        address: '0x50c439B6d602297252505a6799d84eA5928bCFb6',
      },
      token1: {
        symbol: 'WWAN',
        decimal: 18,
        address: '0xdabD997aE5E4799BE47d6E69D9431615CBa28f48',
      },
    },
    {
      pid: 17,
      lpAddress: '0x2A272a37C999A36Dc10100f8A4B7C3937C174A0D',
      name: 'WAN/wanXRP',
      type: 0,
      v2Pid: 5,
      token0: {
        symbol: 'WWAN',
        decimal: 18,
        address: '0xdabD997aE5E4799BE47d6E69D9431615CBa28f48',
      },
      token1: {
        symbol: 'wanXRP',
        decimal: 6,
        address: '0xf665E0e3E75D16466345E1129530ec28839EfaEa',
      },
    },
    {
      pid: 19,
      lpAddress: '0xA0CF1f16994ECD6D4613024B3eBB61B9f9c06F06',
      name: 'ZOO/WASP',
      type: 1,
      v2Pid: 6,
      token0: {
        symbol: 'ZOO',
        decimal: 18,
        address: '0x6e11655d6aB3781C6613db8CB1Bc3deE9a7e111F',
      },
      token1: {
        symbol: 'WASP',
        decimal: 18,
        address: '0x8B9F9f4aA70B1B0d586BE8aDFb19c1Ac38e05E9a',
      },
    },
    {
      pid: 20,
      lpAddress: '0x4819FAE0F38d81BE1cd5290FA4e1a5e91961Ad6d',
      name: 'WASP/wanDOGE',
      type: 1,
      v2Pid: 7,
      token0: {
        symbol: 'WASP',
        decimal: 18,
        address: '0x8B9F9f4aA70B1B0d586BE8aDFb19c1Ac38e05E9a',
      },
      token1: {
        symbol: 'wanDOGE',
        decimal: 8,
        address: '0xD3a33C6fEa7F785DdC0915f6A76919C11AbdED45',
      },
    },
    {
      pid: 22,
      lpAddress: '0x75916430a4FC7dBe526Db0Dd4f34902ac4f6f02C',
      name: 'wanLTC/WASP',
      type: 1,
      v2Pid: 8,
      token0: {
        symbol: 'wanLTC',
        decimal: 8,
        address: '0xd8e7bd03920BA407D764789B11DD2B5EAeE0961e',
      },
      token1: {
        symbol: 'WASP',
        decimal: 18,
        address: '0x8B9F9f4aA70B1B0d586BE8aDFb19c1Ac38e05E9a',
      },
    },
    {
      pid: 23,
      lpAddress: '0xCd326D196FEB12471CEF51C73D965b278C71A852',
      name: 'WAND/WASP',
      type: 1,
      v2Pid: 9,
      token0: {
        symbol: 'WAND',
        decimal: 18,
        address: '0x230f0C01b8e2c027459781E6a56dA7e1876EFDbe',
      },
      token1: {
        symbol: 'WASP',
        decimal: 18,
        address: '0x8B9F9f4aA70B1B0d586BE8aDFb19c1Ac38e05E9a',
      },
    },
    {
      pid: 25,
      lpAddress: '0x4BAd0523bCb0BcEB92D18EFd4da2EFFE179599B7',
      name: 'wanMOVR/WASP',
      type: 1,
      v2Pid: 10,
      token0: {
        symbol: 'wanMOVR',
        decimal: 18,
        address: '0x114FA1201F82B83c5a2FF0465b4024f01f966b91',
      },
      token1: {
        symbol: 'WASP',
        decimal: 18,
        address: '0x8B9F9f4aA70B1B0d586BE8aDFb19c1Ac38e05E9a',
      },
    },
    {
      pid: 27,
      lpAddress: '0x150214C16d7b3d37F7c71B34102b69efbeB3025A',
      name: 'wanDOT/WASP',
      type: 1,
      v2Pid: 11,
      token0: {
        symbol: 'wanDOT',
        decimal: 10,
        address: '0x52f44783BdF480e88C0eD4cF341A933CAcfDBcaa',
      },
      token1: {
        symbol: 'WASP',
        decimal: 18,
        address: '0x8B9F9f4aA70B1B0d586BE8aDFb19c1Ac38e05E9a',
      },
    },
    {
      pid: 28,
      lpAddress: '0x184ab3d69F545d7149c020a3c4B7a8c4490e934A',
      name: 'wanBNB/WASP',
      type: 1,
      v2Pid: 12,
      token0: {
        symbol: 'wanBNB',
        decimal: 18,
        address: '0x9DE0405064BEDd88399098b4fbb2f7fA462992E0',
      },
      token1: {
        symbol: 'WASP',
        decimal: 18,
        address: '0x8B9F9f4aA70B1B0d586BE8aDFb19c1Ac38e05E9a',
      },
    },
    {
      pid: 30,
      lpAddress: '0x1Efe99369FAA69d3042b4579e8Cfc7C1AC993890',
      name: 'wanFTM/WASP',
      type: 1,
      v2Pid: 13,
      token0: {
        symbol: 'wanFTM',
        decimal: 18,
        address: '0xf8b0D176257f9DC1EE49f038bB4f6cfd51af5762',
      },
      token1: {
        symbol: 'WASP',
        decimal: 18,
        address: '0x8B9F9f4aA70B1B0d586BE8aDFb19c1Ac38e05E9a',
      },
    },
    {
      pid: 32,
      lpAddress: '0xA76727a38860b714A6d606B6990BA3249240B8b7',
      name: 'WASP/wanAVAX',
      type: 1,
      v2Pid: 15,
      token0: {
        symbol: 'WASP',
        decimal: 18,
        address: '0x8B9F9f4aA70B1B0d586BE8aDFb19c1Ac38e05E9a',
      },
      token1: {
        symbol: 'wanAVAX',
        decimal: 18,
        address: '0xB333721251961337F67bbBCAED514f9F284CE8E8',
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
