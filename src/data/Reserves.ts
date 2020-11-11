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

  const params = useMemo(() => {
    const p1 = trackedTokenPairs.map(([tokenA, tokenB]) => {
      return tokenA && tokenB && !tokenA.equals(tokenB) ? [tokenA.address, tokenB.address] : undefined
    })
    return p1
  }, [trackedTokenPairs])
  // for (let i = 0; i < trackedTokenPairs.length; i++) {
  //   if (trackedTokenPairs[i][0] === undefined || trackedTokenPairs[i][1] === undefined) {
  //     continue
  //   }
  //   params.push([trackedTokenPairs[i][0]!.address, trackedTokenPairs[i][1]!.address])
  // }

  const callParams = params.filter(v => !!v)
  const pairsFromFactory = useSingleContractMultipleData(factory, 'getPair', callParams)
  const data = useMemo(() => {
    const tmp: any[] = []
    params.forEach((value, index) => {
      if (value) {
        const i = callParams.findIndex(([tokenAAddr, tokenBAddr]) => value[0] === tokenAAddr && value[1] === tokenBAddr)
        tmp[index] = pairsFromFactory[i]
      } else {
        tmp[index] = undefined
      }
    })
    return tmp
  }, [callParams, pairsFromFactory, params])

  const addresses = useMemo((): (string | undefined)[] => {
    const tmpPairs: (string | undefined)[] = []
    for (let i = 0; i < params.length; i++) {
      if (!data || !data[i] || !data[i].result) {
        tmpPairs.push(undefined)
        continue
      }
      tmpPairs.push(data[i].result?.pair)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      Pair.setAddress(trackedTokenPairs[i][0]!, trackedTokenPairs[i][1]!, data[i].result!.pair)
    }
    return tmpPairs
  }, [params, data, trackedTokenPairs])
  return addresses
}

export function usePairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, Pair | null][] {
  const { chainId } = useActiveWeb3React()

  const tokens: [Token | undefined, Token | undefined][] = useMemo(
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
  // console.debug('usePairAddresses', tokens, pairAddresses)

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
  const pairs = usePairs([[tokenA, tokenB]])
  return pairs[0]
}
