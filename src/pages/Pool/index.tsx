import React, { useContext, useMemo } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Pair } from '@wanswap/sdk'
import { Link } from 'react-router-dom'
import { SwapPoolTabs } from '../../components/NavigationTabs'

import FullPositionCard from '../../components/PositionCard'
import { useUserHasLiquidityInAllTokens } from '../../data/V1'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { StyledInternalLink, ExternalLink, TYPE, HideSmall } from '../../theme'
import { Text } from 'rebass'
import Card from '../../components/Card'
import { RowBetween, RowFixed } from '../../components/Row'
import { ButtonPrimary, ButtonSecondary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'
import { usePairs } from '../../data/Reserves'
import { useTokenPairsWithLiquidityTokens, useTrackedTokenPairs } from '../../state/user/hooks'
import { Dots } from '../../components/swap/styleds'
import { CardSection, DataCard, CardNoise, CardBGImage } from '../../components/earn/styled'
import { useTranslation } from 'react-i18next'

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const VoteCard = styled(DataCard)`
  background: radial-gradient(100% 90% at 20% 0%,#41beec 0%,#123471 100%)
  overflow: hidden;
`

const TitleRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    grid-gap: 12px;
    width: 100%;
    flex-direction: column-reverse;
  `};
`

const ButtonRow = styled(RowFixed)`
  grid-gap: 8px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    justify-content: space-between;
  `};
`

const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  width: fit-content;
  border-color: ${({ theme }) => theme.primary6};
  background-color: ${({ theme }) => theme.primary6};
  color: #fff;
  &:hover {
    border-color: ${({ theme }) => theme.primary6};
    background-color: ${({ theme }) => theme.primary6};
    color: #fff;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    border-radius: 100px;
    width: 48%;
    border-color: ${({ theme }) => theme.yellow3};
    background-color: ${({ theme }) => theme.yellow3};
    color: #333333;
  `};
`

const ResponsiveButtonSecondary = styled(ButtonSecondary)`
  width: fit-content;
  border-color: ${({ theme }) => theme.primary6};
  color: ${({ theme }) => theme.primary6};
  &:hover {
    border-color: ${({ theme }) => theme.primary6};
    color: ${({ theme }) => theme.primary6};
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
    border-radius: 100px;
    border-color: ${({ theme }) => theme.yellow3};
    color: ${({ theme }) => theme.yellow3};
  `};
`

const EmptyProposals = styled.div`
  border: 1px solid #171717;
  padding: 16px 12px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #171717;
`

export default function Pool() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  // const tokenPairsWithLiquidityTokens = useMemo(
  //   () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
  //   [trackedTokenPairs]
  // )

  const tokenPairsWithLiquidityTokens = useTokenPairsWithLiquidityTokens(trackedTokenPairs)

  // console.debug('tokenPairsWithLiquidityTokens', tokenPairsWithLiquidityTokens);
  const liquidityTokens = useMemo(() => {
    return tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken)
  }, [tokenPairsWithLiquidityTokens])
  // console.debug('liquidityTokens', liquidityTokens);
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )
  // console.debug('v2PairsBalances', v2PairsBalances['0x5DfEd2ACD09637C5A1a9a9a9afDBBD35Ff44390F']?.toFixed(10), fetchingV2PairBalances)
  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  // console.debug('liquidityTokensWithBalances', liquidityTokensWithBalances);

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  console.debug('v2Pairs', v2Pairs);
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some(V2Pair => !V2Pair)
  console.debug('v2IsLoading', v2IsLoading)
  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  // TODO: Remove
  const hasV1Liquidity = useUserHasLiquidityInAllTokens()

  return (
    <>
      <PageWrapper>
        <SwapPoolTabs active={'pool'} />

        <VoteCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.yellow3 fontWeight={600} fontSize={'20px'}>{t('liquidityProviderRewards')}</TYPE.yellow3>
              </RowBetween>
              <RowBetween>
                <TYPE.white color={theme.text6} fontSize={14}>
                  {t('liquidityHelper')}
                </TYPE.white>
              </RowBetween>
              <ExternalLink
                style={{ color: theme.text6, textDecoration: 'underline' }}
                target="_blank"
                href="https://docs.wanswap.finance/#/guides/liquidity"
              >
                <TYPE.white color={theme.text6} fontSize={14}>{t('readMoreAboutProvidingLiquidity')}</TYPE.white>
              </ExternalLink>
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </VoteCard>

        <AutoColumn gap="lg" justify="center">
          <AutoColumn gap="lg" style={{ width: '100%' }}>
            <TitleRow style={{ marginTop: '1rem' }} padding={'0'}>
              <HideSmall>
                <TYPE.mediumHeader style={{ marginTop: '0.5rem', justifySelf: 'flex-start' }}>
                  {t('yourLiquidity')}
                </TYPE.mediumHeader>
              </HideSmall>
              <ButtonRow>
                <ResponsiveButtonSecondary as={Link} padding="6px 8px" to="/create/WAN">
                  {t('createAPair')}
                </ResponsiveButtonSecondary>
                <ResponsiveButtonPrimary id="join-pool-button" as={Link} padding="6px 8px" to="/add/WAN">
                  <Text fontWeight={500} fontSize={16}>
                    {t('addLiquidity')}
                  </Text>
                </ResponsiveButtonPrimary>
              </ButtonRow>
            </TitleRow>

            {!account ? (
              <Card padding="40px">
                <TYPE.body color={theme.text3} textAlign="center">
                  {t('connectLiquidity')}
                </TYPE.body>
              </Card>
            ) : v2IsLoading ? (
              <EmptyProposals>
                <TYPE.body color={theme.text3} textAlign="center">
                  <Dots>{t('loading')}</Dots>
                </TYPE.body>
              </EmptyProposals>
            ) : allV2PairsWithLiquidity?.length > 0 ? (
              <>
                {/* <ButtonSecondary>
                  <RowBetween>
                    <ExternalLink href={'https://uniswap.info/account/' + account}>
                      Account analytics and accrued fees
                    </ExternalLink>
                    <span> ↗</span>
                  </RowBetween>
                </ButtonSecondary> */}

                {allV2PairsWithLiquidity.map(v2Pair => (
                  <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
                ))}
              </>
            ) : (
                    <EmptyProposals>
                      <TYPE.body color={theme.text6} textAlign="center">
                        {t('noLiquidityFound')}
                      </TYPE.body>
                    </EmptyProposals>
                  )}

            <AutoColumn justify={'center'} gap="md">
              <Text textAlign="center" fontSize={14} style={{ padding: '.5rem 0 .5rem 0' }}>
                {hasV1Liquidity ? 'Uniswap V1 liquidity found!' : t('dontSeePool')}{' '}
                <StyledInternalLink style={{color: theme.yellow3}} id="import-pool-link" to={hasV1Liquidity ? '/migrate/v1' : '/find'}>
                  {hasV1Liquidity ? 'Migrate now.' : t('importIt')}
                </StyledInternalLink>
              </Text>
            </AutoColumn>
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </>
  )
}
