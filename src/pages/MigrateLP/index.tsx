import React, { useMemo, useState } from 'react';
import { Token, TokenAmount } from '@wanswap/sdk'
import { AutoColumn } from '../../components/Column';
import { CardSection, DataCard } from '../../components/earn/styled';
import { RowBetween } from '../../components/Row';
import { TYPE } from '../../theme';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ButtonLight } from '../../components/Button';
import { LPPairSearchModal } from '../../components/SearchModal/LPPairSearchModal';
import downImg from '../../assets/images/png/down.png';
import LpModal from './LPModal';
import { Check } from 'react-feather';
import { useActiveWeb3React } from '../../hooks';
import { useV1UserInfo } from '../../state/stake/hooks';
import { BRIDGE_MINER_ADDRESS, V1_FARM_PAIRS } from '../../constants/abis/bridge';
import { useWalletModalToggle } from '../../state/application/hooks';
import { ethers } from 'ethers';
import { useBridgeMinerContract, useV1MinerContract } from '../../hooks/useContract';
import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback';
import { useSelectedTokenList } from '../../state/lists/hooks';

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
  const { chainId, account, library } = useActiveWeb3React()
  console.log('!!! chainId', chainId)
  console.log('account', account)
  const [selectIndex, setSelectIndex] = useState(0);
  // console.log('!!! V1_FARM_PAIRS', V1_FARM_PAIRS[chainId || 999])
  const pair = V1_FARM_PAIRS[chainId || 999][selectIndex];
  const info = useV1UserInfo(chainId || 999, account ? account : undefined, pair)
  console.log('!!! info', info)
  const selectedTokenList = Object.values(useSelectedTokenList()[chainId || 999])
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
  const v1MinerContract = useV1MinerContract()
  const v2MinerContract = useBridgeMinerContract()

  const userAmount = new TokenAmount(new Token(chainId || 999, pair.lpAddress, 18), info?.userInfo.amount?.toString() || '0');

  const [approval, approveCallback] = useApproveCallback(
    userAmount,
    chainId ? BRIDGE_MINER_ADDRESS[chainId] : undefined
  )

  const [message0, setMessage0] = useState('');
  const [message1, setMessage1] = useState('');
  const [message2, setMessage2] = useState('');

  console.log('!!! token0', token0?.toSignificant(8), token1?.toSignificant(8))
  console.log('!!! userAmount', userAmount.raw.toString(16))

  const isBtnDisabled = useMemo(() => {
    if (!info) return true;
    if (!Boolean(Number(ethers.utils.formatEther(info.userInfo.amount.toString()).toString()))) return true;
    return false;
  }, [info]);

  return (
    <PageWrapper gap="lg" justify="center">
      <DataCard>
        <CardSection>
          <AutoColumn gap="md">
            <RowBetween>
              <TYPE.yellow3 fontWeight={400} fontSize={20}>{t('WanSwap V1 to V2 LP token migration')}</TYPE.yellow3>
            </RowBetween>
            <RowBetween>
              <TYPE.white fontSize={14} fontWeight={400} lineHeight={'22px'}>
                {t('This one-click migration is only available for LP tokens representing liquidity pools that do not contain WASP, such as WAN/wanBTC, wanUSDT/wanUSDC, etc.')}
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
                <Logo src={selectedTokenList.find(v => v.address === pair.token0.address)?.tokenInfo.logoURI} />
                <Logo2 src={selectedTokenList.find(v => v.address === pair.token1.address)?.tokenInfo.logoURI} />
                <TYPE.white fontWeight={400} fontSize={'16px'} marginLeft={'8px'}>{t(`${pair.token0.symbol} / ${pair.token1.symbol}`)}</TYPE.white>
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
              <Logo3 src={selectedTokenList.find(v => v.address === pair.token0.address)?.tokenInfo.logoURI} />
              <TYPE.white fontWeight={400} fontSize={'16px'} marginLeft={'8px'}>{token0 ? token0?.toSignificant(8) : 'Loading...'}</TYPE.white>&nbsp;
              <TYPE.white fontWeight={400} fontSize={'16px'}>{pair.token0.symbol}</TYPE.white>
              <Line />
              <Logo3 src={selectedTokenList.find(v => v.address === pair.token1.address)?.tokenInfo.logoURI} />
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
        account && <ButtonLight onClick={async () => {
          if (!chainId || !v1MinerContract || !v2MinerContract || !library) return;
          if (pair.type === 0) {
            setMessage0('Withdraw');
            setMessage1('LP from V1 Farming');
            setMessage2('Please confirm transaction in your wallet...');
            setType([0, 1, 2, 3]);
            setCurStatus(0);
            setLpOpenModal(!openLpModal);
            let amount = '0x' + userAmount.raw.toString(16);
            try {
              const tx0 = await v1MinerContract?.withdraw(pair.pid, amount);
              await tx0.wait();
              if (approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING) {
                setMessage0('Approve');
                setMessage1('LP to V2 Farming');
                setCurStatus(1);
                await approveCallback()
              }
  
              setMessage0('Deposit');
              setMessage1('LP to V2 Farming');
              setCurStatus(2);
              const tx2 = await v2MinerContract?.deposit(pair.v2Pid, amount, { gasLimit: 500000 });
              await tx2.wait();
              setMessage0('Success!');
              setMessage1('You can close this window now.');
              setCurStatus(3);
              setMessage2('');
            } catch (err) {
              setLpOpenModal(!openLpModal);
              console.error(err);
            }
          } else {
            setMessage0('Pool with WASP');
            setMessage1('is not supported by auto migration.');
            setMessage2('Please migrate manually.');
            setType([0]); // withdraw, approve, remove lp, approve, convert wasp, approve, mint lp, approve, deposit
            setCurStatus(0);
            setLpOpenModal(!openLpModal);
          }
        }} disabled={isBtnDisabled}>{t('Migrate to V2')}</ButtonLight>
      }
      {
        openModal && <LPPairSearchModal
          isOpen={openModal}
          onDismiss={() => setOpenModal(false)}
          onCurrencySelect={(index: number) => {
            setSelectIndex(index);
          }}
          curSelectedIndex={selectIndex}
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
              <TYPE.yellow3>{message0}</TYPE.yellow3>&nbsp;
              <TYPE.white>{message1}</TYPE.white>
            </Introduce>
            <IntroduceLine>
              {
                type.map((v, k) => <>
                  <Step active={curStatus === k}>{curStatus <= k ? k + 1 : <Check size={14} color={'#999999'} />}</Step>
                  { k === type.length - 1 ? null : <StepLine /> }
                </>)
              }
            </IntroduceLine>
            {type && <TYPE.white1 style={{marginTop: '30px', textAlign: 'center'}}>{message2}</TYPE.white1>}
          </>
        </LpModal>
      }
    </PageWrapper>
  )
}

export default MigrateLP;