import { ChainId, TokenAmount } from '@wanswap/sdk'
import React, { useMemo } from 'react'
import { X } from 'react-feather'
import styled from 'styled-components'
import tokenLogo from '../../assets/svg/Logomark_WASP_token.svg'
import { WASP } from '../../constants'
import { useTotalSupply, useTotalBurned } from '../../data/TotalSupply'
import { useActiveWeb3React } from '../../hooks'
// import { useMerkleDistributorContract } from '../../hooks/useContract'
import useCurrentBlockTimestamp from '../../hooks/useCurrentBlockTimestamp'
import { useTotalUniEarned } from '../../state/stake/hooks'
import { useAggregateUniBalance, useTokenBalance } from '../../state/wallet/hooks'
import { ExternalLink, TYPE, UniTokenAnimated } from '../../theme'
// import { computeUniCirculation } from '../../utils/computeUniCirculation'
import useUSDCPrice from '../../utils/useUSDCPrice'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import { Break, CardBGImage, CardNoise, CardSection, DataCard } from '../earn/styled'
import { useTranslation } from 'react-i18next'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
`

const ModalUpper = styled(DataCard)`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background: radial-gradient(90% 90% at 0% 0%,#41beec 0%,#123471 100%);
  padding: 0.5rem;
`

const StyledClose = styled(X)`
  position: absolute;
  right: 16px;
  top: 16px;

  :hover {
    cursor: pointer;
  }
`

/**
 * Content for balance stats modal
 */
export default function UniBalanceContent({ setShowUniBalanceModal }: { setShowUniBalanceModal: any }) {
  const { account, chainId } = useActiveWeb3React()
  const uni = chainId ? WASP[chainId] : undefined

  const { t } = useTranslation()

  const total = useAggregateUniBalance()
  const uniBalance: TokenAmount | undefined = useTokenBalance(account ?? undefined, uni)
  const uniToClaim: TokenAmount | undefined = useTotalUniEarned()

  const totalSupply: TokenAmount | undefined = useTotalSupply(uni)
  const totalBurned: TokenAmount | undefined = useTotalBurned(uni)
  const uniPrice = useUSDCPrice(uni)
  const blockTimestamp = useCurrentBlockTimestamp()
  // const unclaimedUni = useTokenBalance(useMerkleDistributorContract()?.address, uni)
  const circulation: TokenAmount | undefined = useMemo(
    () =>
      blockTimestamp && uni && chainId === ChainId.MAINNET
        ? totalSupply?.subtract(totalBurned ? totalBurned : new TokenAmount(uni!, '0'))
        : totalSupply?.subtract(totalBurned ? totalBurned : new TokenAmount(uni!, '0')),
    [blockTimestamp, chainId, totalSupply, uni, totalBurned]
  )

  const burned: TokenAmount | undefined = useMemo(
    () =>
      blockTimestamp && uni && chainId === ChainId.MAINNET
        ? totalBurned
        : totalBurned,
    [blockTimestamp, chainId, totalBurned, uni]
  )

  return (
    <ContentWrapper gap="lg">
      <ModalUpper>
        <CardBGImage />
        <CardNoise />
        <CardSection gap="md">
          <RowBetween>
            <TYPE.white color="white">{t('breakdown')}</TYPE.white>
            <StyledClose stroke="white" onClick={() => setShowUniBalanceModal(false)} />
          </RowBetween>
        </CardSection>
        <Break />
        {account && (
          <>
            <CardSection gap="sm">
              <AutoColumn gap="md" justify="center">
                <UniTokenAnimated width="120px" src={tokenLogo} />{' '}
                <TYPE.white fontSize={48} fontWeight={600} color="white">
                  {total?.toFixed(2, { groupSeparator: ',' })}
                </TYPE.white>
              </AutoColumn>
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.white color="white">{t('balance2')}</TYPE.white>
                  <TYPE.white color="white">{uniBalance?.toFixed(2, { groupSeparator: ',' })}</TYPE.white>
                </RowBetween>
                <RowBetween>
                  <TYPE.white color="white">{t('unclaimed')}:</TYPE.white>
                  <TYPE.white color="white">
                    {uniToClaim?.toFixed(2, { groupSeparator: ',' })}{' '}
                  </TYPE.white>
                </RowBetween>
              </AutoColumn>
            </CardSection>
            <Break />
          </>
        )}
        <CardSection gap="sm">
          <AutoColumn gap="md">
            <RowBetween>
              <TYPE.white color="white">{t('waspPrice')}</TYPE.white>
              <TYPE.white color="white">${uniPrice?.toFixed(4) ?? '-'}</TYPE.white>
            </RowBetween>
            <RowBetween>
              <TYPE.white color="white">{t('waspInCirculation')}</TYPE.white>
              <TYPE.white color="white">{circulation?.toFixed(0, { groupSeparator: ',' })}</TYPE.white>
            </RowBetween>
            <RowBetween>
              <TYPE.white color="white">{t('waspBurned')}</TYPE.white>
              <TYPE.white color="white">{burned?.toFixed(0, { groupSeparator: ',' })}</TYPE.white>
            </RowBetween>
            {/* <RowBetween>
              <TYPE.white color="white">{t('totalSupply')}</TYPE.white>
              <TYPE.white color="white">{totalSupply?.toFixed(0, { groupSeparator: ',' })}</TYPE.white>
            </RowBetween> */}
            <RowBetween>
              <TYPE.white color="white">WASP Token Address(WRC20):</TYPE.white>
              <TYPE.white color="white"><a href="https://www.wanscan.org/token/0x8b9f9f4aa70b1b0d586be8adfb19c1ac38e05e9a">0x8b9f...5e9a</a></TYPE.white>
            </RowBetween>
            <RowBetween>
              <TYPE.white color="white">WASP Token Address(ERC20):</TYPE.white>
              <TYPE.white color="white"><a href="https://etherscan.io/token/0xef5c6a88710a3c857105058f947d249bc490909d">0xef5c...909d</a></TYPE.white>
            </RowBetween>
            {uni && uni.chainId === ChainId.MAINNET ? (
              <ExternalLink href={`https://info.wanswap.finance/token/0x8b9f9f4aa70b1b0d586be8adfb19c1ac38e05e9a`}>View WASP Statistics</ExternalLink>
            ) : null}
          </AutoColumn>
        </CardSection>
      </ModalUpper>
    </ContentWrapper>
  )
}
