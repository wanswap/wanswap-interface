import { TokenAmount } from '@wanswap/sdk'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { useActiveWeb3React } from '../../hooks'

import { useAggregateUniBalance } from '../../state/wallet/hooks'
import { CardNoise } from '../earn/styled'
import { CountUp } from 'use-count-up'
import { TYPE } from '../../theme'
import Settings from '../Settings'
import { useUserHasAvailableClaim } from '../../state/claim/hooks'
import Modal from '../Modal'
import UniBalanceContent from './UniBalanceContent'
import usePrevious from '../../hooks/usePrevious'
import useUSDCPrice from '../../utils/useUSDCPrice'
import { WASP } from '../../constants';
import logoImg from '../../assets/images/png/wasp_logo.png';

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
  // display: grid;
  display: flex;
  // grid-template-columns: 1fr 120px;
  align-items: center;
  // justify-content: space-between;
  align-items: center;
  flex-direction: row-reverse;
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
  align-items: center;
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
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row-reverse;
    align-items: center;
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

const LogoCon = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #212121;
  margin: 0 10px 0 -10px;
`;

export default function Bottom() {
  const { account, chainId } = useActiveWeb3React()

  const uniPrice = useUSDCPrice(chainId ? WASP[chainId] : undefined)

  const availableClaim: boolean = useUserHasAvailableClaim(account)

  const aggregateBalance: TokenAmount | undefined = useAggregateUniBalance()

  const [showUniBalanceModal, setShowUniBalanceModal] = useState(false)

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
      <Modal isOpen={showUniBalanceModal} onDismiss={() => setShowUniBalanceModal(false)}>
        <UniBalanceContent setShowUniBalanceModal={setShowUniBalanceModal} />
      </Modal>
      <HeaderControls>
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
                <LogoCon>
                  <img height={'24px'} src={logoImg} alt="logo" />
                </LogoCon>

              }
              WASP
            </UNIAmount>
            <CardNoise />
            <PriceText>${uniPrice?.toFixed(4) ?? '-'}</PriceText>
          </UNIWrapper>
        )}
        <HeaderElement>
          <Settings />
          <VersionBtnGroup>
              <V1Btn onClick={()=>{
                window.location.href = 'https://v1.wanswap.finance';
              }}>V1</V1Btn>
              <V2Btn>V2</V2Btn>
          </VersionBtnGroup>
        </HeaderElement>
      </HeaderControls>
    </HeaderFrame>
  )
}

const V1Btn = styled.button`
  width: 28px;
  height: 28px;
  background: none;
  border-radius: 6px;
  color: #8F8D8B;
  border: none;
  cursor: pointer;
  margin-right: 4px;
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
  margin-right: 8px;
`;

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
