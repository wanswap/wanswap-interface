import React, { useMemo, useState } from 'react';
import { Currency } from '@wanswap/sdk'
import { AutoColumn } from '../../components/Column';
import { CardSection, DataCard } from '../../components/earn/styled';
import { RowBetween } from '../../components/Row';
import { TYPE } from '../../theme';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ButtonLight } from '../../components/Button';
import { LPPairSearchModal } from '../../components/SearchModal/LPPairSearchModal';
import logoImg from '../../assets/images/png/logo.png';
import downImg from '../../assets/images/png/down.png';
import LpModal from './LPModal';
import { Check } from 'react-feather';
import { useActiveWeb3React } from '../../hooks';
import { useV1UserInfo } from '../../state/stake/hooks';
import { V1_FARM_PAIRS } from '../../constants/abis/bridge';
import { useWalletModalToggle } from '../../state/application/hooks';
import { ethers } from 'ethers';

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`;

const SelectCard = styled.div`
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 14px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-bottom: 30px;
`;

const Logo = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  z-index: 1;
`;

const Logo2 = styled(Logo)`
  z-index: 0;
  margin-left: -9px;
`;

const Logo3 = styled(Logo)`
  width: 24px;
  height: 24px;
`;

const PairContent = styled.div`
  display: flex;
  align-items: center;
`;

const Arrow = styled.img`
  width: 24px;
  height: 24px;
`;

const DataCard2 = styled(DataCard)`
  background: #2E2E2E;
  margin-top: -50px;
`;

const LiquidityCon = styled(RowBetween)`
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const Line = styled.div`
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.05);
  margin: 0 16px;
`;

const Introduce = styled.div`
  background: #00A045;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 26px 0;
  position: relative;
  margin-top: 36px;
  margin-bottom: 34px;
`;

const IntroduceLine = styled.div`
  display: flex;
  margin-bottom: 30px;
  justify-content: center;
  align-items: center;
  width: 390px;
  margin: 0 auto;
`;

const Step = styled.div<{active: boolean}>`
  background: ${({active}) => active ? '#00A045' : '#4D4D4D'};
  color: ${({active}) => active ? '#ffffff' : 'rgba(255, 255, 255, 0.1)'};
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  :before {
    content: '';
    width: 0px;
    height: 0px;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid #00A045;
    position: absolute;
    top: -34px;
    left: 50%;
    margin-left: -11px;
    display: ${({active}) => active ? 'block' : 'none'};
  }
`;

const StepLine = styled.div`
  flex: 1;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
