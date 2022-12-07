import React, { useState } from 'react';
import { Currency } from '@wanswap/sdk'
import { AutoColumn } from '../../components/Column';
import { CardSection, DataCard } from '../../components/earn/styled';
import { RowBetween } from '../../components/Row';
import { TYPE } from '../../theme';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ButtonLight } from '../../components/Button';
import { LPSearch } from '../../components/SearchModal/LPSearch';
import logoImg from '../../assets/images/png/logo.png';
import downImg from '../../assets/images/png/down.png';

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

function MigrateLP() {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  
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
              <TYPE.white fontWeight={400} fontSize={'16px'}>{t('Select WanSwap V1 LP token')}</TYPE.white>
            </RowBetween>
            <LiquidityCon>
              <TYPE.yellow3 fontWeight={400} fontSize={'24px'}>{t('0.00000000682')}</TYPE.yellow3>
              <TYPE.white fontWeight={400} fontSize={'24px'}>{t('WSLP WASP-WAN')}</TYPE.white>
            </LiquidityCon>
            <PairContent>
              <Logo3 src={logoImg} />
              <TYPE.white fontWeight={400} fontSize={'16px'} marginLeft={'8px'}>{t('1.68785')}</TYPE.white>&nbsp;
              <TYPE.white fontWeight={400} fontSize={'16px'}>{t('WASP')}</TYPE.white>
              <Line />
              <Logo3 src={logoImg} />
              <TYPE.white fontWeight={400} fontSize={'16px'} marginLeft={'8px'}>{t('80.68785')}</TYPE.white>&nbsp;
              <TYPE.white fontWeight={400} fontSize={'16px'}>{t('WAN')}</TYPE.white>
            </PairContent>
          </AutoColumn>
        </CardSection>
      </DataCard2>
      <ButtonLight>{t('Migrate to V2')}</ButtonLight>
      {
        openModal && <LPSearch
          isOpen={openModal}
          onDismiss={() => setOpenModal(false)}
          onCurrencySelect={ (currency: Currency) => {} }
          otherSelectedCurrency={null}
          onChangeList={ () => {} }
        />
      }
    </PageWrapper>
  )
}

export default MigrateLP;