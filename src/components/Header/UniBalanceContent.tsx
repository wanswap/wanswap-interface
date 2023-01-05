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
import { Break, CardSection, DataCard } from '../earn/styled'
import { useTranslation } from 'react-i18next'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
`

const ModalUpper = styled(DataCard)`
  background: ${({theme}) => theme.bg6};
  padding: 0.5rem 0;
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
        <CardSection gap="md">
          <RowBetween>
            <TYPE.white color="white" fontSize={'24px'}>{t('breakdown')}</TYPE.white>
            <StyledClose stroke="white" onClick={() => setShowUniBalanceModal(false)} />
          </RowBetween>
        </CardSection>
        <Break />
        {account && (
          <>
            <CardSection gap="sm">
              <AutoColumn gap="md" justify="center">
                <UniTokenAnimated width="126px" src={tokenLogo} />{' '}
                <TYPE.yellow3 fontSize={48} fontWeight={600}>
                  {total?.toFixed(2, { groupSeparator: ',' })}
                </TYPE.yellow3>
              </AutoColumn>
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.white1>{t('balance2')}</TYPE.white1>
                  <TYPE.white1>{uniBalance?.toFixed(2, { groupSeparator: ',' })}</TYPE.white1>
                </RowBetween>
                <RowBetween>
                  <TYPE.white1>{t('unclaimed')}:</TYPE.white1>
                  <TYPE.white1>
                    {uniToClaim?.toFixed(2, { groupSeparator: ',' })}{' '}
                  </TYPE.white1>
                </RowBetween>
              </AutoColumn>
            </CardSection>
            <Break />
          </>
        )}
        <CardSection gap="sm">
          <AutoColumn gap="md">
            <RowBetween>
              <TYPE.white1>{t('waspPrice')}</TYPE.white1>
              <TYPE.white1>${uniPrice?.toFixed(4) ?? '-'}</TYPE.white1>
            </RowBetween>
            <RowBetween>
              <TYPE.white1>{t('waspInCirculation')}</TYPE.white1>
              <TYPE.white1>{circulation?.toFixed(0, { groupSeparator: ',' })}</TYPE.white1>
            </RowBetween>
            <RowBetween>
              <TYPE.white1>{t('waspBurned')}</TYPE.white1>
              <TYPE.white1>{burned?.toFixed(0, { groupSeparator: ',' })}</TYPE.white1>
            </RowBetween>
            {/* <RowBetween>
              <TYPE.white1>{t('totalSupply')}</TYPE.white1>
              <TYPE.white1>{totalSupply?.toFixed(0, { groupSeparator: ',' })}</TYPE.white1>
            </RowBetween> */}
            <RowBetween>
              <TYPE.white1>WASP Token Address(WRC20):</TYPE.white1>
              <TYPE.yellow3><a href="https://www.wanscan.org/token/0x924fd608bf30db9b099927492fda5997d7cfcb02">0x924f...cb02</a></TYPE.yellow3>
            </RowBetween>
            <RowBetween>
              <TYPE.white1>WASP Token Address(ERC20 on Moonriver):</TYPE.white1>
              <TYPE.yellow3><a href="https://moonriver.moonscan.io/token/0xffef2639b2ee39f9c284d0107e567dd2f7b20613">0xffef...0613</a></TYPE.yellow3>
            </RowBetween>
            {uni && uni.chainId === ChainId.MAINNET ? (
              <ExternalLink href={`https://info.wanswap.finance/token/0x924fd608bf30db9b099927492fda5997d7cfcb02`}>View WASP Statistics</ExternalLink>
            ) : null}
          </AutoColumn>
        </CardSection>
      </ModalUpper>
    </ContentWrapper>
  )
}
