import { Interface } from '@ethersproject/abi'
import { ChainId, Token } from '@wanswap/sdk'
import convertABI from './token-convert.json'

export const TOKEN_CONVERT_ABI = new Interface(convertABI)

export const TOKEN_CONVERT_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xB054Ea8E6C73FB58766D23e46C7969aFB1431ae3',
  [ChainId.ROPSTEN]: '0xB054Ea8E6C73FB58766D23e46C7969aFB1431ae3',
  [ChainId.RINKEBY]: '0xB054Ea8E6C73FB58766D23e46C7969aFB1431ae3',
  [ChainId.GÖRLI]: '0xAfa6C39FDf16446078aEeEE53E4c4843811570A1',
  [ChainId.KOVAN]: '0xAfa6C39FDf16446078aEeEE53E4c4843811570A1'
}

export const TOKEN_CONVERT_ADDRESS_2: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xBF492acE2cf9908D1D60eFa3Dbf0709e1d074Bd1',
  [ChainId.ROPSTEN]: '0xBF492acE2cf9908D1D60eFa3Dbf0709e1d074Bd1',
  [ChainId.RINKEBY]: '0xBF492acE2cf9908D1D60eFa3Dbf0709e1d074Bd1',
  [ChainId.GÖRLI]: '0xBF492acE2cf9908D1D60eFa3Dbf0709e1d074Bd1',
  [ChainId.KOVAN]: '0xBF492acE2cf9908D1D60eFa3Dbf0709e1d074Bd1'
}

const token0Testnet = "0x89a3e1494bc3db81dadc893ded7476d33d47dcbd";
const token1Testnet = "0x07fdb4e8f8e420d021b9abeb2b1f6dce150ef77c";

const token2Testnet = "0x830053DABd78b4ef0aB0FeC936f8a1135B68da6f";
const token3Testnet = "0x6103BD5e1906095BB3Bb7109ed499c9C8C24A31A";


const token0Mainnet = "0xd15e200060fc17ef90546ad93c1c61bfefdc89c7";
const token1Mainnet = "0x50c439b6d602297252505a6799d84ea5928bcfb6";

const token2Mainnet = "0xd15e200060fc17ef90546ad93c1c61bfefdc89c7";
const token3Mainnet = "0x50c439b6d602297252505a6799d84ea5928bcfb6";

export const CONVERT_TOKEN0 : { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, token0Mainnet, 18, 'wanOBTC', 'wanOBTC'),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, token0Testnet, 18, 'wanOBTC', 'wanOBTC'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, token0Testnet, 18, 'wanOBTC', 'wanOBTC'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, token0Testnet, 18, 'wanOBTC', 'wanOBTC'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, token0Testnet, 18, 'wanOBTC', 'wanOBTC')
}

export const CONVERT_TOKEN1 : { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, token1Mainnet, 18, 'wanBTC', 'wanBTC'),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, token1Testnet, 18, 'wanBTC', 'wanBTC'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, token1Testnet, 18, 'wanBTC', 'wanBTC'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, token1Testnet, 18, 'wanBTC', 'wanBTC'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, token1Testnet, 18, 'wanBTC', 'wanBTC')
}

export const CONVERT_TOKEN2 : { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, token2Mainnet, 18, 'WASP', 'WASP'),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, token2Testnet, 18, 'WASP', 'WASP'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, token2Testnet, 18, 'WASP', 'WASP'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, token2Testnet, 18, 'WASP', 'WASP'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, token2Testnet, 18, 'WASP', 'WASP')
}

export const CONVERT_TOKEN3 : { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, token3Mainnet, 18, 'WASP', 'WASP'),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, token3Testnet, 18, 'WASP', 'WASP'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, token3Testnet, 18, 'WASP', 'WASP'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, token3Testnet, 18, 'WASP', 'WASP'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, token3Testnet, 18, 'WASP', 'WASP')
}
