import React, { useEffect, useMemo, useState } from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { useAllStakingRewardsInfo, useStakingInfo } from '../../state/stake/hooks'
import { TYPE, ExternalLink } from '../../theme'
import PoolCard from '../../components/earn/PoolCard'
import { RowBetween } from '../../components/Row'
import { CardSection, DataCard, CardNoise, CardBGImage, Break } from '../../components/earn/styled'
import Numeral from 'numeral'
import Loader from '../../components/Loader'
import { useActiveWeb3React } from '../../hooks'
import { Token, TokenAmount } from '@wanswap/sdk'
import Toggle from '../../components/Toggle'
import { ButtonHarvestAll } from '../../components/Button'
import { loadFromLocalStorage, saveToLocalStorage } from '../../utils/tools'
import { useTranslation } from 'react-i18next'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import ClaimAllRewardModal from '../../components/earn/ClaimAllRewardModal'
import searchImg from '../../assets/images/search.png'

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const TopSection = styled(AutoColumn)`
  max-width: 720px;
  width: 100%;
`

const PoolSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  column-gap: 10px;
  row-gap: 15px;
  width: 100%;
  justify-self: center;
`
const DataRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: column;
`};
`

declare global {
  interface Window {
    tvlItems: any;
  }
}

const totalDeposit = {}

export default function Earn() {
  const [search, setSearch] = useState('')
  const { chainId, account } = useActiveWeb3React()
  const stakingInfos = useStakingInfo()
  const stakingRewardsInfo = useAllStakingRewardsInfo()

  const showStaked = loadFromLocalStorage('showStaked')
  const showActive = loadFromLocalStorage('showActive')
  const [showClaimRewardModal, setShowClaimRewardModal] = useState(false)
  const { t } = useTranslation()
  const [onlyStakedMode, toggleOnlyStakedMode] = useState(showStaked === 'true')
  const [onlyActivedMode, toggleOnlyActivedMode] = useState(showActive === 'true')

  const stakingRewardsExist = Boolean(typeof chainId === 'number' && (stakingRewardsInfo[chainId]?.length ?? 0) > 0)

  const [tvlValue, setTvlValue] = useState(t('TVL: loading...'))

  useEffect(() => {
    const timer = setInterval(() => {
      let tvl = 0
      let hive
      for (const key in window.tvlItems) {
        const element = window.tvlItems[key];
        tvl += Number(element)
        if (key === 'hive') {
          hive = true
        }
      }

      if (tvl === 0) {
        return
      }

      const amount = new TokenAmount(new Token(1, '0x4Cf0A877E906DEaD748A41aE7DA8c220E4247D9e', 0), tvl.toString())

      setTvlValue(
        'TVL: $' +
          amount.toFixed(0, { groupSeparator: ',' }) +
          ' ' +
          (hive ? t('(In Farming and Hive)') : t('(In Farming)'))
      )
    }, 5000)

    return () => {
      clearInterval(timer)
    }
  }, [t])

  const totalRate = useMemo(() => {
    const data = stakingInfos.map(i => i.rewardRate?.multiply(`${60 * 60 * 24 * 7}`)?.toFixed(0))
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return data.reduce((prev, i) => Number(i) + Number(prev), '0')
  }, [stakingInfos])

  return (
    <PageWrapper gap="lg" justify="center">
      <TopSection gap="md">
        <DataCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>{t('Wanswap liquidity mining')}</TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>
                  {t('Deposit your Liquidity Provider tokens to receive WASP, the Wanswap protocol governance token.')}
                </TYPE.white>
              </RowBetween>{' '}
              <ExternalLink
                style={{ color: 'white', textDecoration: 'underline' }}
                href="https://medium.com/wanswap/introducing-wanswap-the-wanchain-based-cross-chain-decentralized-exchange-with-automated-market-5e5f5956c223"
                target="_blank"
              >
                <TYPE.white fontSize={14}>{t('Read more about WASP')}</TYPE.white>
              </ExternalLink>
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </DataCard>

        <DataCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>
                  {tvlValue}
                </TYPE.white>
                {account && (
                  <ButtonHarvestAll onClick={() => setShowClaimRewardModal(true)}>Harvest all</ButtonHarvestAll>
                )}
              </RowBetween>
              <Break />
              <RowBetween style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                <span>
                  My Deposit :{' '}
                  {Numeral(
                    Object.values(totalDeposit).reduce((prev, item) => Number(prev) + Number(item), '0')
                  ).format('$0,0')}
                </span>
                <span>My Rate : {Numeral(totalRate).format('0,0')} WASP / week</span>
              </RowBetween>
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </DataCard>

      </TopSection>

      <AutoColumn gap="lg" style={{ width: '100%', maxWidth: '720px' }}>
        <DataRow style={{ alignItems: 'baseline' }}>
          <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>{t('Participating pools')}</TYPE.mediumHeader>
          {/* <Countdown exactEnd={stakingInfos?.[0]?.periodFinish} exactStart={stakingInfos?.[0]?.periodStart} /> */}
          <InputCom value={search} placeholder={'Search e.g. WAN / WASP'} onChange={e => setSearch(e.target.value)} />
        </DataRow>

        <DataRow style={{ flexDirection: 'row' }}>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            <TYPE.subHeader style={{ marginTop: '0.5rem', marginRight: 5, paddingBottom: 5 }}>
              {t('Show Only Staked')}
            </TYPE.subHeader>
              <Toggle
                id="toggle-only-staked-button"
                isActive={onlyStakedMode}
                toggle={
                  onlyStakedMode
                    ? () => {
                      console.log('hello1');
                      toggleOnlyStakedMode(false)
                      saveToLocalStorage('showStaked', 'false');
                      }
                    : () => {
                      console.log('hello2');
                      toggleOnlyStakedMode(true)
                      saveToLocalStorage('showStaked', 'true');
                      }
                }
              />
          </div>

          <div style={{display:'flex',flexDirection:'row',flexWrap:'wrap',justifyContent:'flex-end'}}>
              <TYPE.subHeader style={{ marginTop: '0.5rem',marginRight:5,paddingBottom:5}}>{t("Show Only Active")}</TYPE.subHeader>
              <Toggle
                
                id="toggle-only-actived-button"
                isActive={onlyActivedMode}
                toggle={
                  onlyActivedMode
                    ? () => {
                      toggleOnlyActivedMode(false)
                      saveToLocalStorage('showActive', 'false');
                      }
                    : () => {
                      toggleOnlyActivedMode(true)
                      saveToLocalStorage('showActive', 'true');
                    }
                }
              />
              </div>
        </DataRow>

        <PoolSection>
          {stakingRewardsExist && stakingInfos?.length === 0 ? (
            <Loader style={{ margin: 'auto' }} />
          ) : !stakingRewardsExist ? (
            t('No active rewards')
          ) : (
            stakingInfos?.map((stakingInfo, index) => {
              const isStaking = Boolean(stakingInfo.stakedAmount.greaterThan('0'))
              const isActive = Boolean(stakingInfo.totalRewardRate.greaterThan('0'));

              let hide = false

              if (search !== '') {
                const currency0 = unwrappedToken(stakingInfo.tokens[0])
                const currency1 = unwrappedToken(stakingInfo.tokens[1])
                const condition = `${currency0?.symbol} / ${currency1?.symbol}`.toLowerCase()
                hide =
                  condition.search(search.toLowerCase()) === -1 ||
                  (onlyStakedMode && !isStaking) ||
                  (onlyActivedMode && !isActive)
              } else {
                if (onlyStakedMode && !isStaking) {
                  hide = true
                }

                if (onlyActivedMode && !isActive) {
                  hide = true
                }
              }
              // need to sort by added liquidity here
              return <PoolCard index={index} totalDeposit={totalDeposit} key={stakingInfo.stakingRewardAddress} stakingInfo={stakingInfo} hide={hide} />
            })
          )}
        </PoolSection>
      </AutoColumn>
      {stakingInfos && stakingInfos.length !== 0 && (
        <ClaimAllRewardModal
          isOpen={showClaimRewardModal}
          onDismiss={() => setShowClaimRewardModal(false)}
          stakingInfos={stakingInfos}
        />
      )}
    </PageWrapper>
  )
}

const InputCom = styled.input`
  width: 208px;
  height: 28px;
  outline: none;
  padding: 0 10px;
  color: #fff;
  border-radius: 8px;
  background: #1c304a;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-image: url(${searchImg});
  background-repeat: no-repeat;
  background-size: 1rem;
  background-position: 96% center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 8.125rem;
    font-size: 0.75rem;
    padding-right: 2rem;
    background-image: url(${searchImg});
    background-repeat: no-repeat;
    background-size: 1rem;
    background-position: 96% center;
  `};
`
