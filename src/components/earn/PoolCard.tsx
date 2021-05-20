import React from 'react'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import styled from 'styled-components'
import { TYPE, StyledInternalLink } from '../../theme'
import DoubleCurrencyLogo from '../DoubleLogo'
import { ETHER, JSBI, TokenAmount } from '@wanswap/sdk'
import { ButtonPrimary } from '../Button'
import { StakingInfo } from '../../state/stake/hooks'
import { useColor } from '../../hooks/useColor'
import { currencyId } from '../../utils/currencyId'
import { Break, CardNoise, CardBGImage } from './styled'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { useTotalSupply } from '../../data/TotalSupply'
import { usePair } from '../../data/Reserves'
import useUSDCPrice from '../../utils/useUSDCPrice'
import { useTranslation } from 'react-i18next'
import { WASP } from '../../constants'
import { useActiveWeb3React } from '../../hooks'

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
  position:relative;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: 48px 1fr 96px;
  `};
`

// const APR = styled.div`
//   display: flex;
//   justify-content: flex-end;
// `
const PoolRate = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
   display: none;
  `};
`
const DepositTitle = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
   display: none;
  `};
`
const BottomSection = styled.div<{ showBackground: boolean }>`
  padding: 12px 16px;
  opacity: ${({ showBackground }) => (showBackground ? '1' : '0.4')};
  border-radius: 0 0 10px 10px;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  z-index: 1;
`


const Multiplier = styled.span`
font-weight: 500;
    text-align: center;
    border-radius: 5px;

    margin-left: 10px;
    padding: 0px 5px;
    font-size: 16px;
    color: #2172E5;
    border: 1px solid #FFE600;
    color: #FFE600;
    background: transparent;
    ${({ theme }) => theme.mediaWidth.upToSmall`
      position:absolute;
      bottom:-23px;
      left:5px;
  `};
`

declare global {
  interface Window {
    tvlItems: any;
  }
}

