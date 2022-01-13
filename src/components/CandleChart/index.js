/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react'
import { createChart, CrosshairMode } from 'lightweight-charts'
import dayjs from 'dayjs'
import { usePrevious } from 'react-use'
import Numeral from 'numeral'
import { isMobile } from 'react-device-detect'

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

const CandleStickChart = ({
  data,
  width = 500,
  height = 500,
  base,
  margin = true,
  valueFormatter = val => formattedNum(val, true)
}) => {
  // reference for DOM element to create with chart
  const ref = useRef()
  const [darkMode] = useState(true)
  const formattedData = data?.map(entry => {
    return {
      time: parseFloat(entry.timestamp),
      open: parseFloat(entry.open),
      low: parseFloat(entry.open),
      close: parseFloat(entry.close),
      high: parseFloat(entry.close)
    }
  })

  if (formattedData && formattedData.length > 0) {
    formattedData.push({
      time: dayjs().unix(),
      open: parseFloat(formattedData[formattedData.length - 1].close),
      close: parseFloat(base),
      low: Math.min(parseFloat(base), parseFloat(formattedData[formattedData.length - 1].close)),
      high: Math.max(parseFloat(base), parseFloat(formattedData[formattedData.length - 1].close))
    })
  }

  // pointer to the chart object
  const [chartCreated, setChartCreated] = useState(false)
  const dataPrev = usePrevious(data)

  const textColor = darkMode ? 'white' : 'black'
  const previousTheme = usePrevious(darkMode)

  // reset the chart if theme switches
  useEffect(() => {
    if (chartCreated && previousTheme !== darkMode) {
      // remove the tooltip element
      const tooltip = document.getElementById('tooltip-id')
      const node = document.getElementById('test-id')
      node.removeChild(tooltip)
      chartCreated.resize(0, 0)
      setChartCreated()
    }
  }, [chartCreated, darkMode, previousTheme])

  useEffect(() => {
    if (data !== dataPrev && chartCreated) {
      // remove the tooltip element
      const tooltip = document.getElementById('tooltip-id')
      const node = document.getElementById('test-id')
      node.removeChild(tooltip)
      chartCreated.resize(0, 0)
      setChartCreated()
    }
  }, [chartCreated, data, dataPrev])

  // if no chart created yet, create one with options and add to DOM manually
  useEffect(() => {
    if (!chartCreated) {
      const chart = createChart(ref.current, {
        width: 500,
        height: 500,
        layout: {
          backgroundColor: 'transparent',
          textColor: textColor
        },
        grid: {
          vertLines: {
            color: 'rgba(197, 203, 206, 0.5)',
            visible: false
          },
          horzLines: {
            color: 'rgba(197, 203, 206, 0.5)',
            visible: false
          }
        },
        crosshair: {
          mode: CrosshairMode.Normal
        },
        leftPriceScale: {
          borderColor: 'rgba(197, 203, 206, 0.8)',
          visible: true
        },
        timeScale: {
          fixLeftEdge: true,
          fixRightEdge: true,
          borderColor: 'rgba(197, 203, 206, 0.8)'
        },
        localization: {
          priceFormatter: val => formattedNum(val)
        }
      })

      const candleSeries = chart.addCandlestickSeries({
        upColor: 'green',
        downColor: 'red',
        borderDownColor: 'red',
        borderUpColor: 'green',
        wickDownColor: 'red',
        wickUpColor: 'green'
      })

      candleSeries.setData(formattedData)

      const toolTip = document.createElement('div')
      toolTip.setAttribute('id', 'tooltip-id')
      toolTip.className = 'three-line-legend'
      ref.current.appendChild(toolTip)
      toolTip.style.display = 'block'
      toolTip.style.left = (margin ? 32 : 32) + 'px'
      toolTip.style.top = (isMobile ? 95 : 40) + 'px'
      toolTip.style.backgroundColor = 'transparent'
      toolTip.style.position = 'absolute'
      // get the title of the chart

      function setLastBarText() {
        toolTip.innerHTML = base
          ? `<div style="font-size: 32px; font-weight: 600; margin: 14px; color: ${textColor}">` +
            valueFormatter(base) +
            '</div>'
          : ''
      }
      setLastBarText()

      // update the title when hovering on the chart
      chart.subscribeCrosshairMove(function(param) {
        if (
          param === undefined ||
          param.time === undefined ||
          param.point.x < 0 ||
          param.point.x > width ||
          param.point.y < 0 ||
          param.point.y > height
        ) {
          setLastBarText()
        } else {
          const price = param.seriesPrices.get(candleSeries).close
          const time = dayjs.unix(param.time).format('MM/DD h:mm A')
          toolTip.innerHTML =
            `<div style="font-size: 32px; font-weight: 600; margin: 14px; color: ${textColor}">` +
            valueFormatter(price) +
            `<span style="font-size: 12px; margin: 4px 6px; color: ${textColor}">` +
            time +
            '</span>' +
            '</div>'
        }
      })

      chart.timeScale().fitContent()

      setChartCreated(chart)
    }
  }, [chartCreated, formattedData, width, height, valueFormatter, base, margin, textColor])

  // responsiveness
  useEffect(() => {
    if (width) {
      chartCreated && chartCreated.resize(width, height)
      chartCreated && chartCreated.timeScale().scrollToPosition(0)
    }
  }, [chartCreated, height, width])

  return (
    <div>
      <div ref={ref} id="test-id" />
    </div>
  )
}

export default CandleStickChart
