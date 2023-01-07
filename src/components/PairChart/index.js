/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Box } from 'rebass/styled-components'
import { ResponsiveContainer } from 'recharts'
import { usePairChartData, useHourlyRateData } from '../../contexts/PairData'
import CandleStickChart from '../CandleChart'
import LocalLoader from '../LocalLoader'
import Numeral from 'numeral'
import dayjs from 'dayjs'
import CurrencyLogo from '../CurrencyLogo'
import { isMobile } from 'react-device-detect'

const timeframeOptions = {
  DAY: '1 day',
  WEEK: '1 week',
  MONTH: '1 month',
  // THREE_MONTHS: '3 months',
  // YEAR: '1 year',
  HALF_YEAR: '6 months',
  ALL_TIME: 'All time'
}

const EmptyCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  border-radius: 20px;
  color: ${({ theme }) => theme.text1};
  height: ${({ height }) => height && height};
`

const toK = num => {
  return Numeral(num).format('0.[00]a')
}

const formatDollarAmount = (num, digits) => {
  const formatter = new Intl.NumberFormat([], {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  })
  return formatter.format(num)
}

const formattedNum = (number, usd = false) => {
  if (isNaN(number) || number === '' || number === undefined) {
    return usd ? '$0' : 0
  }
  const num = parseFloat(number)

  if (num > 500000000) {
    return (usd ? '$' : '') + toK(num.toFixed(0), true)
  }

  if (num === 0) {
    if (usd) {
      return '$0'
    }
    return 0
  }

  if (num < 0.0001 && num > 0) {
    return usd ? '< $0.0001' : '< 0.0001'
  }

  if (num > 1000) {
    return usd ? formatDollarAmount(num, 0) : Number(parseFloat(num).toFixed(0)).toLocaleString()
  }

  if (usd) {
    if (num < 0.1) {
      return formatDollarAmount(num, 4)
    } else {
      return formatDollarAmount(num, 2)
    }
  }

  return Number(parseFloat(num).toFixed(4)).toString()
}

function getTimeframe(timeWindow) {
  const utcEndTime = dayjs.utc()
  // based on window, get starttime
  let utcStartTime
  switch (timeWindow) {
    case timeframeOptions.WEEK:
      utcStartTime =
        utcEndTime
          .subtract(1, 'week')
          .endOf('day')
          .unix() - 1
      break
    case timeframeOptions.MONTH:
      utcStartTime =
        utcEndTime
          .subtract(1, 'month')
          .endOf('day')
          .unix() - 1
      break
    case timeframeOptions.ALL_TIME:
      utcStartTime =
        utcEndTime
          .subtract(1, 'year')
          .endOf('day')
          .unix() - 1
      break
    default:
      utcStartTime =
        utcEndTime
          .subtract(1, 'year')
          .startOf('year')
          .unix() - 1
      break
  }
  return utcStartTime
}

const Row = styled(Box)`
  width: 100%;
  display: flex;
  padding: 0;
  align-items: center;
  align-items: ${({ align }) => align && align};
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
  justify-content: ${({ justify }) => justify};
`

const AutoRow = styled(Row)`
  flex-wrap: ${({ wrap }) => wrap ?? 'nowrap'};
  margin: -${({ gap }) => gap};
  & > * {
    margin: ${({ gap }) => gap} !important;
  }
`

const OptionButton = styled.div`
  font-weight: 500;
  width: fit-content;
  white-space: nowrap;
  padding: 3px;
  border-radius: 6px;
  border: ${({ active, theme }) => (active ? 'none' : '1px solid ' + theme.primary7)};
  background-color: ${({ active, theme }) => active && theme.yellow3 };
  color: ${({ active }) => (active ? '#333333' : '#8F8D8B')};

  :hover {
    cursor: ${({ disabled }) => !disabled && 'pointer'};
  }
`

const ChartWrapper = styled.div`
  height: 100%;
  max-height: 340px;
  @media screen and (max-width: 600px) {
    min-height: 200px;
  }
`

const OptionsRow = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: ${isMobile ? '48px' : '60px'};
  padding-left: 40px;
`

const CHART_VIEW = {
  VOLUME: 'Volume',
  LIQUIDITY: 'Liquidity',
  RATE0: 'Rate 0',
  RATE1: 'Rate 1'
}

