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

  const DataRow = styled(RowBetween)`
    ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `};
  `

  const stakingRewardsExist = Boolean(typeof chainId === 'number' && (stakingRewardsInfo[chainId]?.length ?? 0) > 0)

  const [tvlValue, setTvlValue] = useState('')
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
      setTvlValue('TVL: $' + amount.toFixed(0, {groupSeparator: ','}) + ' ' + (hive ? '(In Farming and Hive)' : '(In Farming)'));
    }, 2000)

    return () => {
      clearInterval(timer)
    }
  }, []);

  return (
    <PageWrapper gap="lg" justify="center">
      <TopSection gap="md">
        <DataCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>Wanswap liquidity mining</TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>
                  Deposit your Liquidity Provider tokens to receive WASP, the Wanswap protocol governance token.
                </TYPE.white>
              </RowBetween>{' '}
              <ExternalLink
                style={{ color: 'white', textDecoration: 'underline' }}
                href="https://medium.com/wanswap/introducing-wanswap-the-wanchain-based-cross-chain-decentralized-exchange-with-automated-market-5e5f5956c223"
                target="_blank"
              >
                <TYPE.white fontSize={14}>Read more about WASP</TYPE.white>
              </ExternalLink>
              <RowBetween>
                <TYPE.white fontWeight={600}>{tvlValue}</TYPE.white>
              </RowBetween>
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </DataCard>
      </TopSection>

      <AutoColumn gap="lg" style={{ width: '100%', maxWidth: '720px' }}>
        <DataRow style={{ alignItems: 'baseline' }}>
          <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>Participating pools</TYPE.mediumHeader>
          <Countdown exactEnd={stakingInfos?.[0]?.periodFinish} exactStart={stakingInfos?.[0]?.periodStart} />
        </DataRow>

        <PoolSection>
          {stakingRewardsExist && stakingInfos?.length === 0 ? (
            <Loader style={{ margin: 'auto' }} />
          ) : !stakingRewardsExist ? (
            'No active rewards'
          ) : (
            stakingInfos?.map(stakingInfo => {
              // need to sort by added liquidity here
              return <PoolCard key={stakingInfo.stakingRewardAddress} stakingInfo={stakingInfo} />
            })
          )}
        </PoolSection>
      </AutoColumn>
    </PageWrapper>
  )
}
