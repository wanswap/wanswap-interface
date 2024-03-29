import React, { useMemo } from 'react'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import styled, { css } from 'styled-components'
import { TYPE, StyledInternalLink } from '../../theme'
import { ButtonGreen } from '../Button'
import { useStakeWaspEarnWaspInfo } from '../../state/hive/hooks'
import { currencyId } from '../../utils/currencyId'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { useTranslation } from 'react-i18next'
import CurrencyLogo from '../CurrencyLogo'
// import useUSDCPrice from '../../utils/useUSDCPrice'
// import { useActiveWeb3React } from '../../hooks'
// import { WASP } from '../../constants'
import BN from 'bignumber.js'
import { isMobile } from 'react-device-detect'

const StatContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  grid-gap: 12px;
  margin-bottom: 1rem;
  margin-right: 1rem;
  margin-left: 1rem;
`

const Wrapper = styled(AutoColumn)<{ showBackground: boolean; }>`
  border-radius:10px;
  width: 100%;
  overflow: hidden;
  position: relative;
  opacity: ${({ showBackground }) => (showBackground ? '1' : '1')};
  background: ${({theme}) => theme.bg6};
  color: ${({ theme, showBackground }) => (showBackground ? theme.white : theme.text1)} !important;
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

const RowBetweenMobile = styled(RowBetween)`
  ${
    isMobile && css`
      flex-wrap: wrap;
    `
  }
`;

declare global {
  interface Window {
    tvlItems: any;
  }
}

export default function AutoWaspCard({ hide }: { hide?: Boolean }) {
  const stakingInfo = useStakeWaspEarnWaspInfo();
  const token0 = stakingInfo.tokens[0]
  
  const currency0 = unwrappedToken(token0)
  const { t } = useTranslation()
  
  const isStaking = Boolean(stakingInfo.stakedAmount.greaterThan('0'))
    
  // const { chainId } = useActiveWeb3React()
  
  // const uniPrice = useUSDCPrice(token0)
  
  // if (stakingInfo && uniPrice) {
  //   if (!window.tvlItems) {
  //     window.tvlItems = {}
  //   }
  //   window.tvlItems['hive'] = (Number(stakingInfo?.totalStakedAmount.toFixed(0)) * Number(uniPrice.toFixed(8))).toFixed(0)
  // }
  
  const apr = useMemo(() => {
    const {
      totalStakedAmount,
      totalRewardRate
    } = stakingInfo 
    if (!(totalStakedAmount && new BN(totalStakedAmount.toString()).gt(0) &&  totalRewardRate)) return ''
    return new BN(totalRewardRate.toExact()).times(3600).times(24).div(totalStakedAmount.toString())
  }, [stakingInfo])
  
  // console.log('apr', apr.toString())
  const apy = apr === '' ? '--' :  new BN(apr).plus(1).exponentiatedBy(365).minus(1).times(100).toFixed(0);
  // console.log('autoapy-=-', apr.toString(), apy, Number(stakingInfo?.totalRewardRate.toExact()), Number(stakingInfo?.totalStakedAmount.toString()))
  
  return (
    <React.Fragment>
      {
        !hide && <div>
        <Wrapper showBackground={isStaking}>
  
        <TopSection>
          <CurrencyLogo currency={currency0} size={'24px'} />
          <TYPE.white fontWeight={600} fontSize={18} style={{ marginLeft: '8px' }}>
            Auto {currency0.symbol}
            <TYPE.white fontSize={12} color={'rgba(255, 255, 255, 0.5)'}>{t('Automatic restaking')}</TYPE.white>
          </TYPE.white>
          <StyledInternalLink to={`/autoWasp/${currencyId(currency0)}`} style={{ width: '100%',color:'transparent' }}>
            
            <ButtonGreen padding="8px" borderRadius="8px">
              {isStaking ? t('Manage') : t('Deposit')}
            </ButtonGreen>
          </StyledInternalLink>
        </TopSection>
  
        <StatContainer>
          <RowBetweenMobile>
            <TYPE.white>{t('totalDeposited')}</TYPE.white>
            {
              isMobile ?
              <>
                <TYPE.yellow3>
                  {`${stakingInfo?.totalStakedAmount.toFormat(0) ?? '-'} WASP`}
                </TYPE.yellow3>
                <TYPE.yellow3>
                  {
                    apy && apy !== '--' && !isNaN(Number(apy)) && apy !== '0' ? ' 🔥 ' : null
                  }
                  {
                    apy && apy !== '--' && !isNaN(Number(apy)) && apy !== '0' ? `APY: ${+apy > 100000 ? ' > 100,000' : new BN(apy).toFormat(0)}%` : null
                  }
                </TYPE.yellow3>
              </>
                :
              <TYPE.yellow3>
                {`${stakingInfo?.totalStakedAmount.toFormat(0) ?? '-'} WASP`}
                {
                  apy && apy !== '--' && !isNaN(Number(apy)) && apy !== '0' ? ' 🔥 ' : null
                }
                {
                  apy && apy !== '--' && !isNaN(Number(apy)) && apy !== '0' ? `APY: ${+apy > 100000 ? ' > 100,000' : new BN(apy).toFormat(0)}%` : null
                }
              </TYPE.yellow3>
            }
          </RowBetweenMobile>
        </StatContainer>
      </Wrapper>

    </div>
    }
    </React.Fragment>
  )
}
