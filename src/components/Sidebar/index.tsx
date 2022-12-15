import React from 'react';
import styled from 'styled-components';
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

const Con = styled.div`
  width: 300px;
  height: 100%;
  background: rgba(31, 27, 24, 0.5);
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

const WaspCon = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const activeClassName = 'ACTIVE';

const WaspItem = styled(NavLink).attrs({
  activeClassName
})`
  height: 60px;
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
  height: 60px;
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
  height: 60px;
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
`;

function SideBar() {
  const { t } = useTranslation();

  return (
    <Con>
      <Logo>
        <img src={logoImg} alt='' />
      </Logo>
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
        <WaspItemLink id={`stake-nav-link`} href={'https://vote.wandevs.org/#/wanswap'}><DocsSvg />Docs</WaspItemLink>
      </WaspCon>
      <WaspLinkCon>
        <WaspItemLightLink id={`stake-nav-link`} href={'https://bridge.wanchain.org/'}><BridgeSvg />{t('crossChain')}</WaspItemLightLink>
        <WaspItemLightLink id={`stake-nav-link`} href={'https://wanlend.finance/'}><WanLendSvg />{t('wanLend')} </WaspItemLightLink>
        <WaspItemLightLink id={`stake-nav-link`} href={'https://bridge.wanchain.org/'}><ZooSvg />ZooKeeper</WaspItemLightLink>
        <WaspItemLightLink id={`stake-nav-link`} href={'https://bridge.wanchain.org/'}><AutoFarmSvg />Autofarm</WaspItemLightLink>
        <WaspItemLightLink id={`stake-nav-link`} href={'https://streamtrade.wanlend.finance/'}><StreamTradeSvg />{'StreamTrade'} </WaspItemLightLink>
      </WaspLinkCon>
    </Con>
  )
};

export default SideBar;