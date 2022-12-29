import { ChainId, TokenAmount } from '@wanswap/sdk'
import React, { useEffect, useState } from 'react'
import { Text } from 'rebass'
import { NavLink } from 'react-router-dom'
import { darken } from 'polished'
import { useTranslation } from 'react-i18next'

import styled from 'styled-components'

import Logo from '../../assets/svg/logows_white.svg'

import { useActiveWeb3React } from '../../hooks'

import { useETHBalances, useAggregateUniBalance } from '../../state/wallet/hooks'
import { CardNoise } from '../earn/styled'
import { CountUp } from 'use-count-up'
import { TYPE, ExternalLink } from '../../theme'

import { YellowCard } from '../Card'
import Settings from '../Settings'
import Menu from '../Menu'

import Row, { RowFixed } from '../Row'
import Web3Status from '../Web3Status'
import ClaimModal from '../claim/ClaimModal'
import { useToggleSelfClaimModal, useShowClaimPopup } from '../../state/application/hooks'
import { useUserHasAvailableClaim } from '../../state/claim/hooks'
import { useUserHasSubmittedClaim } from '../../state/transactions/hooks'
import { Dots } from '../swap/styleds'
import Modal from '../Modal'
import UniBalanceContent from './UniBalanceContent'
import usePrevious from '../../hooks/usePrevious'
import useUSDCPrice from '../../utils/useUSDCPrice'
import { WASP } from '../../constants'

interface AddEthereumChainParameter {
  chainId: string; // A 0x-prefixed hexadecimal string
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: 18;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored.
}

const HeaderFrame = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  border-bottom: 0;
  padding: 1rem;
  z-index: 2;

  padding-left:80px;
  padding-right:80px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    padding: 0 1rem;
    width: calc(100%);
    position: relative;

  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        padding: 0.5rem 1rem;
  `}
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    width: 100%;
    max-width: 960px;
    padding: 1rem;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 99;
    height: 72px;
    border-radius: 10px 10px 0 0;
    background-color: ${({ theme }) => theme.bg1};
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToMedium`
   flex-direction: row-reverse;
    align-items: center;
  `};
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
`

const HeaderRow = styled(RowFixed)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
   width: 100%;
  `};
`

const HeaderRowMobile = styled(RowFixed)`
  display:none;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
   width: 100%;
   display:block;
  `};
`

const HeaderLinks = styled(Row)`
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem 1rem 1rem 1rem;
    justify-content: center;
`};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  border-radius:10px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }
  /* :hover {
    background-color: ${({ theme, active }) => (!active ? theme.bg2 : theme.bg4)};
  } */
`

const UNIAmount = styled(AccountElement)`
  color: #313131;
  padding: 4px 8px;
  height: 36px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.bg3};
  background: #FFE600;
`

const UNIWrapper = styled.span`
  width: fit-content;
  position: relative;
  cursor: pointer;
  margin: 0 8px;
  display: flex;
  :hover {
    opacity: 0.8;
  }

  :active {
    opacity: 0.9;
  }
`

const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    /*display: none;*/
  `};
`

