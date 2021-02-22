import { Interface } from '@ethersproject/abi'
import { ChainId, Token } from '@wanswap/sdk'
import convertABI from './token-convert.json'

export const TOKEN_CONVERT_ABI = new Interface(convertABI)

export const TOKEN_CONVERT_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x09b17aF957C6b325cC539067E48301fF248B08fF',
  [ChainId.ROPSTEN]: '0x09b17aF957C6b325cC539067E48301fF248B08fF',
  [ChainId.RINKEBY]: '0x09b17aF957C6b325cC539067E48301fF248B08fF',
  [ChainId.GÖRLI]: '0xAfa6C39FDf16446078aEeEE53E4c4843811570A1',
  [ChainId.KOVAN]: '0xAfa6C39FDf16446078aEeEE53E4c4843811570A1'
}

const token0 = "0x89a3e1494bc3db81dadc893ded7476d33d47dcbd";
const token1 = "0x07fdb4e8f8e420d021b9abeb2b1f6dce150ef77c";

export const CONVERT_TOKEN0 : { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, token0, 18, 'wanOBTC', 'wanOBTC'),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, token0, 18, 'wanOBTC', 'wanOBTC'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, token0, 18, 'wanOBTC', 'wanOBTC'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, token0, 18, 'wanOBTC', 'wanOBTC'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, token0, 18, 'wanOBTC', 'wanOBTC')
}

export const CONVERT_TOKEN1 : { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, token1, 18, 'wanBTC', 'wanBTC'),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, token1, 18, 'wanBTC', 'wanBTC'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, token1, 18, 'wanBTC', 'wanBTC'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, token1, 18, 'wanBTC', 'wanBTC'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, token1, 18, 'wanBTC', 'wanBTC')
}
