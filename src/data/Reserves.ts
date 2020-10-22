import { TokenAmount, Pair, Currency, FACTORY_ADDRESS, Token } from '@wanswap/sdk'
import { useMemo } from 'react'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { Interface } from '@ethersproject/abi'
import { useActiveWeb3React } from '../hooks'

import { useMultipleContractSingleData, useSingleContractMultipleData } from '../state/multicall/hooks'
import { wrappedCurrency } from '../utils/wrappedCurrency'
import { useFactoryContract } from '../hooks/useContract'

const PAIR_INTERFACE = new Interface(IUniswapV2PairABI)

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID
}

function usePairAddresses(trackedTokenPairs: [Token | undefined, Token | undefined][]): (string | undefined)[] {
  const factory = useFactoryContract(FACTORY_ADDRESS)

  const params = [] 

  for (let i=0; i<trackedTokenPairs.length; i++) {
    if (!trackedTokenPairs[i][0] || !trackedTokenPairs[i][1]) {
      continue
    }
    params.push([trackedTokenPairs[i][0]!.address, trackedTokenPairs[i][1]!.address])
  }

  const pairsFromFactory = useSingleContractMultipleData(factory, 'getPair', params);
  // console.debug('pairsFromFactory', pairsFromFactory);
  const addresses = useMemo(() : (string | undefined)[] => {
    const tmpPairs : (string | undefined)[] = []
    for (let i=0; i<pairsFromFactory.length; i++) {
      if (!pairsFromFactory[i].result) {
        continue
      }
      tmpPairs.push(pairsFromFactory[i].result!.pair)
      Pair.setAddress(trackedTokenPairs[i][0]!, trackedTokenPairs[i][1]!, pairsFromFactory[i].result!.pair)
    }
    return tmpPairs
  }, [trackedTokenPairs, pairsFromFactory]);
  return addresses
}

export function usePairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, Pair | null][] {
  const { chainId } = useActiveWeb3React()


  const tokens : [Token | undefined, Token | undefined][] = useMemo(
    () =>
      currencies.map(([currencyA, currencyB]) => [
        wrappedCurrency(currencyA, chainId),
        wrappedCurrency(currencyB, chainId)
      ]),
    [chainId, currencies]
  )

  // const pairAddresses = useMemo(
  //   () =>
  //     tokens.map(([tokenA, tokenB]) => {
  //       return tokenA && tokenB && !tokenA.equals(tokenB) ? Pair.getAddress(tokenA, tokenB) : undefined
  //     }),
  //   [tokens]
  // )

  const pairAddresses = usePairAddresses(tokens)
  console.debug('usePairAddresses', tokens, pairAddresses)

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves')

  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result
      const tokenA = tokens[i][0]
      const tokenB = tokens[i][1]

      if (loading) return [PairState.LOADING, null]
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]
      if (!reserves) return [PairState.NOT_EXISTS, null]
      const { reserve0, reserve1 } = reserves
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
      return [
        PairState.EXISTS,
        new Pair(new TokenAmount(token0, reserve0.toString()), new TokenAmount(token1, reserve1.toString()))
      ]
    })
  }, [results, tokens])
}

export function usePair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  return usePairs([[tokenA, tokenB]])[0]
}
