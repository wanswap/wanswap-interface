import React, {  useState } from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { useAllStakingRewardsInfo, useStakingInfo } from '../../state/hive/hooks'
import { TYPE, ExternalLink } from '../../theme'
import HiveCard from '../../components/earnHive/HiveCard'
import { RowBetween } from '../../components/Row'
import { CardSection, DataCard, CardNoise, CardBGImage } from '../../components/earn/styled'
// import { Countdown } from './Countdown'
import Loader from '../../components/Loader'
import { useActiveWeb3React } from '../../hooks'
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

export default function Earn() {
  const { chainId } = useActiveWeb3React()
  const stakingInfos = useStakingInfo()
  const stakingRewardsInfo = useAllStakingRewardsInfo()

  const showStaked = loadFromLocalStorage('showStakedHive');
  const showActive = loadFromLocalStorage('showActiveHive');

  const [onlystakedMode, toggleonlystakedMode] = useState(showStaked === 'true')
  const [onlyactivedMode, toggleonlyactivedMode] = useState(showActive === 'true')

  const { t } = useTranslation()

  const DataRow = styled(RowBetween)`
    ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `};
  `

  const stakingRewardsExist = Boolean(typeof chainId === 'number' && (stakingRewardsInfo[chainId]?.length ?? 0) > 0)

  return (
    <PageWrapper gap="lg" justify="center">
      <TopSection gap="md">
        <DataCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>{t("Hive your WASP")}</TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>
                  {t("Hive your WASP to get honey tokens.")}
                </TYPE.white>
              </RowBetween>{' '}
              <ExternalLink
                style={{ color: 'white', textDecoration: 'underline' }}
                href="https://medium.com/wanswap/introducing-wanswap-the-wanchain-based-cross-chain-decentralized-exchange-with-automated-market-5e5f5956c223"
                target="_blank"
              >
                <TYPE.white fontSize={14}>{t("Read more about WASP Hive")}</TYPE.white>
              </ExternalLink>
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </DataCard>
      </TopSection>

      <AutoColumn gap="lg" style={{ width: '100%', maxWidth: '720px' }}>
        <DataRow style={{ alignItems: 'baseline' }}>
          <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>{t("Participating pools")}</TYPE.mediumHeader>
          {/* <Countdown exactEnd={stakingInfos?.[0]?.periodFinish} exactStart={stakingInfos?.[0]?.periodStart} /> */}
        </DataRow>

        <DataRow style={{flexDirection:'row'}}>
        <div style={{display:'flex',flexDirection:'row',flexWrap:'wrap'}}>
              <TYPE.subHeader style={{ marginTop: '0.5rem',marginRight: 5,paddingBottom:5}}>{t("Show Only Staked")}</TYPE.subHeader>
              <Toggle
                id="toggle-only-staked-button"
                isActive={onlystakedMode}
                toggle={
                  onlystakedMode
                    ? () => {
                      toggleonlystakedMode(false)
                      saveToLocalStorage('showStakedHive', 'false');
                      }
                    : () => {
                      toggleonlystakedMode(true)
                      saveToLocalStorage('showStakedHive', 'true');
                    }
                }
              />
          </div>

          <div style={{display:'flex',flexDirection:'row',flexWrap:'wrap',justifyContent:'flex-end'}}>
              <TYPE.subHeader style={{ marginTop: '0.5rem',marginRight:5,paddingBottom:5}}>{t("Show Only Active")}</TYPE.subHeader>
              <Toggle
                
                id="toggle-only-actived-button"
                isActive={onlyactivedMode}
                toggle={
                  onlyactivedMode
                    ? () => {
                      toggleonlyactivedMode(false)
                      saveToLocalStorage('showActiveHive', 'false');
                    }
                    : () => {
                      toggleonlyactivedMode(true)
                      saveToLocalStorage('showActiveHive', 'true');
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
            stakingInfos?.map((stakingInfo, i) => {
              const isStaking = Boolean(stakingInfo.stakedAmount.greaterThan('0'))
              const isActive = Boolean(stakingInfo.totalRewardRate.greaterThan('0'));

              let hide = false;

              if (onlystakedMode && !isStaking) {
                hide = true;
              }

              if (onlyactivedMode && !isActive) {
                hide = true;
              }
              return <HiveCard key={i} stakingInfo={stakingInfo} i={i} hide={hide} />
            })
          ).reverse()}
        </PoolSection>
      </AutoColumn>
    </PageWrapper>
  )
}
