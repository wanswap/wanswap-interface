import { ChainId, Currency, currencyEquals, JSBI, Price, Token, WETH } from '@wanswap/sdk'
import { useMemo } from 'react'
import { USDT1, USDT, WASP } from '../constants'
import { PairState, usePairs } from '../data/Reserves'
import { useActiveWeb3React } from '../hooks'
import { wrappedCurrency } from './wrappedCurrency'

/**
 * Returns the price in USD of the input currency
 * @param currency currency to compute the USD price of
 */
export default function useUSDCPrice(currency?: Currency): Price | undefined {
  const { chainId } = useActiveWeb3React()
  const wrapped = wrappedCurrency(currency?.name === 'WAN' ? (chainId ? WETH[chainId] : undefined) : currency , chainId)
  const USD = useMemo(() => (chainId === ChainId.MAINNET ? USDT : USDT1), [chainId])
  const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () => [
      [
        chainId && wrapped && currencyEquals(WETH[chainId], wrapped) ? undefined : currency,
        chainId ? WETH[chainId] : undefined
      ],
      // [wrapped?.equals(USD) ? undefined : wrapped, !(chainId === ChainId.MAINNET) ? USD : undefined],
      // [chainId ? WETH[chainId] : undefined, !(chainId === ChainId.MAINNET) ? USD : undefined],
      [wrapped?.equals(USD) ? undefined : wrapped, USD],
      [chainId ? WETH[chainId] : undefined, USD],
      [currency?.name === 'WAN' ? (chainId ? WETH[chainId] : undefined) : currency, chainId ? WASP[chainId]: undefined],
      [chainId ? WETH[chainId] : undefined, chainId ? WASP[chainId]: undefined]
    ],
    [USD, chainId, currency, wrapped]
  )
  const [[ethPairState, ethPair], [usdcPairState, usdcPair], [usdcEthPairState, usdcEthPair], [waspPairState, waspPair], [waspEthPairState, waspEthPair]] = usePairs(tokenPairs)
  return useMemo(() => {
    if (!currency || !wrapped || !chainId) {
      return undefined
    }
    // handle weth/eth
    if (wrapped.equals(WETH[chainId])) {
      if (usdcPair) {
        const price = usdcPair.priceOf(WETH[chainId])
        return new Price(currency, USD, price.denominator, price.numerator)
      } else {
        return undefined
      }
    }
    // handle usdc
    if (wrapped.equals(USD)) {
      return new Price(USD, USD, '1', '1')
    }

    const ethPairETHAmount = ethPair?.reserveOf(WETH[chainId])
    const ethPairETHUSDCValue: JSBI =
      ethPairETHAmount && usdcEthPair ? usdcEthPair.priceOf(WETH[chainId]).quote(ethPairETHAmount).raw : JSBI.BigInt(0)

    // all other tokens
    // first try the usdc pair
    if (waspPairState === PairState.EXISTS && waspPair &&
      waspEthPairState === PairState.EXISTS && waspEthPair &&
      usdcEthPairState === PairState.EXISTS && usdcEthPair) {
      if (waspPair.reserveOf(currency as Token).greaterThan(ethPairETHUSDCValue) && usdcEthPair.reserveOf(USD).greaterThan('0') && waspEthPair.reserveOf(WETH[chainId]).greaterThan('0')) {
        const ethUsdcPrice = usdcEthPair.priceOf(USD)
        const currencywaspPrice = waspPair.priceOf(WASP[chainId])
        const waspEthPrice = waspEthPair.priceOf(WETH[chainId])

        const usdcPrice = ethUsdcPrice.multiply(waspEthPrice).multiply(currencywaspPrice).invert()
        return new Price(currency, USD, usdcPrice.denominator, usdcPrice.numerator)
      }
    }
    if (usdcPairState === PairState.EXISTS && usdcPair && usdcPair.reserveOf(USD).greaterThan(ethPairETHUSDCValue)) {
      const price = usdcPair.priceOf(wrapped)
      return new Price(currency, USD, price.denominator, price.numerator)
    }
    if (ethPairState === PairState.EXISTS && ethPair && usdcEthPairState === PairState.EXISTS && usdcEthPair) {
      if (usdcEthPair.reserveOf(USD).greaterThan('0') && ethPair.reserveOf(WETH[chainId]).greaterThan('0')) {
        const ethUsdcPrice = usdcEthPair.priceOf(USD)
        const currencyEthPrice = ethPair.priceOf(WETH[chainId])
        const usdcPrice = ethUsdcPrice.multiply(currencyEthPrice).invert()
        return new Price(currency, USD, usdcPrice.denominator, usdcPrice.numerator)
      }
    }
    return undefined
  }, [chainId, currency, ethPair, ethPairState, usdcEthPair, usdcEthPairState, usdcPair, usdcPairState, wrapped, USD, waspPairState, waspPair, waspEthPairState, waspEthPair])
}
