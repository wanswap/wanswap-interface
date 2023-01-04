import React, { useContext, useEffect } from 'react'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import styled, { ThemeContext } from 'styled-components'
import { TYPE, StyledInternalLink } from '../../theme'
import DoubleCurrencyLogo from '../DoubleLogo'
import { ETHER, JSBI, TokenAmount } from '@wanswap/sdk'
import { ButtonGreen } from '../Button'
import { StakingInfo } from '../../state/stake/hooks'
// import { useColor } from '../../hooks/useColor'
import { currencyId } from '../../utils/currencyId'
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
const BottomSection = styled.div`
  padding: 12px 16px;
  border-top: 1px solid ${({theme}) => theme.bg7};
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  z-index: 1;
  width: 100%;
  position: relative;
`


const Multiplier = styled.span`
    font-weight: 500;
    text-align: center;
    border-radius: 5px;
    margin-left: 10px;
    padding: 0px 5px;
    font-size: 16px;
    color: ${({theme}) => theme.green2};
    border: 1px solid ${({theme}) => theme.green2};
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

export default function PoolCard({ stakingInfo, index, hide, totalDeposit }: { stakingInfo: StakingInfo, index: number, hide?: Boolean, totalDeposit: object }) {
  const token0 = stakingInfo.tokens[0]
  const token1 = stakingInfo.tokens[1]

  const currency0 = unwrappedToken(token0)
  const currency1 = unwrappedToken(token1)
  const { t } = useTranslation()

  const isStaking = Boolean(stakingInfo.stakedAmount.greaterThan('0'))

  // get the color of the token
  // const token = currency0 === ETHER ? token1 : token0
  const WETH = currency0 === ETHER ? token0 : token1
  const theme = useContext(ThemeContext);

  const totalSupplyOfStakingToken = useTotalSupply(stakingInfo.stakedAmount.token)
  const [, stakingTokenPair] = usePair(...stakingInfo.tokens)

  const baseAllocPoint = 200;
  const multiplier = stakingInfo.allocPoint && Number(stakingInfo.allocPoint?.toString()) / baseAllocPoint;
  // console.log('multiplier', currency0.symbol, currency1.symbol, multiplier?.toString(), stakingInfo.allocPoint?.toString());


  // let returnOverMonth: Percent = new Percent('0')
  let valueOfTotalStakedAmountInWETH: TokenAmount | undefined
  let valueOfTotalStakedAmountInWLSP: TokenAmount | undefined

  let valueOfSelfStakedAmountInWETH: TokenAmount | undefined
  let valueOfSelfStakedAmountInWLSP: TokenAmount | undefined

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

  if (
    totalSupplyOfStakingToken &&
    stakingTokenPair &&
    stakingInfo &&
    WETH &&
    Number(totalSupplyOfStakingToken.toExact()) > 0
  ) {
    // take the total amount of LP tokens staked, multiply by WAN value of all LP tokens, divide by all LP tokens
    valueOfSelfStakedAmountInWETH = new TokenAmount(
      WETH,
      JSBI.divide(
        JSBI.multiply(
          JSBI.multiply(stakingInfo.stakedAmount.raw, stakingTokenPair.reserveOf(WETH).raw),
          JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the WETH they entitle owner to
        ),
        totalSupplyOfStakingToken.raw
      )
    )
    valueOfSelfStakedAmountInWLSP = new TokenAmount(WETH, JSBI.multiply(stakingInfo.stakedAmount.raw, JSBI.BigInt(1)))
  }

  // get the USD value of staked WETH
  const USDPrice = useUSDCPrice(WETH)
  const valueOfTotalStakedAmountInUSDC =
    valueOfTotalStakedAmountInWETH && USDPrice?.quote(valueOfTotalStakedAmountInWETH)
  const valueOfSelfStakedAmountInUSDC = valueOfSelfStakedAmountInWETH && USDPrice?.quote(valueOfSelfStakedAmountInWETH)

  const { chainId } = useActiveWeb3React()
  const uni = chainId ? WASP[chainId] : undefined
  const uniPrice = useUSDCPrice(uni)
  const weekReward = stakingInfo.totalRewardRate?.multiply(`${60 * 60 * 24 * 7}`)?.toFixed(0)
  const apy =
    valueOfTotalStakedAmountInUSDC && weekReward && uniPrice
      ? Number(
          (
            ((Number(weekReward) * Number(uniPrice?.toFixed(8))) /
              Number(valueOfTotalStakedAmountInUSDC.toFixed(0)) /
              7) *
            365 *
            100
          ).toFixed(2)
        )
      : '--'

  if (valueOfTotalStakedAmountInUSDC && stakingTokenPair) {
    if (!window.tvlItems) {
      window.tvlItems = {}
    }
    window.tvlItems[stakingTokenPair!.liquidityToken.address] = valueOfTotalStakedAmountInUSDC.toFixed(0)
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    //@ts-ignore
    totalDeposit[index] = valueOfSelfStakedAmountInUSDC ? valueOfSelfStakedAmountInUSDC.toFixed(0) : '0'
  }, [index, totalDeposit, valueOfSelfStakedAmountInUSDC])

  const isActive = Boolean(stakingInfo.totalRewardRate.greaterThan('0'));
  const notStart = stakingInfo.periodStart && (new Date(stakingInfo.periodStart)).getTime() > Date.now() / 1000;

  return (
    <React.Fragment>
      {
        !hide &&   <div>
        <Wrapper showBackground={isStaking}>
  
        <TopSection>
          <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={24} />
          <TYPE.white fontWeight={600} fontSize={18} style={{ marginLeft: '8px' }}>
            {currency0.symbol} / {currency1.symbol} 
            {
              !isActive && !notStart && <SpanFinished>{t("Inactive")}</SpanFinished>
            }
            {
              notStart && <NotStarted>{t("Coming Soon")}</NotStarted>
            }
            <Multiplier>
            {
              multiplier+'x'
            }
            </Multiplier>
          </TYPE.white>
  
          <StyledInternalLink to={`/farm/${currencyId(currency0)}/${currencyId(currency1)}`} style={{ width: '100%',color:'transparent' }}>
            <ButtonGreen padding="8px" borderRadius="8px">
              {isStaking ? t('Manage') : t('Deposit')}
            </ButtonGreen>
          </StyledInternalLink>
        </TopSection>
  
        <StatContainer>
          <RowBetween>
            <TYPE.white><DepositTitle>{t('totalDeposited')}</DepositTitle></TYPE.white>
            <TYPE.yellow3>
              {valueOfTotalStakedAmountInUSDC
                ? `$${valueOfTotalStakedAmountInUSDC.toFixed(0, { groupSeparator: ',' })} 🔥 APR: ${apy}%`
                //  +
                //   ' / ' +
                //   `${valueOfTotalStakedAmountInWLSP?.toSignificant(6, { groupSeparator: ',' }) ?? '-'} WSLP`
                : `${valueOfTotalStakedAmountInWLSP?.toSignificant(6, { groupSeparator: ',' }) ?? '-'} WSLP`}
            </TYPE.yellow3>
          </RowBetween>
          <PoolRate>
          <RowBetween>
            
            <TYPE.white> {t("Pool rate")} </TYPE.white>
            <TYPE.green>{`${stakingInfo.totalRewardRate
              ?.multiply(`${60 * 60 * 24 * 7}`)
              ?.toFixed(0, { groupSeparator: ',' })} WASP / week`}</TYPE.green>
              
          </RowBetween>
          </PoolRate>
        </StatContainer>
          {isStaking && (
          <>
            <BottomSection >
              <TYPE.black fontWeight={500} color={'#909699'} marginBottom={''}>
                <span style={{ fontSize: '14px' }}>My Deposit ≈ </span>
                <span style={{ fontWeight: 'bold', fontSize: '18px', color: theme.green2 }}>
                  {valueOfSelfStakedAmountInUSDC
                    ? `$${valueOfSelfStakedAmountInUSDC.toSignificant(6, { groupSeparator: ',' })}`
                    : `${valueOfSelfStakedAmountInWLSP?.toSignificant(6, { groupSeparator: ',' }) ?? '-'} WSLP`}
                </span>
              </TYPE.black>
              <TYPE.black style={{ textAlign: 'right' }} color={'#909699'}>
                <span style={{ fontSize: '14px' }}>My Rate: </span>
                <span style={{ fontWeight: 'bold', fontSize: '18px', color: theme.green2 }}>
                  {`${stakingInfo.rewardRate
              ?.multiply(`${60 * 60 * 24 * 7}`)
              ?.toFixed(0, { groupSeparator: ',' })}`}
                </span>
                <span style={{ fontSize: '14px' }}> WASP / week</span>
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

const NotStarted = styled.span`
  background: #2c74c1;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 10px;
  margin-left: 10px;
`;