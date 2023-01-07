import React from 'react';
import styled, { css } from 'styled-components';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ExternalLink } from '../../theme';
import logoImg from '../../assets/images/png/logo.png';
import { ReactComponent as ConvertWaspSvg } from '../../assets/images/svg/conver_wasp.svg';
import { ReactComponent as MigrateLpSvg } from '../../assets/images/svg/migrate_lp.svg';
import { ReactComponent as SwapSvg } from '../../assets/images/svg/swap.svg';
import { ReactComponent as PoolSvg } from '../../assets/images/svg/pool.svg';
import { ReactComponent as FarmingSvg } from '../../assets/images/svg/farming.svg';
import { ReactComponent as HiveSvg } from '../../assets/images/svg/hive.svg';
import { ReactComponent as AnalyticsSvg } from '../../assets/images/svg/analytics.svg';
import { ReactComponent as VoteSvg } from '../../assets/images/svg/vote.svg';
import { ReactComponent as DocsSvg } from '../../assets/images/svg/docs.svg';
import { ReactComponent as BridgeSvg } from '../../assets/images/svg/bridge.svg';
import { ReactComponent as WanLendSvg } from '../../assets/images/svg/wan_lend.svg';
import { ReactComponent as ZooSvg } from '../../assets/images/svg/zoo.svg';
import { ReactComponent as AutoFarmSvg } from '../../assets/images/svg/auto_farm.svg';
import { ReactComponent as StreamTradeSvg } from '../../assets/images/svg/stream_trade.svg';
import { ReactComponent as FifaSvg } from '../../assets/images/svg/fifa.svg';
import { ReactComponent as TwitterSvg } from '../../assets/images/svg/twitter_logo.svg';
import { ReactComponent as MirrorSvg } from '../../assets/images/svg/mirror_logo.svg';
import { ReactComponent as GithubSvg } from '../../assets/images/svg/github_logo.svg';
import { ReactComponent as TelegramLogo } from '../../assets/images/svg/telegram_logo.svg';
import { isMobile } from 'react-device-detect';
import { X } from 'react-feather';


const Con = styled.div<{show: boolean}>`
  width: 260px;
  height: 100%;
  background: rgba(31, 27, 24, 0.5);
  display: flex;
  flex-direction: column;
  transform: ${({show}) => isMobile ? show ? 'translateX(0)' : 'translateX(-100%)' : ''};

  ${
    isMobile && css`
      position: absolute;
      top: 0;
      left: 0;
      z-index: 11;
      width: 100vw;
      transition: 0.3s all ease;
      background: ${({theme}) => theme.bg6 };
    `
  }
`;

const Logo = styled.div`
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  > img {
    width: 216px;
  }
`;

const MobileTop = styled.div`
  height: 70px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const WaspScrollCon = styled.div`
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const WaspCon = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  ${
    isMobile && css`
      padding: 2rem 1.25rem 1.375rem;
    `
  }
`;

const activeClassName = 'ACTIVE';

const WaspItem = styled(NavLink).attrs({
  activeClassName
})`
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-family: Inter-Regular, Inter;
  font-weight: 400;
  color: #FFFFFF;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  padding-left: 2.5rem;
  position: relative;

  ${
    isMobile && css`
      padding: 0 1.25rem;
      height: 3.75rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      margin-bottom: 0.625rem;
    `
  }

  svg {
    width: 24px;
    height: 24px;
    fill: #fff;
    margin-right: 0.5rem;
  }

  path {
    fill: #fff;
  }

  circle {
    fill: #fff;
  }

  &.${activeClassName} {
    border-radius:10px;
    font-weight: 600;
    color: ${({ theme }) => theme.yellow3};

    ${
      isMobile && css`
        background: rgba(255, 230, 0, 0.1);
        border-radius: 12px;
        border-color: #FFE600;
      `
    }

    svg {
      fill: #FFE600;
    }
    path {
      fill: #FFE600;
    }
    circle {
      fill: #FFE600;
    }
  }
`;
const WaspItemLink = styled(ExternalLink).attrs({
  activeClassName
}) <{ isActive?: boolean }>`
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-family: Inter-Regular, Inter;
  font-weight: 400;
  color: #FFFFFF;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  padding-left: 2.5rem;
  position: relative;

  ${
    isMobile && css`
      padding: 0 1.25rem;
      height: 3.75rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      margin-bottom: 0.625rem;
    `
  }

  svg {
    width: 24px;
    height: 24px;
    fill: #fff;
    margin-right: 0.5rem;
  }

  path {
    fill: #fff;
  }

  circle {
    fill: #fff;
  }

  :hover {
    color: ${({ theme }) => theme.yellow3};

    ${
      isMobile && css`
        background: rgba(255, 230, 0, 0.1);
        border-radius: 12px;
        border-color: #FFE600;
      `
    }

    svg {
      fill: #FFE600;
    }

    path {
      fill: #FFE600;
    }
    
    circle {
      fill: #FFE600;
    }
  }
`;
const WaspItemLightLink = styled(ExternalLink).attrs({
  activeClassName
}) <{ isActive?: boolean }>`
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-family: Inter-Regular, Inter;
  font-weight: 400;
  color: #8F8D8B;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  padding-left: 2.5rem;
  position: relative;

  ${
    isMobile && css`
      padding: 0 1.25rem;
      height: 3.75rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      margin-bottom: 0.625rem;
    `
  }

  svg {
    width: 24px;
    height: 24px;
    fill: #8F8D8B;
    margin-right: 0.5rem;
  }

  path {
    fill: #8F8D8B;
  }

  circle {
    fill: #8F8D8B;
  }

  :hover {
    color: ${({ theme }) => theme.yellow3};

    ${
      isMobile && css`
        background: rgba(255, 230, 0, 0.1);
        border-radius: 12px;
        border-color: #FFE600;
      `
    }

    svg {
      fill: #FFE600;
    }

    path {
      fill: #FFE600;
    }
    
    circle {
      fill: #FFE600;
    }
  }