const NetworkCard = styled(YellowCard)`
  border-radius: 10px;
  padding: 8px 12px;
  background: white;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
    
  `};
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
`

const UniIcon = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: scale(1.2);
  }
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 10px;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  margin: 0 8px;
  font-weight: 500;

  &.${activeClassName} {
    border-radius:10px;
    font-weight: 600;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

const StyledExternalLink = styled(ExternalLink).attrs({
  activeClassName
}) <{ isActive?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius:10px;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  margin: 0 8px;
  font-weight: 500;

  &.${activeClassName} {
    border-radius: 10px;
    font-weight: 600;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    text-decoration: none;
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      display: none;
`}
`

const StyledExternalLinkMobile = styled(ExternalLink).attrs({
  activeClassName
}) <{ isActive?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius:10px;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  margin: 0 12px;
  font-weight: 500;
  display:none;
  &.${activeClassName} {
    border-radius: 10px;
    font-weight: 600;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    text-decoration: none;
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      display: block;
`}
`

const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Testnet',
  [ChainId.GÖRLI]: 'Görli',
  [ChainId.KOVAN]: 'Kovan'
}

export default function Header() {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  const uniPrice = useUSDCPrice(chainId ? WASP[chainId] : undefined)

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']


  const toggleClaimModal = useToggleSelfClaimModal()

  const availableClaim: boolean = useUserHasAvailableClaim(account)

  const { claimTxn } = useUserHasSubmittedClaim(account ?? undefined)

  const aggregateBalance: TokenAmount | undefined = useAggregateUniBalance()

  const [showUniBalanceModal, setShowUniBalanceModal] = useState(false)
  const showClaimPopup = useShowClaimPopup()

  const countUpValue = aggregateBalance?.toFixed(0) ?? '0'
  const countUpValuePrevious = usePrevious(countUpValue) ?? '0'

  useEffect(() => {
    if (window.ethereum && Number(chainId) !== 1285) {
      const params: AddEthereumChainParameter = {
        chainId: '0x378', // A 0x-prefixed hexadecimal string
        chainName: 'Wanchain',
        nativeCurrency: {
          name: 'WAN',
          symbol: 'WAN', // 2-6 characters long
          decimals: 18
        },
        rpcUrls: ['https://gwan-ssl.wandevs.org:56891/'],
        blockExplorerUrls: ['https://www.wanscan.org']
      } as AddEthereumChainParameter

      (window.ethereum as any)
        .request({
          method: 'wallet_addEthereumChain',
          params: [params]
        })
        .then((result: any) => {
          console.debug(result)
        })
        .catch((error: any) => {
          console.debug(error)
        })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <HeaderFrame>
      <ClaimModal />
      <Modal isOpen={showUniBalanceModal} onDismiss={() => setShowUniBalanceModal(false)}>
        <UniBalanceContent setShowUniBalanceModal={setShowUniBalanceModal} />
      </Modal>
      <img id="logo-full" style={{ display: 'none' }} height={'60px'} src="./images/Logo_Whiteyellow.svg" alt="logo" />
      <HeaderRow>

        <Title href="." id="logo-wrapper">
          <UniIcon>
            <img id="logo-symbol" width={'36px'} src={Logo} alt="logo" />

          </UniIcon>
        </Title>
        <HeaderLinks>
          <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
            {t('swap')}
          </StyledNavLink>
          <StyledNavLink
            id={`pool-nav-link`}
            to={'/pool'}
            isActive={(match, { pathname }) =>
              Boolean(match) ||
              pathname.startsWith('/add') ||
              pathname.startsWith('/remove') ||
              pathname.startsWith('/create') ||
              pathname.startsWith('/find')
            }
          >
            {t('pool')}
          </StyledNavLink>
          <StyledNavLink id={`stake-nav-link`} to={'/farm'}>
            {t('miningPool')}
          </StyledNavLink>
          <StyledNavLink id={`stake-nav-link`} to={'/hive'}>
            {t('hive')}
          </StyledNavLink>
          <StyledExternalLink id={`stake-nav-link`} href={'https://info.wanswap.finance'}>
            {t('statistics')} 
            {/* <span style={{ fontSize: '11px' }}>↗</span> */}
          </StyledExternalLink>

          <StyledExternalLink id={`stake-nav-link`} href={'https://vote.wandevs.org/#/wanswap'}>
            {t('vote')} 
            {/* <span style={{ fontSize: '11px' }}>↗</span> */}
          </StyledExternalLink>
          <StyledExternalLink id={`stake-nav-link`} href={'https://bridge.wanchain.org/'}>
            {t('crossChain')} 
            {/* <span style={{ fontSize: '11px' }}>↗</span> */}
          </StyledExternalLink>
          <StyledExternalLink id={`stake-nav-link`} href={'https://fifa.wanswap.finance/'}>
            FIFA 
            {/* <span style={{ fontSize: '11px' }}>↗</span> */}
          </StyledExternalLink>
          <StyledExternalLink id={`stake-nav-link`} href={'https://wanlend.finance/'}>
            {t('wanLend')} 
            {/* <span style={{ fontSize: '11px' }}>↗</span> */}
          </StyledExternalLink>
          <StyledExternalLink id={`stake-nav-link`} href={'https://streamtrade.wanlend.finance/'}>
            {'StreamTrade'} 
            {/* <span style={{ fontSize: '11px' }}>↗</span> */}
          </StyledExternalLink>
          {/* <StyledExternalLink id={`stake-nav-link`} href={'https://auction.wanswap.finance/'}>
            {t('auction')} <span style={{ fontSize: '11px' }}>↗</span>
          </StyledExternalLink> */}
          {/* <StyledNavLink id={`stake-nav-link`} to={'/vote'}>
            {t('vote')}
          </StyledNavLink> */}
          {/* <StyledExternalLink id={`stake-nav-link`} href={'https://www.wanscan.org'}>
            Charts <span style={{ fontSize: '11px' }}>↗</span>
          </StyledExternalLink> */}
        </HeaderLinks>

      </HeaderRow>
      <HeaderRowMobile>
        <HeaderLinks>
          <StyledExternalLinkMobile id={`stake-nav-link`} href={'https://info.wanswap.finance'}>
            {t('statistics')} <span style={{ fontSize: '11px' }}>↗</span>
          </StyledExternalLinkMobile>
        </HeaderLinks>
      </HeaderRowMobile>
      <HeaderControls>
        <HeaderElement>
          <HideSmall>
            {chainId && NETWORK_LABELS[chainId] && (
              <NetworkCard title={NETWORK_LABELS[chainId]}>{NETWORK_LABELS[chainId]}</NetworkCard>
            )}
          </HideSmall>
          {availableClaim && !showClaimPopup && (
            <UNIWrapper onClick={toggleClaimModal}>
              <UNIAmount active={!!account && !availableClaim} style={{ pointerEvents: 'auto' }}>
                <TYPE.white padding="0 2px">
                  {claimTxn && !claimTxn?.receipt ? <Dots>Claiming WASP</Dots> : 'Claim WASP'}
                </TYPE.white>
              </UNIAmount>
              <CardNoise />
            </UNIWrapper>
          )}
          {!availableClaim && aggregateBalance && (
            <UNIWrapper onClick={() => setShowUniBalanceModal(true)}>
              <UNIAmount active={!!account && !availableClaim} style={{ pointerEvents: 'auto' }}>
                {account && (
                  <HideSmall>
                    <TYPE.white
                      style={{
                        paddingRight: '.4rem',
                        color: '#313131'
                      }}
                    >
                      <CountUp
                        key={countUpValue}
                        isCounting
                        start={parseFloat(countUpValuePrevious)}
                        end={parseFloat(countUpValue)}
                        thousandsSeparator={','}
                        duration={1}
                      />
                    </TYPE.white>
                  </HideSmall>
                ) ?
                  (
                    <HideSmall>
                      <TYPE.white
                        style={{
                          paddingRight: '.4rem',
                          color: '#313131'
                        }}
                      >
                        <CountUp
                          key={countUpValue}
                          isCounting
                          start={parseFloat(countUpValuePrevious)}
                          end={parseFloat(countUpValue)}
                          thousandsSeparator={','}
                          duration={1}
                        />
                      </TYPE.white>
                    </HideSmall>
                  )
                  :
                  <img style={{ marginLeft: '-10px', marginRight: '5px' }} height={'52px'} src="./images/Logomark_WASP_token.svg" alt="logo" />

                }
                WASP
              </UNIAmount>
              <CardNoise />
              <PriceText>${uniPrice?.toFixed(4) ?? '-'}</PriceText>
            </UNIWrapper>
          )}
          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }} >
            {account && userEthBalance ? (
              <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                {userEthBalance?.toSignificant(4)} WAN
              </BalanceText>
            ) : null}
            <Web3Status />
          </AccountElement>
        </HeaderElement>
        <HeaderElementWrap>
          <VersionBtnGroup>
              <V2Btn>V1</V2Btn>
              <V1Btn onClick={()=>{
                window.location.href = 'https://wanswap.finance';
              }}>V2</V1Btn>
          </VersionBtnGroup>
          <Settings />
          <Menu />
        </HeaderElementWrap>
      </HeaderControls>
    </HeaderFrame>
  )
}

const PriceText = styled.div`
  position: relative;
  z-index: -1;
  margin-left: -12px;
  background-color: #2c2f36;
  border: 1px solid #ffe400;
  padding: 0 8px 0 20px;
  color: #ffe400;
  font-size: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`


const V1Btn = styled.button`
  width: 28px;
  height: 28px;
  background: none;
  border-radius: 6px;
  color: #8F8D8B;
  border: none;
  cursor: pointer;
`;

const V2Btn = styled(V1Btn)`
  background: #00A045;
  color: #fff;
  margin-right: 0;
`;

const VersionBtnGroup = styled.div`
  background: #212121;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px;
  margin-left: 8px;
`;
