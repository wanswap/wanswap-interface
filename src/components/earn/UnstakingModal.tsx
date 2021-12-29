/* eslint-disable @typescript-eslint/ban-ts-ignore */
import React, { useCallback, useMemo, useState } from 'react'
import Modal from '../Modal/index_cus'
import { AutoColumn } from '../Column'
import styled from 'styled-components'
import Row, { RowBetween, RowFixed } from '../Row'
import { CloseIcon, TYPE } from '../../theme'
import { ButtonError } from '../Button'
import { StakingInfo } from '../../state/stake/hooks'
import { useBridgeMinerContract } from '../../hooks/useContract'
import { SubmittedView, LoadingView } from '../ModalViews'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useActiveWeb3React } from '../../hooks'
import { useTranslation } from 'react-i18next'
import { SUGGEST_GAS_PRICE } from '../../constants'
import { AppBodyV1 } from '../../pages/AppBody'
import { Wrapper } from '../swap/styleds'
import { Text } from 'rebass'
import Slider from '../Slider'
import { LightCard } from '../Card'
import { MaxButton } from '../../pages/Pool/styleds'
import useDebouncedChangeHandler from '../../utils/useDebouncedChangeHandler'
import { CountUp } from 'use-count-up'
import usePrevious from '../../hooks/usePrevious'
import { useTotalSupply } from '../../data/TotalSupply'
import { useCurrency } from '../../hooks/Tokens'
import { ERC20_INTERFACE } from '../../constants/abis/bridge'
import { useMultipleContractSingleData } from '../../state/multicall/hooks'
import { JSBI, TokenAmount } from '@wanswap/sdk'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import tokenLogo from '../../assets/images/wanswap-icon.png'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  grid-row-gap: 0;
`

interface StakingModalProps {
  isOpen: boolean
  onDismiss: () => void
  stakingInfo: StakingInfo
}

export default function UnstakingModal({ isOpen, onDismiss, stakingInfo }: StakingModalProps) {
  const { account } = useActiveWeb3React()
  const [percent, setPercent] = useState('100')
  // monitor call to help UI loading state
  const addTransaction = useTransactionAdder()
  const [hash, setHash] = useState<string | undefined>()
  const [attempting, setAttempting] = useState(false)

  const { t } = useTranslation()

  const [currencyA, currencyB] = [
    useCurrency(stakingInfo?.tokens[0].address),
    useCurrency(stakingInfo?.tokens[1].address)
  ]
  const lpBalanceOf = useMultipleContractSingleData(
    stakingInfo?.tokens?.map(i => i.address),
    ERC20_INTERFACE,
    'balanceOf',
    [stakingInfo?.stakingRewardAddress]
  )

  function wrappedOndismiss() {
    setHash(undefined)
    setAttempting(false)
    onDismiss()
  }

  const bridgeMinerContract = useBridgeMinerContract()

  const withdrawAmount = useMemo(() => {
    if (stakingInfo?.stakedAmount) {
      if (percent === '100') {
        return stakingInfo?.stakedAmount.raw
      }
      return JSBI.divide(JSBI.multiply(stakingInfo.stakedAmount.raw, JSBI.BigInt(percent)), JSBI.BigInt(100))
    } else {
      return 0
    }
  }, [stakingInfo, percent])

  async function onWithdraw() {
    if (bridgeMinerContract && stakingInfo?.stakedAmount) {
      setAttempting(true)
      await bridgeMinerContract
        .withdraw(stakingInfo.pid, `0x${withdrawAmount.toString(16)}`, {
          gasLimit: 500000,
          gasPrice: SUGGEST_GAS_PRICE
        })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Withdraw deposited liquidity`
          })
          setHash(response.hash)
        })
        .catch((error: any) => {
          setAttempting(false)
          console.log(error)
        })
    }
  }

  let selfTokens0Amount: number | undefined
  let selfTokens1Amount: number | undefined

  let error: string | undefined
  if (!account) {
    error = t('connectWallet')
  }
  if (!stakingInfo?.stakedAmount) {
    error = error ?? t('enterAnAmount')
  }

  const totalSupplyOfStakingToken = useTotalSupply(stakingInfo?.stakedAmount?.token)

  const selfTokensAmount = useMemo(() => {
    return lpBalanceOf.map(
      (item, index) => new TokenAmount(stakingInfo?.tokens[index], JSBI.BigInt(item?.result?.balance ?? 0))
    )
  }, [stakingInfo, lpBalanceOf])

  if (totalSupplyOfStakingToken && stakingInfo) {
    //@ts-ignore
    const rate = stakingInfo?.stakedAmount?.toSignificant(10) / totalSupplyOfStakingToken?.toSignificant(10)
    //@ts-ignore
    selfTokens0Amount = rate * selfTokensAmount[0]?.multiply(JSBI.BigInt(percent)).divide(JSBI.BigInt(100)).toSignificant(10)
    // @ts-ignore
    selfTokens1Amount = rate * selfTokensAmount[1]?.multiply(JSBI.BigInt(percent)).divide(JSBI.BigInt(100)).toSignificant(10)
  }

  const liquidityPercentChangeCallback = useCallback(
    (value: number) => {
      setPercent(value.toString())
    },
    [setPercent]
  )

  const [innerLiquidityPercentage, setInnerLiquidityPercentage] = useDebouncedChangeHandler(
    Number.parseInt(percent),
    liquidityPercentChangeCallback
  )

  const countUpAmount = stakingInfo?.earnedAmount?.toFixed(6) ?? '0'
  const countUpAmountPrevious = usePrevious(countUpAmount) ?? '0'

  const bg = useMemo(() => {
    return (!attempting && !hash) ? 'transparent' : undefined
  }, [attempting, hash])

  return (
    <Modal bg={bg} isOpen={isOpen} onDismiss={wrappedOndismiss} maxHeight={90}>
      {/* <Bg /> */}
      {!attempting && !hash && (
        <AppBodyV1>
          <ContentWrapper gap="lg">
            <RowBetweenCus1>
              <span style={{ display: 'inline-block', color: '#fff', width: '100%', textAlign: 'center', fontSize: '22px' }}>Withdraw</span>
              <CloseIcon onClick={wrappedOndismiss} color={'#fff'}/>
            </RowBetweenCus1> 
            <Wrapper>
              <AutoColumn gap="md">
                <LightCardCus>
                  <AutoColumn gap="20px">
                    <RowBetween>
                      <Text fontWeight={500} color={"#fff"}>{t('amount')}</Text>
                    </RowBetween>
                    <Row style={{ alignItems: 'flex-end' }}>
                      <Text fontSize={72} fontWeight={"bold"} color={"#FFFFFF"}>
                        {percent}%
                      </Text>
                    </Row>
                    <div>
                      <Slider value={innerLiquidityPercentage} onChange={setInnerLiquidityPercentage} />
                      <RowBetweenCus2>
                        <MaxButtonCus onClick={() => setPercent('25')} width="20%">
                          25%
                        </MaxButtonCus>
                        <MaxButtonCus onClick={() => setPercent('50')} width="50%">
                          50%
                        </MaxButtonCus>
                        <MaxButtonCus onClick={() => setPercent('75')} width="75%">
                          75%
                        </MaxButtonCus>
                        <MaxButtonCus onClick={() => setPercent('100')} width="100%">
                          Max
                        </MaxButtonCus>
                      </RowBetweenCus2>
                    </div>
                  </AutoColumn>
                </LightCardCus>
                <LightCardCus1>
                  <AutoColumn>
                    <RowBetweenCus>
                      <Text fontSize={18} color={"#fff"}>
                        <IconCon><DoubleCurrencyLogo currency0={currencyA ?? undefined} currency1={currencyB ?? undefined} size={24} /></IconCon>
                        <SpanSty>WASP Amount</SpanSty>
                      </Text>
                      <RowFixed>
                        <Text fontSize={18} fontWeight={400} id="remove-liquidity-tokena-symbol" color={"#fff"}>
                          {stakingInfo?.stakedAmount?.multiply(JSBI.BigInt(percent)).divide(JSBI.BigInt(100)).toSignificant(6) ?? '-'}
                        </Text>
                      </RowFixed>
                    </RowBetweenCus>
                    <RowBetweenCus>
                      <Text fontSize={18} color={"#fff"}>
                        <IconCon><img alt="waspLogo" src={tokenLogo} width={'24px'}/></IconCon>
                        <SpanSty>Unclaimed WASP</SpanSty>
                      </Text>
                      <RowFixed>
                        <Text fontSize={18} fontWeight={400} id="remove-liquidity-tokenb-symbol" color={"#fff"}>
                          <CountUp
                            key={countUpAmount}
                            isCounting
                            decimalPlaces={4}
                            start={parseFloat(countUpAmountPrevious)}
                            end={parseFloat(countUpAmount)}
                            thousandsSeparator={','}
                            duration={1}
                          />
                        </Text>
                      </RowFixed>
                    </RowBetweenCus>
                  </AutoColumn>
                </LightCardCus1>
                <Line />
                <LightCardCus1>
                  <AutoColumn>
                    <RowBetweenCus>
                      <Text fontSize={18} color={"#fff"}>
                        <IconCon><CurrencyLogo currency={currencyA ?? undefined} size={"24px"} /></IconCon>
                        <SpanSty color={'#FFE600'}>{currencyA?.symbol}</SpanSty>
                      </Text>
                      <RowFixed>
                        <Text fontSize={18} fontWeight={400} id="remove-liquidity-tokena-symbol" color={"#FFE600"}>
                          {selfTokens0Amount?.toFixed(3) || 0}
                        </Text>
                      </RowFixed>
                    </RowBetweenCus>
                    <RowBetweenCus>
                      <Text fontSize={18} color={"#fff"}>
                        <IconCon><CurrencyLogo currency={currencyB ?? undefined} size={"24px"} /></IconCon>
                        <SpanSty color={'#FFE600'}>{currencyB?.symbol}</SpanSty>
                      </Text>
                      <RowFixed>
                        <Text fontSize={18} fontWeight={400} id="remove-liquidity-tokenb-symbol" color={"#FFE600"}>
                          {selfTokens1Amount?.toFixed(3) || 0}
                        </Text>
                      </RowFixed>
                    </RowBetweenCus>
                  </AutoColumn>
                </LightCardCus1>
              </AutoColumn>
              <Con>
                <ButtonError disabled={!!error} error={!!error && !!stakingInfo?.stakedAmount} onClick={onWithdraw}>
                  {error ?? 'Withdraw & Claim'}
                </ButtonError>
              </Con>
              <Con >
                <TYPE.subHeader style={{ textAlign: 'center', color: '#999', fontSize: "12px" }}>
                  When you withdraw, your WASP is claimed and your liquidity is removed from the mining pool.
                </TYPE.subHeader>
              </Con>
            </Wrapper>
          </ContentWrapper>
        </AppBodyV1>
      )}
      {attempting && !hash && (
        <LoadingView onDismiss={wrappedOndismiss}>
          <AutoColumn gap="12px" justify={'center'}>
          <TYPE.body fontSize={20}>Withdrawing {stakingInfo?.stakedAmount?.multiply(JSBI.BigInt(percent)).divide(JSBI.BigInt(100)).toSignificant(4)} WASP</TYPE.body>
            <TYPE.body fontSize={20}>
              {t('Claiming')} {stakingInfo?.earnedAmount?.toSignificant(4)} WASP
            </TYPE.body>
          </AutoColumn>
        </LoadingView>
      )}
      {hash && (
        <SubmittedView onDismiss={wrappedOndismiss} hash={hash}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.largeHeader>{t('Transaction Submitted')}</TYPE.largeHeader>
            <TYPE.body fontSize={20}>{t('Withdrew')} WSLP!</TYPE.body>
            <TYPE.body fontSize={20}>{t('Claimed')} WASP!</TYPE.body>
          </AutoColumn>
        </SubmittedView>
      )}
    </Modal>
  )
}

