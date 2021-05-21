import React, { useEffect, useMemo, useState } from 'react'
import { STAKING_GENESIS, REWARDS_DURATION_DAYS } from '../../state/stake/hooks'
import { TYPE } from '../../theme'
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const MINUTE = 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const REWARDS_DURATION = DAY * REWARDS_DURATION_DAYS

export function Countdown({ exactEnd, exactStart }: { exactEnd?: Date; exactStart?: Date }) {
  // get end/beginning times
  const end = useMemo(() => (exactEnd ? Math.floor(exactEnd.getTime() / 1000) : STAKING_GENESIS + REWARDS_DURATION), [
    exactEnd
  ])
  // const begin = useMemo(() => end - REWARDS_DURATION, [end])
  const begin = useMemo(
    () => (exactStart ? Math.floor(exactStart.getTime() / 1000) : STAKING_GENESIS),
    [exactStart]
  )
  // get current time
  const [time, setTime] = useState(() => Math.floor(Date.now() / 1000))
  useEffect((): (() => void) | void => {
    // we only need to tick if rewards haven't ended yet
    if (time <= end) {
      const timeout = setTimeout(() => setTime(Math.floor(Date.now() / 1000)), 1000)
      return () => {
        clearTimeout(timeout)
      }
    }
  }, [time, end])

  const timeUntilGenesis = begin - time
  const timeUntilEnd = end - time

  const { t } = useTranslation()

  let timeRemaining: number
  let message: string
  if (timeUntilGenesis >= 0) {
    message = 'Start in'
    timeRemaining = timeUntilGenesis
  } else {
    const ongoing = timeUntilEnd >= 0
    if (ongoing) {
      message = 'End in'
      timeRemaining = timeUntilEnd
    } else {
      message = 'Rewards have ended!'
      timeRemaining = Infinity
    }
  }

  const days = (timeRemaining - (timeRemaining % DAY)) / DAY
  timeRemaining -= days * DAY
  const hours = (timeRemaining - (timeRemaining % HOUR)) / HOUR
  timeRemaining -= hours * HOUR
  const minutes = (timeRemaining - (timeRemaining % MINUTE)) / MINUTE
  timeRemaining -= minutes * MINUTE
  const seconds = timeRemaining

  return (
    <TYPE.black fontWeight={400} fontSize={'17px'}>
      
      {
        message.includes('ended') && <SpanFinished>{t("Inactive")}</SpanFinished>
      }
      {Number.isFinite(timeRemaining) && (
        <code>
          
        </code>
      )}
      {
        message.includes('End in') && <SpanActive>{t('Active: ') + t(message)}{' '} {`${days}:${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</SpanActive>
      }
      {
        message.includes('Start in') && <SpanPending>Pending: Start in {`${days}:${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</SpanPending>
      }
    </TYPE.black>
  )
}


const SpanFinished = styled.span`
  background: #d15458;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 10px;
`;

const SpanActive = styled.span`
background: #54d186;
padding: 5px 10px;
border-radius: 15px;
font-size: 10px;
`;

const SpanPending = styled.span`
background: #1a4b80;
padding: 5px 10px;
border-radius: 15px;
font-size: 10px;
`;