`;

function MigrateLP() {
  const { chainId, account } = useActiveWeb3React()
  console.log('!!! chainId', chainId)
  console.log('account', account)
  const selectIndex = 0;
  // console.log('!!! V1_FARM_PAIRS', V1_FARM_PAIRS[chainId || 999])
  const pair = V1_FARM_PAIRS[chainId || 999][selectIndex];
  const info = useV1UserInfo(chainId || 999, account ? account : undefined, pair)
  console.log('!!! info', info)
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [openLpModal, setLpOpenModal] = useState(false);
  const [type, setType] = useState<Array<number>>([]);
  const [curStatus, setCurStatus] = useState(0);
  const toggleWalletModal = useWalletModalToggle()
  const {token0, token1} = useMemo(() => {
    const t0 = info?.token0Balance;
    const t1 = info?.token1Balance;
    const total = info?.totalSupply[0];
    const user = info?.userInfo.amount;
    const user0 = t0 && user && total ? t0.multiply(user).divide(total) : undefined;
    const user1 = t1 && user && total ? t1.multiply(user).divide(total) : undefined;
    return {
      token0: user0,
      token1: user1,
    }
  }, [info])

  console.log('!!! token0', token0?.toSignificant(8), token1?.toSignificant(8))
  
  return (
    <PageWrapper gap="lg" justify="center">
      <DataCard>
        <CardSection>
          <AutoColumn gap="md">
            <RowBetween>
              <TYPE.yellow3 fontWeight={400} fontSize={20}>{t('Wanswap liquidity mining')}</TYPE.yellow3>
            </RowBetween>
            <RowBetween>
              <TYPE.white fontSize={14} fontWeight={400} lineHeight={'22px'}>
                {t('This one-click migration is only applicable to non-WASP related LP tokens, such as WAN-wanBTC LP tokens, wanUSDT-wanUSDC LP tokens, etc.')}
              </TYPE.white>
            </RowBetween>
          </AutoColumn>
        </CardSection>
      </DataCard>
      <DataCard>
        <CardSection>
          <AutoColumn gap="md">
            <RowBetween>
              <TYPE.white fontWeight={400} fontSize={'20px'}>{t('Select WanSwap V1 LP token')}</TYPE.white>
            </RowBetween>
            <SelectCard onClick={() => setOpenModal(!openModal)}>
              <PairContent>
                <Logo src={logoImg} />
                <Logo2 src={logoImg} />
                <TYPE.white fontWeight={400} fontSize={'16px'} marginLeft={'8px'}>{t('WASP / WAN')}</TYPE.white>
              </PairContent>
              <Arrow src={downImg} />
            </SelectCard>
          </AutoColumn>
        </CardSection>
      </DataCard>
      <DataCard2>
        <CardSection>
          <AutoColumn gap="md">
            <RowBetween>
              <TYPE.white fontWeight={400} fontSize={'16px'}>{t('V1 LP Token Balance')}</TYPE.white>
            </RowBetween>
            <LiquidityCon>
              <TYPE.yellow3 fontWeight={400} fontSize={'24px'}>{info ? ethers.utils.formatEther(info.userInfo.amount.toString()).toString() : 'Loading...'}</TYPE.yellow3>
              <TYPE.white fontWeight={400} fontSize={'24px'}>{t('WSLP (' + pair.name + ')')}</TYPE.white>
            </LiquidityCon>
            <PairContent>
              <Logo3 src={logoImg} />
              <TYPE.white fontWeight={400} fontSize={'16px'} marginLeft={'8px'}>{token0 ? token0?.toSignificant(8) : 'Loading...'}</TYPE.white>&nbsp;
              <TYPE.white fontWeight={400} fontSize={'16px'}>{pair.token0.symbol}</TYPE.white>
              <Line />
              <Logo3 src={logoImg} />
              <TYPE.white fontWeight={400} fontSize={'16px'} marginLeft={'8px'}>{token1 ? token1?.toSignificant(8) : 'Loading...'}</TYPE.white>&nbsp;
              <TYPE.white fontWeight={400} fontSize={'16px'}>{pair.token1.symbol}</TYPE.white>
            </PairContent>
          </AutoColumn>
        </CardSection>
      </DataCard2>
      {
        !account && <ButtonLight onClick={toggleWalletModal}>{t('connectWallet')}</ButtonLight>
      }
      {
        account && <ButtonLight onClick={() => {
          setType([0, 1, 2, 3, 4]);
          setCurStatus(curStatus + 1);
          setLpOpenModal(!openLpModal);
        }} disabled={!info}>{t('Migrate to V2')}</ButtonLight>
      }
      {
        openModal && <LPPairSearchModal
          isOpen={openModal}
          onDismiss={() => setOpenModal(false)}
          onCurrencySelect={ (currency: Currency) => {} }
          otherSelectedCurrency={null}
          onChangeList={ () => {} }
        />
      }
      {
        openLpModal && <LpModal
          isOpen={openLpModal}
          onDismiss={() => setLpOpenModal(false)}
          title={'Migrate LP from V1 to V2 for new farming'}
        >
          <>
            <Introduce>
              <TYPE.yellow3>Deposit</TYPE.yellow3>&nbsp;
              <TYPE.white>LP from WanSwap V1</TYPE.white>
            </Introduce>
            <IntroduceLine>
              {
                type.map((v, k) => <>
                  <Step active={curStatus === k}>{curStatus <= k ? k : <Check size={14} color={'#999999'} />}</Step>
                  { k === type.length - 1 ? null : <StepLine /> }
                </>)
              }
            </IntroduceLine>
            {type && <TYPE.white1 style={{marginTop: '30px'}}>When you withdraw, your WASP is claimed and your liquidity is removed from the mining pool.</TYPE.white1>}
          </>
        </LpModal>
      }
    </PageWrapper>
  )
}

export default MigrateLP;