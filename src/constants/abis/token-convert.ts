import { Interface } from '@ethersproject/abi'
import { ChainId, Token } from '@wanswap/sdk'
import convertABI from './token-convert.json'

export const TOKEN_CONVERT_ABI = new Interface(convertABI)

export const TOKEN_CONVERT_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x0d69BbDaff56992e85709B9b453743d40f8E766e',
  [ChainId.ROPSTEN]: '0x0d69BbDaff56992e85709B9b453743d40f8E766e',
  [ChainId.RINKEBY]: '0x0d69BbDaff56992e85709B9b453743d40f8E766e',
  [ChainId.GÖRLI]: '0xAfa6C39FDf16446078aEeEE53E4c4843811570A1',
  [ChainId.KOVAN]: '0xAfa6C39FDf16446078aEeEE53E4c4843811570A1'
}

const token0 = "0xF74B20b2d2f46DEa5D4b36D22f1e65e115e78087";
const token1 = "0x6F4A2362fD36F60b1574d353Ee653019FB1079f7";

export const CONVERT_TOKEN0 : { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, token0, 18, 'TOKEN0', 'TOKEN0'),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, token0, 18, 'TOKEN0', 'TOKEN0'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, token0, 18, 'TOKEN0', 'TOKEN0'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, token0, 18, 'TOKEN0', 'TOKEN0'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, token0, 18, 'TOKEN0', 'TOKEN0')
}

export const CONVERT_TOKEN1 : { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, token1, 18, 'TOKEN1', 'TOKEN1'),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, token1, 18, 'TOKEN1', 'TOKEN1'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, token1, 18, 'TOKEN1', 'TOKEN1'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, token1, 18, 'TOKEN1', 'TOKEN1'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, token1, 18, 'TOKEN1', 'TOKEN1')
}