const LightCardCus = styled(LightCard)`
  background: rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid #42B5D9;
  border-top: 1px solid #42B5D9;
  border-radius: 0;
`

const LightCardCus1 = styled(LightCard)`
  background: rgba(0, 0, 0, 0.05);
  padding: 0 1.25rem;
`

const MaxButtonCus = styled(MaxButton)`
  background: #1A3D77;
  color: #fff;
  margin: 0;
  font-weight: bold;
  border-radius: 18px;
  :hover {
    background-color: #FFE600;
    outline: none;
    color: #313131;
  }
  :focus {
    background-color: #FFE600;
    outline: none;
    color: #313131;
  }

`

const Line = styled.div`
  width: 100%auto;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

const SpanSty = styled.span<{
  color?: string
}>`
  color: ${({ color }) => color ? color : '#fff'};
  position: relative;
  margin-left: 10px;
  top: -5px;
  left: -5px;
  font-size: 16px;
`

const IconCon = styled.div`
  display: inline-block;
  width: 50px;
  text-align: center;
`

const Con = styled.div`
  width: 95%;
  padding-left: 5%;
  margin-top: 10px;
`

const RowBetweenCus = styled(RowBetween)`
  height: 45px;
`

const RowBetweenCus1 = styled(RowBetween)`
  height: 45px;
  padding: 0 20px;
  margin-bottom: 10px;
`

const RowBetweenCus2 = styled(RowBetween)`
  background-color: #1A3D77;
  border-radius: 10px;
`

// const Bg = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   border-radius: 12px;
//   width: 100%;
//   height: 100%;
//   filter: blur(20px);
//   background-image: url('./images/${isMobile && 'mobile_'}christmas_bg.svg');
//   background-position: center top;
//   background-size: cover;
//   background-color: rgba(255, 255, 255, 0.05);
//   background-attachment: fixed;
//   z-index: -1;
// `