const PairChart = ({ address, base0, base1, positive, currencyIn, currencyOut }) => {
  const [chartFilter] = useState(CHART_VIEW.RATE0)

  const [timeWindow, setTimeWindow] = useState(timeframeOptions.WEEK)

  // update the width on a window resize
  const ref = useRef()
  const isClient = typeof window === 'object'
  const [width, setWidth] = useState(ref?.current?.container?.clientWidth)
  const [height, setHeight] = useState(ref?.current?.container?.clientHeight)
  useEffect(() => {
    if (!isClient) {
      return false
    }
    function handleResize() {
      setWidth(ref?.current?.container?.clientWidth ?? width)
      setHeight(ref?.current?.container?.clientHeight ?? height)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [height, isClient, width]) // Empty array ensures that effect is only run on mount and unmount

  // get data for pair, and rates
  // const pairData = usePairData(address)
  let chartData = usePairChartData(address)
  const hourlyData = useHourlyRateData(address, timeWindow)
  const hourlyRate0 = hourlyData && hourlyData[0]
  const hourlyRate1 = hourlyData && hourlyData[1]

  // formatted symbols for overflow
  // const formattedSymbol0 =
  //   pairData?.token0?.symbol.length > 6 ? pairData?.token0?.symbol.slice(0, 5) + '...' : pairData?.token0?.symbol
  // const formattedSymbol1 =
  //   pairData?.token1?.symbol.length > 6 ? pairData?.token1?.symbol.slice(0, 5) + '...' : pairData?.token1?.symbol

  // const below1600 = useMedia('(max-width: 1600px)')
  // const below1080 = useMedia('(max-width: 1080px)')
  // const below600 = useMedia('(max-width: 600px)')

  const utcStartTime = getTimeframe(timeWindow)
  chartData = chartData?.filter(entry => entry.date >= utcStartTime)

  if (chartData && chartData.length === 0) {
    return (
      <ChartWrapper>
        <EmptyCard height="300px">No historical data yet.</EmptyCard>{' '}
      </ChartWrapper>
    )
  }

  /**
   * Used to format values on chart on scroll
   * Needs to be raw html for chart API to parse styles
   * @param {*} val
   */
  function valueFormatter(val) {
    /* if (chartFilter === CHART_VIEW.RATE0) {
      return (
        formattedNum(val) +
        `<span style="font-size: 12px; margin-left: 4px;">${formattedSymbol1}/${formattedSymbol0}<span>`
      )
    }
    if (chartFilter === CHART_VIEW.RATE1) {
      return (
        formattedNum(val) +
        `<span style="font-size: 12px; margin-left: 4px;">${formattedSymbol0}/${formattedSymbol1}<span>`
      )
    } */
    return formattedNum(val)
  }

  // const aspect = below1080 ? 60 / 20 : below1600 ? 60 / 28 : 60 / 22

  //  <DropdownSelect options={CHART_VIEW} active={chartFilter} setActive={setChartFilter} color={color} />
  //  <DropdownSelect options={timeframeOptions} active={timeWindow} setActive={setTimeWindow} color={color} />
  return (
    <ChartWrapper>
      <OptionsRow>
        <AutoColumn gap={isMobile ? '0' : '12px'} style={{ flexWrap: 'nowrap' }}>
          <PairInfo>
            <CurrencyLogo currency={currencyIn} size={'24px'} />
            <Text>{currencyIn ? currencyIn.symbol : '-'}</Text>
            <Gap>/</Gap>
            <CurrencyLogo currency={currencyOut} size={'24px'} />
            <Text>{currencyOut ? currencyOut.symbol : '-'}</Text>
          </PairInfo>
          <AutoRow justify={isMobile ? 'flex-start' : 'flex-end'} gap="2px">
            <OptionButton
              active={timeWindow === timeframeOptions.DAY}
              onClick={() => setTimeWindow(timeframeOptions.DAY)}
            >
              1D
            </OptionButton>
            <OptionButton
              active={timeWindow === timeframeOptions.WEEK}
              onClick={() => setTimeWindow(timeframeOptions.WEEK)}
            >
              1W
            </OptionButton>
            <OptionButton
              active={timeWindow === timeframeOptions.MONTH}
              onClick={() => setTimeWindow(timeframeOptions.MONTH)}
            >
              1M
            </OptionButton>
            <OptionButton
              active={timeWindow === timeframeOptions.ALL_TIME}
              onClick={() => setTimeWindow(timeframeOptions.ALL_TIME)}
            >
              All
            </OptionButton>
          </AutoRow>
        </AutoColumn>
      </OptionsRow>
      {chartFilter === CHART_VIEW.RATE0 &&
        (hourlyRate0 ? (
          <ResponsiveContainer ref={ref} height="70%">
            <CandleStickChart
              data={!positive ? hourlyRate0 : hourlyRate1}
              base={!positive ? base1 : base0}
              margin={false}
              width={width}
              valueFormatter={valueFormatter}
              timeWindow={timeWindow}
              setTimeWindow={setTimeWindow}
            />
          </ResponsiveContainer>
        ) : (
          <LocalLoader />
        ))}
    </ChartWrapper>
  )
}

export default PairChart

const PairInfo = styled.div`
  height: 50px;
  line-height: 50px;
  display: flex;
  align-items: center;
  width: ${isMobile ? '100%' : 'initial'};
`

const Text = styled.span`
  color: #fff;
  display: inline-block;
  height: 42px;
  line-height: 42px;
  margin-left: 6px;
  font-size: 18px;
`

const Gap = styled.span`
  display: inline-block;
  margin: 0 10px;
  color: #ffffff;
  font-size: 22px;
`

const AutoColumn = styled(AutoRow)`
  flex-direction: ${isMobile ? 'column' : 'row'};
`
