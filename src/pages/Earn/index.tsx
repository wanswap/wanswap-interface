import React, { useEffect, useState } from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { useAllStakingRewardsInfo, useStakingInfo } from '../../state/stake/hooks'
import { TYPE, ExternalLink } from '../../theme'
import PoolCard from '../../components/earn/PoolCard'
import { RowBetween } from '../../components/Row'
import { CardSection, DataCard, CardNoise, CardBGImage } from '../../components/earn/styled'
import { Countdown } from './Countdown'
import Loader from '../../components/Loader'
import { useActiveWeb3React } from '../../hooks'
import { Token, TokenAmount } from '@wanswap/sdk'
import Toggle from '../../components/Toggle'
import { loadFromLocalStorage, saveToLocalStorage } from '../../utils/tools';
import { useTranslation } from 'react-i18next'

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
declare global {
  interface Window {
    tvlItems: any;
  }
}

export default function Earn() {
  const { chainId } = useActiveWeb3React()
  const stakingInfos = useStakingInfo()
  const stakingRewardsInfo = useAllStakingRewardsInfo()

  const showStaked = loadFromLocalStorage('showStaked');
  const showActive = loadFromLocalStorage('showActive');

  const { t } = useTranslation();


  const [onlyStakedMode, toggleOnlyStakedMode] = useState(showStaked === "true")
  const [onlyActivedMode, toggleOnlyActivedMode] = useState(showActive === "true")

  const DataRow = styled(RowBetween)`
    ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `};
  `

  const stakingRewardsExist = Boolean(typeof chainId === 'number' && (stakingRewardsInfo[chainId]?.length ?? 0) > 0)

  const [tvlValue, setTvlValue] = useState(t('TVL: loading...'))
  useEffect(()=>{
    let timer = setInterval(()=>{
      let tvl = 0;
      let hive;
      for (const key in window.tvlItems) {
        const element = window.tvlItems[key];
        tvl += Number(element)
        if (key === 'hive') {
          hive = true;
        }
      }

      if (tvl === 0) {
        return;
      }

      const amount = new TokenAmount(new Token(1, '0x4Cf0A877E906DEaD748A41aE7DA8c220E4247D9e', 0), tvl.toString())
      // 
      setTvlValue('TVL: $' + amount.toFixed(0, {groupSeparator: ','}) + ' ' + (hive ? t('(In Farming and Hive)') : t('(In Farming)')));
    }, 2000)

    return () => {
      clearInterval(timer)
    }
  }, [t]);

  return (
    <PageWrapper gap="lg" justify="center">
      <TopSection gap="md">
        <DataCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>{t("Wanswap liquidity mining")}</TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>
                  {t("Deposit your Liquidity Provider tokens to receive WASP, the Wanswap protocol governance token.")}
                </TYPE.white>
              </RowBetween>{' '}
              <ExternalLink
                style={{ color: 'white', textDecoration: 'underline' }}
                href="https://medium.com/wanswap/introducing-wanswap-the-wanchain-based-cross-chain-decentralized-exchange-with-automated-market-5e5f5956c223"
                target="_blank"
              >
                <TYPE.white fontSize={14}>{t("Read more about WASP")}</TYPE.white>
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
                <TYPE.white fontWeight={600} style={{margin:'0 auto'}}>{tvlValue}</TYPE.white>
              </RowBetween>
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </DataCard>

      </TopSection>

      <AutoColumn gap="lg" style={{ width: '100%', maxWidth: '720px' }}>
        <DataRow style={{ alignItems: 'baseline' }}>
          <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>{t("Participating pools")}</TYPE.mediumHeader>
          <Countdown exactEnd={stakingInfos?.[0]?.periodFinish} exactStart={stakingInfos?.[0]?.periodStart} />
        </DataRow>

        <DataRow style={{flexDirection:'row'}}>
        <div style={{display:'flex',flexDirection:'row',flexWrap:'wrap'}}>
              <TYPE.subHeader style={{ marginTop: '0.5rem',marginRight: 5,paddingBottom:5}}>{t("Show Only Staked")}</TYPE.subHeader>
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
            stakingInfos?.map(stakingInfo => {
              const isStaking = Boolean(stakingInfo.stakedAmount.greaterThan('0'))
              const isActive = Boolean(stakingInfo.totalRewardRate.greaterThan('0'));

              let hide = false;
              if (onlyStakedMode && !isStaking) {
                hide = true;
              }

              if (onlyActivedMode && !isActive) {
                hide = true;
              }
              
              // need to sort by added liquidity here
              return <PoolCard key={stakingInfo.stakingRewardAddress} stakingInfo={stakingInfo} hide={hide} />
            })
          )}
        </PoolSection>
      </AutoColumn>
    </PageWrapper>
  )
}
