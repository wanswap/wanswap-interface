import { ChainId } from '@wanswap/sdk'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { YellowCard } from '../Card'
import Web3Status from '../Web3Status'
import { ReactComponent as MenuSvg } from '../../assets/images/svg/slidebar_btn.svg';

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
  display: flex;
  align-items: center;
  align-items: center;
  flex-direction: row-reverse;
  width: 100%;
  top: 0;
  position: relative;
  border-bottom: 0;
  padding: 0.5rem 1rem;
  z-index: 2;
  grid-template-columns: 1fr;
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
  top: 0px;
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
  flex-direction: row-reverse;
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
  margin: 0;
  margin-right: 0.5rem;
  width: initial;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 1;
`

const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Testnet',
  [ChainId.GÖRLI]: 'Görli',
  [ChainId.KOVAN]: 'Kovan'
}

export default function Top({
  handleSlideBar
}: {
  handleSlideBar: () => void
}) {
  const { chainId } = useActiveWeb3React()

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
        rpcUrls: ['https://gwan-ssl.wandevs.org:56891'],
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
      <HeaderControls>
        <MenuSvg onClick={handleSlideBar} />
        <HeaderElement>
          <HideSmall>
            {chainId && NETWORK_LABELS[chainId] && (
              <NetworkCard title={NETWORK_LABELS[chainId]}>{NETWORK_LABELS[chainId]}</NetworkCard>
            )}
          </HideSmall>
          <Web3Status />
        </HeaderElement>
      </HeaderControls>
    </HeaderFrame>
  )
}
