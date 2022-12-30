import { currencyEquals, Currency } from '@wanswap/sdk'
import { useMemo } from 'react'
import { CONVERT_TOKEN2, CONVERT_TOKEN3, TOKEN_CONVERT_ADDRESS_2 } from '../constants/abis/token-convert'
import { tryParseAmount } from '../state/swap/hooks'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useCurrencyBalance } from '../state/wallet/hooks'
import { useActiveWeb3React } from './index'
import { useTokenConvertContract2 } from './useContract'

export enum ConvertType {
  NOT_CONVERTABLE,
  CONVERT,
  REVERT
}

const NOT_CONVERTABLE = { convertType: ConvertType.NOT_CONVERTABLE }
/**
 * Given the selected input and output currency, return a wrap callback
 * @param inputCurrency the selected input currency
 * @param outputCurrency the selected output currency
 * @param typedValue the user input value
 */
export default function useTokenConvertCallback2(
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined,
  typedValue: string | undefined
): { convertType: ConvertType; execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { chainId, account } = useActiveWeb3React()
  const convertContract = useTokenConvertContract2()
  const balance = useCurrencyBalance(account ?? undefined, inputCurrency)
  const quota = useCurrencyBalance(chainId && TOKEN_CONVERT_ADDRESS_2[chainId], outputCurrency)
  // we can always parse the amount typed as the input currency, since wrapping is 1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue])
  const addTransaction = useTransactionAdder()
  

  return useMemo(() => {
    if (!convertContract || !chainId || !inputCurrency || !outputCurrency) return NOT_CONVERTABLE

    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)
    const liquidityEnough = inputAmount && quota && !quota.lessThan(inputAmount)

    if (currencyEquals(CONVERT_TOKEN2[chainId], inputCurrency) && currencyEquals(CONVERT_TOKEN3[chainId], outputCurrency)) {
      return {
        convertType: ConvertType.CONVERT,
        execute:
          sufficientBalance && liquidityEnough && inputAmount
            ? async () => {
                try {
                  const txReceipt = await convertContract.deposit(`0x${inputAmount.raw.toString(16)}`)
                  addTransaction(txReceipt, { summary: `Convert ${inputAmount.toSignificant(6)} WASPv1 to WASPv2` })
                } catch (error) {
                  console.error('Could not convert', error)
                }
              }
            : undefined,
        inputError: liquidityEnough? (sufficientBalance ? undefined : 'Insufficient WASPv1 balance'): 'Insufficient liquidity'
      }
    } else if (currencyEquals(CONVERT_TOKEN3[chainId], inputCurrency) && currencyEquals(CONVERT_TOKEN2[chainId], outputCurrency)) {
      return {
        convertType: ConvertType.REVERT,
        execute:
          sufficientBalance && liquidityEnough && inputAmount
            ? async () => {
                try {
                  const txReceipt = await convertContract.withdraw(`0x${inputAmount.raw.toString(16)}`)
                  addTransaction(txReceipt, { summary: `Revert ${inputAmount.toSignificant(6)} WASPv2 to WASPv1` })
                } catch (error) {
                  console.error('Could not revert', error)
                }
              }
            : undefined,
        inputError:  liquidityEnough? (sufficientBalance ? undefined : 'Insufficient WASPv2 balance'): 'Insufficient liquidity'
      }
    } else {
      return NOT_CONVERTABLE
    }
  }, [convertContract, chainId, inputCurrency, outputCurrency, inputAmount, balance, quota, addTransaction])
}