export default function PoolCard({ stakingInfo, hide }: { stakingInfo: StakingInfo, hide?: Boolean }) {
  const token0 = stakingInfo.tokens[0]
  const token1 = stakingInfo.tokens[1]

  const currency0 = unwrappedToken(token0)
  const currency1 = unwrappedToken(token1)
  const { t } = useTranslation()

  const isStaking = Boolean(stakingInfo.stakedAmount.greaterThan('0'))

  // get the color of the token
  const token = currency0 === ETHER ? token1 : token0
  const WETH = currency0 === ETHER ? token0 : token1
  const backgroundColor = useColor(token)

  const totalSupplyOfStakingToken = useTotalSupply(stakingInfo.stakedAmount.token)
  const [, stakingTokenPair] = usePair(...stakingInfo.tokens)

  const baseAllocPoint = 200;
  const multiplier = stakingInfo.allocPoint && Number(stakingInfo.allocPoint?.toString()) / baseAllocPoint;
  // console.log('multiplier', currency0.symbol, currency1.symbol, multiplier?.toString(), stakingInfo.allocPoint?.toString());


  // let returnOverMonth: Percent = new Percent('0')
  let valueOfTotalStakedAmountInWETH: TokenAmount | undefined
  let valueOfTotalStakedAmountInWLSP: TokenAmount | undefined

  if (totalSupplyOfStakingToken && stakingTokenPair) {
    // take the total amount of LP tokens staked, multiply by WAN value of all LP tokens, divide by all LP tokens
    valueOfTotalStakedAmountInWETH = new TokenAmount(
      WETH,
      JSBI.divide(
        JSBI.multiply(
          JSBI.multiply(stakingInfo.totalStakedAmount.raw, stakingTokenPair.reserveOf(WETH).raw),
          JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the WETH they entitle owner to
        ),
        totalSupplyOfStakingToken.raw
      )
    )
    valueOfTotalStakedAmountInWLSP = new TokenAmount(
      WETH,
      JSBI.multiply(stakingInfo.totalStakedAmount.raw, JSBI.BigInt(1))
    )
  }

  // get the USD value of staked WETH
  const USDPrice = useUSDCPrice(WETH)
  const valueOfTotalStakedAmountInUSDC =
    valueOfTotalStakedAmountInWETH && USDPrice?.quote(valueOfTotalStakedAmountInWETH)
  
  const { chainId } = useActiveWeb3React()
  const uni = chainId ? WASP[chainId] : undefined
  const uniPrice = useUSDCPrice(uni)
  const weekReward = stakingInfo.totalRewardRate?.multiply(`${60 * 60 * 24 * 7}`)?.toFixed(0)
  const apy = valueOfTotalStakedAmountInUSDC && weekReward && uniPrice ? (Number(weekReward) * Number(uniPrice?.toFixed(8)) / Number(valueOfTotalStakedAmountInUSDC.toFixed(0)) / 7 * 365 * 100).toFixed(0) : '--' 

  if (valueOfTotalStakedAmountInUSDC && stakingTokenPair) {
    if (!window.tvlItems) {
      window.tvlItems = {}
    }
    window.tvlItems[stakingTokenPair!.liquidityToken.address] = valueOfTotalStakedAmountInUSDC.toFixed(0)
  }

  const isActive = Boolean(stakingInfo.totalRewardRate.greaterThan('0'));

  return (
    <React.Fragment>
      {
        !hide &&   <div>
        <Wrapper showBackground={isStaking} bgColor={backgroundColor}>
        <CardBGImage desaturate />
        <CardNoise />
  
        <TopSection>
          <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={24} />
          <TYPE.white fontWeight={600} fontSize={18} style={{ marginLeft: '8px' }}>
            {currency0.symbol} / {currency1.symbol} 
            {
              !isActive && <SpanFinished>{t("Inactive")}</SpanFinished>
            }
            <Multiplier>
            {
              multiplier+'x'
            }
            </Multiplier>
          </TYPE.white>
  
          <StyledInternalLink to={`/farm/${currencyId(currency0)}/${currencyId(currency1)}`} style={{ width: '100%',color:'transparent' }}>
            <ButtonPrimary padding="8px" borderRadius="8px">
              {isStaking ? t('Manage') : t('Deposit')}
            </ButtonPrimary>
          </StyledInternalLink>
        </TopSection>
  
        <StatContainer>
          <RowBetween>
            <TYPE.white><DepositTitle>{t('totalDeposited')}</DepositTitle></TYPE.white>
            <TYPE.white>
              {valueOfTotalStakedAmountInUSDC
                ? `$${valueOfTotalStakedAmountInUSDC.toFixed(0, { groupSeparator: ',' })} 🔥 APY: ${apy}%`
                //  +
                //   ' / ' +
                //   `${valueOfTotalStakedAmountInWLSP?.toSignificant(6, { groupSeparator: ',' }) ?? '-'} WSLP`
                : `${valueOfTotalStakedAmountInWLSP?.toSignificant(6, { groupSeparator: ',' }) ?? '-'} WSLP`}
            </TYPE.white>
          </RowBetween>
          <PoolRate>
          <RowBetween>
            
            <TYPE.white> {t("Pool rate")} </TYPE.white>
            <TYPE.white>{`${stakingInfo.totalRewardRate
              ?.multiply(`${60 * 60 * 24 * 7}`)
              ?.toFixed(0, { groupSeparator: ',' })} WASP / week`}</TYPE.white>
              
          </RowBetween>
          </PoolRate>
        </StatContainer>
  
        {isStaking && (
          <>
            <Break />
            <BottomSection showBackground={true}>
              <TYPE.black color={'white'} fontWeight={500}>
                <span>Your rate</span>
              </TYPE.black>
  
              <TYPE.black style={{ textAlign: 'right' }} color={'white'} fontWeight={500}>
                <span  id="animate-zoom" role="img" aria-label="wizard-icon" style={{ marginRight: '0.5rem' }}>
                ⚡
                </span>
                {`${stakingInfo.rewardRate
                  ?.multiply(`${60 * 60 * 24 * 7}`)
                  ?.toFixed(0, { groupSeparator: ',' })} WASP / week`}
              </TYPE.black>
            </BottomSection>
          </>
        )}
      </Wrapper>
      
    </div>
    }
  </React.Fragment>
  )
}

const SpanFinished = styled.span`
  background: #d15458;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 10px;
  margin-left: 10px;
`;