`;

const WaspLinkCon = styled.div`
  padding-bottom: 20px;

  ${
    isMobile && css`
      padding: 2rem 1.25rem 1.375rem;
    `
  }
`;

const LinkLine = styled.div`
  padding: 26px 50px;
  display: flex;
  justify-content: space-around;
`;

const WaspLogoLink = styled(WaspItemLightLink)`
  padding-left: 0;

  ${
    isMobile && css`
      background: none;
      border: none;
      justify-content: center;
    `
  }
`;

function SideBar({
  active,
  handleSlideBar
}:{
  active: boolean
  handleSlideBar: () => void
}) {
  const { t } = useTranslation();

  return (
    <Con show={active} onClick={handleSlideBar}>
      {
        isMobile ?
          <MobileTop>
            <X onClick={handleSlideBar} />
          </MobileTop>
        :
          <Logo>
            <img src={logoImg} alt='' />
          </Logo>
      }
      <WaspScrollCon>
        <WaspCon>
          <WaspItem
            id={`stake-nav-link`}
            to={'/convertwasp'}
            isActive={(match, { pathname }) =>
              Boolean(match) ||
              pathname.startsWith('/convertwasp')
            }
          ><ConvertWaspSvg />Convert WASP</WaspItem>
          <WaspItem
            id={`stake-nav-link`}
            to={'/migratelp'}
            isActive={(match, { pathname }) =>
              Boolean(match) ||
              pathname.startsWith('/migratelp')
            }
          ><MigrateLpSvg />Migrate LP</WaspItem>
        </WaspCon>
        <WaspCon>
          <WaspItem
            id={`swap-nav-link`}
            to={'/swap'}
            isActive={(match, { pathname }) =>
              Boolean(match) ||
              pathname.startsWith('/swap')
            }
          ><SwapSvg />{t('swap')}</WaspItem>
          <WaspItem id={`pool-nav-link`}
            to={'/pool'}
            isActive={(match, { pathname }) =>
              Boolean(match) ||
              pathname.startsWith('/add') ||
              pathname.startsWith('/remove') ||
              pathname.startsWith('/create') ||
              pathname.startsWith('/find')
            }><PoolSvg />{t('pool')}</WaspItem>
          <WaspItem
            id={`stake-nav-link`}
            to={'/farm'}
            isActive={(match, { pathname }) =>
              Boolean(match) ||
              pathname.startsWith('/farm')
            }
          ><FarmingSvg />{t('miningPool')}</WaspItem>
          <WaspItem
            id={`stake-nav-link`}
            to={'/hive'}
            isActive={(match, { pathname }) =>
              Boolean(match) ||
              pathname.startsWith('/hive')
            }
          ><HiveSvg />{t('hive')}</WaspItem>
          <WaspItemLink id={`stake-nav-link`} href={'https://info.wanswap.finance'}><AnalyticsSvg />{t('statistics')}</WaspItemLink>
          <WaspItemLink id={`stake-nav-link`} href={'https://vote.wandevs.org/#/wanswap'}><VoteSvg />{t('vote')} </WaspItemLink>
          <WaspItemLink id={`stake-nav-link`} href={'https://mirror.xyz/0x8e6591E3278Ce4739954354D8BD9C140dd427525/VkfqXTUaPinm9hhDvh_pfp5lrcdt1OKT4wfT2h0hGMI'}><DocsSvg />Docs</WaspItemLink>
        </WaspCon>
        <WaspLinkCon>
          <WaspItemLightLink id={`stake-nav-link`} href={'https://bridge.wanchain.org/'}><BridgeSvg />{t('crossChain')}</WaspItemLightLink>
          <WaspItemLightLink id={`stake-nav-link`} href={'https://wanlend.finance/'}><WanLendSvg />{t('wanLend')} </WaspItemLightLink>
          <WaspItemLightLink id={`stake-nav-link`} href={'https://zookeeper.finance/'}><ZooSvg />ZooKeeper</WaspItemLightLink>
          <WaspItemLightLink id={`stake-nav-link`} href={'https://autofarm.network/'}><AutoFarmSvg />Autofarm</WaspItemLightLink>
          <WaspItemLightLink id={`stake-nav-link`} href={'https://streamtrade.wanlend.finance/'}><StreamTradeSvg />{'StreamTrade'}</WaspItemLightLink>
          <WaspItemLightLink id={`stake-nav-link`} href={'https://fifa.wanswap.finance/'}><FifaSvg />Football Forecast</WaspItemLightLink>
        </WaspLinkCon>
      </WaspScrollCon>
      <LinkLine>
        <WaspLogoLink id={`stake-nav-link`} href={'https://twitter.com/wanswap'}><TwitterSvg /></WaspLogoLink>
        <WaspLogoLink id={`stake-nav-link`} href={'https://mirror.xyz/0x8e6591E3278Ce4739954354D8BD9C140dd427525/VkfqXTUaPinm9hhDvh_pfp5lrcdt1OKT4wfT2h0hGMI'}><MirrorSvg /></WaspLogoLink>
        <WaspLogoLink id={`stake-nav-link`} href={'https://github.com/wanswap'}><GithubSvg /></WaspLogoLink>
        <WaspLogoLink id={`stake-nav-link`} href={'https://t.me/wanswap_official'}><TelegramLogo /></WaspLogoLink>
      </LinkLine>
    </Con>
  )
};

export default SideBar;