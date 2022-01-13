/* eslint-disable react/prop-types */
import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from 'react'
import dayjs from 'dayjs'
import { ETH_PRICE } from '../apollo/queries'
import { client } from '../apollo/client'
import Web3 from 'web3'
import sleep from 'ko-sleep'

const web3 = new Web3(new Web3.providers.HttpProvider('https://gwan-ssl.wandevs.org:56891'))
const GlobalDataContext = createContext()

function useGlobalDataContext() {
  return useContext(GlobalDataContext)
}

const UPDATE = 'UPDATE'
const UPDATE_TXNS = 'UPDATE_TXNS'
const UPDATE_CHART = 'UPDATE_CHART'
const UPDATE_ETH_PRICE = 'UPDATE_ETH_PRICE'
const ETH_PRICE_KEY = 'ETH_PRICE_KEY'
const UPDATE_ALL_PAIRS_IN_UNISWAP = 'UPDAUPDATE_ALL_PAIRS_IN_UNISWAPTE_TOP_PAIRS'
const UPDATE_ALL_TOKENS_IN_UNISWAP = 'UPDATE_ALL_TOKENS_IN_UNISWAP'
const UPDATE_TOP_LPS = 'UPDATE_TOP_LPS'

let blockNumber = 13872128
let blockTime = 1617013065
let updated = false
web3.eth
  .getBlockNumber()
  .then(ret => {
    blockNumber = ret
    web3.eth
      .getBlock(ret)
      .then(ret2 => {
        blockTime = ret2.timestamp
        updated = true
      })
      .catch(err => {
        console.error(err)
      })
  })
  .catch(err => {
    console.error(err)
  })

export const getPercentChange = (valueNow, value24HoursAgo) => {
  const adjustedPercentChange =
    ((parseFloat(valueNow) - parseFloat(value24HoursAgo)) / parseFloat(value24HoursAgo)) * 100
  if (isNaN(adjustedPercentChange) || !isFinite(adjustedPercentChange)) {
    return 0
  }
  return adjustedPercentChange
}

async function getBlockByLastBlockAndTime(timestamp) {
  while (!updated) {
    await sleep(1000)
  }
  const timestampInBlock = blockTime
  const sub = (timestampInBlock - timestamp) / 5
  return parseInt(blockNumber - sub)
}

export const getBlockFromTimestamp = async timestamp => {
  if (timestamp.length > 0) {
    return await Promise.all(
      timestamp.map(async v => {
        return {
          timestamp: v,
          number: await getBlockByLastBlockAndTime(v)
        }
      })
    )
  }

  return await getBlockByLastBlockAndTime(timestamp)
}

const getEthPrice = async () => {
  const utcCurrentTime = dayjs()
  const utcOneDayBack = utcCurrentTime
    .subtract(1, 'day')
    .startOf('minute')
    .unix()

  let ethPrice = 0
  let ethPriceOneDay = 0
  let priceChangeETH = 0

  try {
    const oneDayBlock = await getBlockFromTimestamp(utcOneDayBack)
    const result = await client.query({
      query: ETH_PRICE(),
      fetchPolicy: 'cache-first'
    })
    const resultOneDay = await client.query({
      query: ETH_PRICE(oneDayBlock),
      fetchPolicy: 'cache-first'
    })
    const currentPrice = result?.data?.bundles[0]?.ethPrice
    const oneDayBackPrice = resultOneDay?.data?.bundles[0]?.ethPrice
    priceChangeETH = getPercentChange(currentPrice, oneDayBackPrice)
    ethPrice = currentPrice
    ethPriceOneDay = oneDayBackPrice
  } catch (e) {
    console.log(e)
  }

  return [ethPrice, ethPriceOneDay, priceChangeETH]
}

export function useEthPrice() {
  const [state, { updateEthPrice }] = useGlobalDataContext()
  const ethPrice = state?.[ETH_PRICE_KEY]
  const ethPriceOld = state?.['oneDayPrice']
  useEffect(() => {
    async function checkForEthPrice() {
      if (!ethPrice) {
        const [newPrice, oneDayPrice, priceChange] = await getEthPrice()
        updateEthPrice(newPrice, oneDayPrice, priceChange)
      }
    }
    checkForEthPrice()
  }, [ethPrice, updateEthPrice])

  return [ethPrice, ethPriceOld]
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE: {
      const { data } = payload
      return {
        ...state,
        globalData: data
      }
    }
    case UPDATE_TXNS: {
      const { transactions } = payload
      return {
        ...state,
        transactions
      }
    }
    case UPDATE_CHART: {
      const { daily, weekly } = payload
      return {
        ...state,
        chartData: {
          daily,
          weekly
        }
      }
    }
    case UPDATE_ETH_PRICE: {
      const { ethPrice, oneDayPrice, ethPriceChange } = payload
      return {
        [ETH_PRICE_KEY]: ethPrice,
        oneDayPrice,
        ethPriceChange
      }
    }

    case UPDATE_ALL_PAIRS_IN_UNISWAP: {
      const { allPairs } = payload
      return {
        ...state,
        allPairs
      }
    }

    case UPDATE_ALL_TOKENS_IN_UNISWAP: {
      const { allTokens } = payload
      return {
        ...state,
        allTokens
      }
    }

    case UPDATE_TOP_LPS: {
      const { topLps } = payload
      return {
        ...state,
        topLps
      }
    }
    default: {
      throw Error(`Unexpected action type in DataContext reducer: '${type}'.`)
    }
  }
}

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, {})
  const update = useCallback(data => {
    dispatch({
      type: UPDATE,
      payload: {
        data
      }
    })
  }, [])

  const updateTransactions = useCallback(transactions => {
    dispatch({
      type: UPDATE_TXNS,
      payload: {
        transactions
      }
    })
  }, [])

  const updateChart = useCallback((daily, weekly) => {
    dispatch({
      type: UPDATE_CHART,
      payload: {
        daily,
        weekly
      }
    })
  }, [])

  const updateEthPrice = useCallback((ethPrice, oneDayPrice, ethPriceChange) => {
    dispatch({
      type: UPDATE_ETH_PRICE,
      payload: {
        ethPrice,
        oneDayPrice,
        ethPriceChange
      }
    })
  }, [])

  const updateAllPairsInUniswap = useCallback(allPairs => {
    dispatch({
      type: UPDATE_ALL_PAIRS_IN_UNISWAP,
      payload: {
        allPairs
      }
    })
  }, [])

  const updateAllTokensInUniswap = useCallback(allTokens => {
    dispatch({
      type: UPDATE_ALL_TOKENS_IN_UNISWAP,
      payload: {
        allTokens
      }
    })
  }, [])

  const updateTopLps = useCallback(topLps => {
    dispatch({
      type: UPDATE_TOP_LPS,
      payload: {
        topLps
      }
    })
  }, [])
  return (
    <GlobalDataContext.Provider
      value={useMemo(
        () => [
          state,
          {
            update,
            updateTransactions,
            updateChart,
            updateEthPrice,
            updateTopLps,
            updateAllPairsInUniswap,
            updateAllTokensInUniswap
          }
        ],
        [
          state,
          update,
          updateTransactions,
          updateTopLps,
          updateChart,
          updateEthPrice,
          updateAllPairsInUniswap,
          updateAllTokensInUniswap
        ]
      )}
    >
      {children}
    </GlobalDataContext.Provider>
  )
}
