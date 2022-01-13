/* eslint-disable react/prop-types */
import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from 'react'
import { healthClient } from '../apollo/client'
import { SUBGRAPH_HEALTH } from '../apollo/queries'
import { timeframeOptions } from '../constants'

const ApplicationContext = createContext()

const UPDATE = 'UPDATE'
const UPDATE_TIMEFRAME = 'UPDATE_TIMEFRAME'
const UPDATE_SESSION_START = 'UPDATE_SESSION_START'
const UPDATED_SUPPORTED_TOKENS = 'UPDATED_SUPPORTED_TOKENS'
const UPDATE_LATEST_BLOCK = 'UPDATE_LATEST_BLOCK'
const UPDATE_HEAD_BLOCK = 'UPDATE_HEAD_BLOCK'

const SUPPORTED_TOKENS = 'SUPPORTED_TOKENS'
const TIME_KEY = 'TIME_KEY'
const CURRENCY = 'CURRENCY'
const SESSION_START = 'SESSION_START'
const LATEST_BLOCK = 'LATEST_BLOCK'
const HEAD_BLOCK = 'HEAD_BLOCK'

function useApplicationContext() {
  return useContext(ApplicationContext)
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE: {
      const { currency } = payload
      return {
        ...state,
        [CURRENCY]: currency
      }
    }
    case UPDATE_TIMEFRAME: {
      const { newTimeFrame } = payload
      return {
        ...state,
        [TIME_KEY]: newTimeFrame
      }
    }
    case UPDATE_SESSION_START: {
      const { timestamp } = payload
      return {
        ...state,
        [SESSION_START]: timestamp
      }
    }

    case UPDATE_LATEST_BLOCK: {
      const { block } = payload
      return {
        ...state,
        [LATEST_BLOCK]: block
      }
    }

    case UPDATE_HEAD_BLOCK: {
      const { block } = payload
      return {
        ...state,
        [HEAD_BLOCK]: block
      }
    }

    case UPDATED_SUPPORTED_TOKENS: {
      const { supportedTokens } = payload
      return {
        ...state,
        [SUPPORTED_TOKENS]: supportedTokens
      }
    }

    default: {
      throw Error(`Unexpected action type in DataContext reducer: '${type}'.`)
    }
  }
}

export function useLatestBlocks() {
  const [state, { updateLatestBlock, updateHeadBlock }] = useApplicationContext()

  const latestBlock = state?.[LATEST_BLOCK]
  const headBlock = state?.[HEAD_BLOCK]

  useEffect(() => {
    async function fetch() {
      healthClient
        .query({
          query: SUBGRAPH_HEALTH
        })
        .then(res => {
          const syncedBlock = res.data.indexingStatusForCurrentVersion.chains[0].latestBlock.number
          const headBlock = res.data.indexingStatusForCurrentVersion.chains[0].chainHeadBlock.number
          if (syncedBlock && headBlock) {
            updateLatestBlock(syncedBlock)
            updateHeadBlock(headBlock)
          }
        })
        .catch(e => {
          console.log(e)
        })
    }
    if (!latestBlock) {
      fetch()
    }
  }, [latestBlock, updateHeadBlock, updateLatestBlock])

  return [latestBlock, headBlock]
}

const INITIAL_STATE = {
  CURRENCY: 'USD',
  TIME_KEY: timeframeOptions.ALL_TIME
}

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  const update = useCallback(currency => {
    dispatch({
      type: UPDATE,
      payload: {
        currency
      }
    })
  }, [])

  // global time window for charts - see timeframe options in constants
  const updateTimeframe = useCallback(newTimeFrame => {
    dispatch({
      type: UPDATE_TIMEFRAME,
      payload: {
        newTimeFrame
      }
    })
  }, [])

  // used for refresh button
  const updateSessionStart = useCallback(timestamp => {
    dispatch({
      type: UPDATE_SESSION_START,
      payload: {
        timestamp
      }
    })
  }, [])

  const updateSupportedTokens = useCallback(supportedTokens => {
    dispatch({
      type: UPDATED_SUPPORTED_TOKENS,
      payload: {
        supportedTokens
      }
    })
  }, [])

  const updateLatestBlock = useCallback(block => {
    dispatch({
      type: UPDATE_LATEST_BLOCK,
      payload: {
        block
      }
    })
  }, [])

  const updateHeadBlock = useCallback(block => {
    dispatch({
      type: UPDATE_HEAD_BLOCK,
      payload: {
        block
      }
    })
  }, [])

  return (
    <ApplicationContext.Provider
      value={useMemo(
        () => [
          state,
          {
            update,
            updateSessionStart,
            updateTimeframe,
            updateSupportedTokens,
            updateLatestBlock,
            updateHeadBlock
          }
        ],
        [state, update, updateTimeframe, updateSessionStart, updateSupportedTokens, updateLatestBlock, updateHeadBlock]
      )}
    >
      {children}
    </ApplicationContext.Provider>
  )
}
