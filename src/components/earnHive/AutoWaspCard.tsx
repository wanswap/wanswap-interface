import React, { useMemo } from 'react'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import styled from 'styled-components'
import { TYPE, StyledInternalLink } from '../../theme'
import { ETHER } from '@wanswap/sdk'
import { ButtonPrimary } from '../Button'
import { StakingInfo } from '../../state/stake/hooks'
import { useColor } from '../../hooks/useColor'
import { currencyId } from '../../utils/currencyId'
import { CardNoise, CardBGImage } from './styled'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { useTranslation } from 'react-i18next'
import CurrencyLogo from '../CurrencyLogo'
import { Countdown } from '../../pages/Hive/Countdown'
import useUSDCPrice from '../../utils/useUSDCPrice'
import { useActiveWeb3React } from '../../hooks'
import { WASP } from '../../constants'

const StatContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  grid-gap: 12px;
  margin-bottom: 1rem;
  margin-right: 1rem;
  margin-left: 1rem;
`

const Wrapper = styled(AutoColumn)<{ showBackground: boolean; bgColor: any }>`
border-radius:10px;
  width: 100%;
  overflow: hidden;
  position: relative;
  opacity: ${({ showBackground }) => (showBackground ? '1' : '1')};
  background: radial-gradient(100% 90% at 20% 0%,#41beec 0%,#123471 100%);
  color: ${({ theme, showBackground }) => (showBackground ? theme.white : theme.text1)} !important;

  ${({ showBackground }) =>
    showBackground &&
    `  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);`}
`

const TopSection = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr 120px;
  grid-gap: 0px;
  align-items: center;
  padding: 1rem;
  z-index: 1;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: 48px 1fr 96px;
  `};
`

declare global {
  interface Window {
    tvlItems: any;
  }
}

export default function AutoWaspCard({ stakingInfo, i, hide }: { stakingInfo: StakingInfo; i: number; hide?: Boolean }) {
  const token0 = stakingInfo.tokens[0]
  const token1 = stakingInfo.tokens[1]

  const currency0 = unwrappedToken(token0)
  const { t } = useTranslation()

  const isStaking = Boolean(stakingInfo.stakedAmount.greaterThan('0'))

  // get the color of the token
  const token = currency0 === ETHER ? token1 : token0
  const backgroundColor = useColor(token)

  const { chainId } = useActiveWeb3React()
  const uni = chainId ? WASP[chainId] : undefined

  const uniPrice = useUSDCPrice(uni)

  if (stakingInfo && uniPrice) {
    if (!window.tvlItems) {
      window.tvlItems = {}
    }
    window.tvlItems['hive'] = (Number(stakingInfo?.totalStakedAmount.toFixed(0)) * Number(uniPrice.toFixed(8))).toFixed(0)
  }

  const tokenPrice = useUSDCPrice(token1)

  const stakedUsd = useMemo(() => {
    return stakingInfo?.totalStakedAmount && uniPrice ? (Number(stakingInfo?.totalStakedAmount.toExact()) * Number(uniPrice.toFixed(8))) : undefined;
  }, [stakingInfo, uniPrice])

  const apy = useMemo(() => {
    return stakedUsd && stakingInfo?.totalRewardRate && tokenPrice ? (Number(stakingInfo?.totalRewardRate.toExact()) * Number(tokenPrice?.toFixed(8)) * 3600*24 * 365 * 100 / 5 / Number(stakedUsd.toFixed(0))).toFixed(0) : '--' 
  }, [stakingInfo, stakedUsd, tokenPrice])

  return (
    <React.Fragment>
      {
        !hide && <div>
        <Wrapper showBackground={isStaking} bgColor={backgroundColor}>
        <CardBGImage desaturate />
        <CardNoise />
  
        <TopSection>
          <CurrencyLogo currency={currency0} size={'24px'} />
          <TYPE.white fontWeight={600} fontSize={18} style={{ marginLeft: '8px' }}>
            {currency0.symbol}
            <Countdown exactEnd={stakingInfo?.periodFinish} exactStart={stakingInfo?.periodStart} />
          </TYPE.white>
  
          <StyledInternalLink to={`/hive/${currencyId(currency0)}/${i}`} style={{ width: '100%',color:'transparent' }}>
            
            <ButtonPrimary padding="8px" borderRadius="8px">
              {isStaking ? t('Manage') : t('Deposit')}
            </ButtonPrimary>
          </StyledInternalLink>
        </TopSection>
  
        <StatContainer>
          <RowBetween>
            <TYPE.white>{t('totalDeposited')}</TYPE.white>
            <TYPE.white>
              {`${stakingInfo?.totalStakedAmount.toFixed(0, { groupSeparator: ',' }) ?? '-'} WASP`}
              {
                apy && apy !== '--' && !isNaN(Number(apy)) && apy !== '0' ? ' 🔥 ' : null
              }
              {
                apy && apy !== '--' && !isNaN(Number(apy)) && apy !== '0' ? 'APR: ' + apy + '%' : null
              }
            </TYPE.white>
          </RowBetween>
        </StatContainer>
      </Wrapper>

    </div>
    }
    </React.Fragment>
  )
}
