/* eslint-disable react/jsx-pascal-case */
import React, { Dispatch, SetStateAction, useMemo, useState, useEffect, useContext } from 'react'
import Modal from '../Modal'
import { AutoColumn } from '../Column'
import styled, { ThemeContext } from 'styled-components'
import { RowBetween } from '../Row'
import { TYPE, CloseIcon } from '../../theme'
import { ButtonError } from '../Button'
import { StakingInfo } from '../../state/stake/hooks'
import { useBridgeMinerContract } from '../../hooks/useContract'
import { SubmittedView, LoadingView } from '../ModalViews'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useActiveWeb3React } from '../../hooks'
import { useTranslation } from 'react-i18next'
import { calculateGasMargin } from '../../utils'
import { TokenAmount } from '@wanswap/sdk'
import DoubleCurrencyLogo from '../DoubleLogo'
import { unwrappedToken } from '../../utils/wrappedCurrency'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 2rem;
  /* overflow-y: scroll; */
  cursor: pointer;
`

interface StakingModalProps {
  isOpen: boolean
  onDismiss: () => void
  stakingInfos: StakingInfo[]
}

export default function ClaimRewardModal({ isOpen, onDismiss, stakingInfos }: StakingModalProps) {
  const theme = useContext(ThemeContext);
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  // monitor call to help UI loading state
  const addTransaction = useTransactionAdder()
  const [hash, setHash] = useState<string[] | undefined>()
  const [attempting, setAttempting] = useState(false)
  const [finish, setFinish] = useState(false)

  function wrappedOnDismiss() {
    setFinish(false)
    setHash(undefined)
    setAttempting(false)
    onDismiss()
  }

  const bridgeMinerContract = useBridgeMinerContract()

  const filterStakingInfos = useMemo(
    () =>
      stakingInfos.filter(stakingInfo => {
        const token0 = stakingInfo.tokens[0]
        const token1 = stakingInfo.tokens[1]
        const currency0 = unwrappedToken(token0)
        const currency1 = unwrappedToken(token1)
        stakingInfo.name = `${currency0.symbol} / ${currency1.symbol}`
        return !!stakingInfo.earnedAmount && stakingInfo.earnedAmount.greaterThan('0')
      }),
    [stakingInfos]
  )
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const [claimObj, setClaimObj] = useState(filterStakingInfos.map(i => ({ [i.name]: true })))

  const filterStakingInfosChecked = useMemo(
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    () => filterStakingInfos.filter((item, index) => claimObj[index][item.name]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [claimObj]
  )

  async function onClaimReward() {
    let cancelTx = 0
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    if (bridgeMinerContract && unclaimedWASP) {
      setAttempting(true)
      const hashArr: string[] = []
      const promiseAll = filterStakingInfosChecked.map(async stakingInfo => {
        const gas = await bridgeMinerContract.estimateGas['withdraw'](stakingInfo.pid, '0x0')
        return bridgeMinerContract
          .withdraw(stakingInfo.pid, '0x0', { gasLimit: calculateGasMargin(gas) })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: `Claim accumulated WASP rewards`
            })
            hashArr.push(response.hash)
            if (cancelTx + hashArr.length === filterStakingInfosChecked.length) {
              setFinish(true)
            }
          })
          .catch(() => {
            ++cancelTx
            if (cancelTx === filterStakingInfosChecked.length) {
              wrappedOnDismiss()
              return
            }
            if (hashArr.length + cancelTx === filterStakingInfosChecked.length) {
              setFinish(true)
            }
          })
      })
      await Promise.all(promiseAll).then(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        //@ts-ignore
        setHash(hashArr)
        setAttempting(false)
      })
    }
  }

  const unclaimedWASP = useMemo(() => {
    if (stakingInfos[0]?.rewardRate.token) {
      let sum: TokenAmount = new TokenAmount(stakingInfos[0].rewardRate.token, '0')
      stakingInfos.forEach(val => (sum = val.earnedAmount.add(sum)))
      return sum
    } else {
      return '0'
    }
  }, [stakingInfos])

  const unclaimedWASPChecked = useMemo(() => {
    if (filterStakingInfos[0]?.rewardRate.token) {
      let sum: TokenAmount = new TokenAmount(filterStakingInfos[0].rewardRate.token, '0')
      filterStakingInfos.forEach((val, index) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        if (claimObj[index][val.name]) {
          sum = val.earnedAmount.add(sum)
        }
      })
      return sum
    } else {
      return '0'
    }
  }, [claimObj, filterStakingInfos])

  const allStakedAmount = useMemo(() => {
    return stakingInfos.some(i => !!i?.stakedAmount)
  }, [stakingInfos])

  let error: string | undefined
  if (!account) {
    error = t('connectWallet')
  }

  if (!allStakedAmount) {
    error = error ?? t('enterAnAmount')
  }

  const SelectAll = (e: any) => {
    const newObj = claimObj.map(i => {
      return { [Object.keys(i)[0]]: e.target.checked }
    })
    setClaimObj(newObj)
  }

  const AllCheckedStatus = useMemo(() => {
    const tmp = claimObj.map(i => Object.values(i)[0])
    return tmp.every(i => i)
  }, [claimObj])

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={wrappedOnDismiss}
      maxHeight={90}
      bg={'#21232A!important'}
      border={'1px solid rgba(255, 255, 255, 0.2)'}
    >
      {!attempting && !(hash && hash.length !== 0) && (
        <ContentWrapper gap="lg">
          <RowBetween>
            <TYPE.mediumHeader color={'#fff'}>Claim</TYPE.mediumHeader>
            <CloseIcon onClick={wrappedOnDismiss} />
          </RowBetween>
          {unclaimedWASP && (
            <RowBetweenCus>
              <RowBetween>
                <TYPE.body color={'#fff'}>Selected Unclaimed WASP</TYPE.body>
                <Input type="checkbox" checked={AllCheckedStatus} onClick={e => SelectAll(e)} />
              </RowBetween>
              <Gap />
              <RowBetween>
                <TYPE.green>{unclaimedWASPChecked === '0' ? '0' : unclaimedWASPChecked.toSignificant(6)} WASP</TYPE.green>
                <TYPE.body color={'#999'}>Selected All</TYPE.body>
              </RowBetween>
            </RowBetweenCus>
          )}
          <Contai>
            {filterStakingInfos.length > 0 &&
              filterStakingInfos?.map((stakingInfo, index) => {
                return (
                  <ClaimPoolCard
                    key={index}
                    claimObj={claimObj}
                    setClaimObj={setClaimObj}
                    index={index}
                    stakingInfo={stakingInfo}
                  />
                )
              })}
            <div style={{ height: '5px' }}></div>
          </Contai>
          <TYPE.subHeader style={{ textAlign: 'center' }}>
            When you claim without withdrawing your liquidity remains in the mining pool.
          </TYPE.subHeader>
          <ButtonError
            disabled={
              !!error ||
              unclaimedWASPChecked === '0' ||
              unclaimedWASP === '0' ||
              !unclaimedWASPChecked.greaterThan('0') ||
              !unclaimedWASP.greaterThan('0')
            }
            error={!!error && allStakedAmount}
            onClick={onClaimReward}
            style={!(
              !!error ||
              unclaimedWASPChecked === '0' ||
              unclaimedWASP === '0' ||
              !unclaimedWASPChecked.greaterThan('0') ||
              !unclaimedWASP.greaterThan('0')
            ) ? {
              background: theme.primary6,
              color: '#fff',
              border: 'none !important'
            } : {}}
          >
            {error ?? 'Claim'}
          </ButtonError>
        </ContentWrapper>
      )}
      {attempting && !(hash && hash.length === filterStakingInfosChecked.length) && (
        <LoadingView onDismiss={wrappedOnDismiss}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.body fontSize={20}>
              Claiming {unclaimedWASPChecked === '0' ? '0' : unclaimedWASPChecked.toSignificant(6)} WASP
            </TYPE.body>
          </AutoColumn>
        </LoadingView>
      )}
      {hash && (hash.length === filterStakingInfosChecked.length || finish) && (
        <SubmittedView onDismiss={wrappedOnDismiss} hash={undefined}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.largeHeader>Transaction Submitted</TYPE.largeHeader>
            <TYPE.body fontSize={20}>Claimed WASP!</TYPE.body>
          </AutoColumn>
        </SubmittedView>
      )}
    </Modal>
  )
}

const ClaimPoolCard = function({
  index,
  stakingInfo,
  setClaimObj,
  claimObj
}: {
  key: number
  stakingInfo: StakingInfo
  index: number
  claimObj: object[]
  setClaimObj: Dispatch<SetStateAction<{}[]>>
}) {
  const theme = useContext(ThemeContext);
  const token0 = stakingInfo.tokens[0]
  const token1 = stakingInfo.tokens[1]

  const currency0 = unwrappedToken(token0)
  const currency1 = unwrappedToken(token1)

  const handleClick = (e: any) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    claimObj[index] = { [stakingInfo.name]: e.target.checked }
    setClaimObj(claimObj.map(i => i))
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    claimObj[index] = { [stakingInfo.name]: true }
    setClaimObj(claimObj.map(i => i))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkedValue = useMemo(() => {
    if (claimObj && claimObj[index] && stakingInfo.name) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      //@ts-ignore
      return !!claimObj[index][stakingInfo.name]
    } else {
      return false
    }
  }, [claimObj, index, stakingInfo.name])

  return (
    <ConWrap active={!!checkedValue}>
      <RowBetween>
        <DivText>
          <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={36} />
          <span style={{ display: 'inline-block', marginLeft: '10px', fontSize: '14px', color: '#ddd' }}>
            {stakingInfo.name}
          </span>
        </DivText>
      </RowBetween>
      <Gap />
      <RowBetween>
        <TYPE.body color={'#999'}>Unclaimed WASP</TYPE.body>
        <div style={{ minHeight: '30px', display: 'flex' }}>
          <span style={{ lineHeight: '30px', color: theme.primary6 }}>{stakingInfo.earnedAmount.toSignificant(6)} WASP</span>
          <span style={{ position: 'relative', top: '3px' }}>
            <Input type="checkbox" checked={checkedValue} onClick={e => handleClick(e)} />
          </span>
        </div>
      </RowBetween>
    </ConWrap>
  )
}

const RowBetweenCus = styled(RowBetween)`
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem;
  border-radius: 16px;
  flex-direction: column;
`

const ConWrap = styled.div<{active:boolean}>`
  background: rgba(0, 0, 0, 0);
  border-radius: 16px;
  padding: 1rem;
  border: 1px solid ${({active, theme}) => active ? theme.primary6 : 'rgba(255, 255, 255, 0.2)'};
  margin-bottom: 10px;
`
const Gap = styled.div`
  height: 10px;
`

const Input = styled.input`
  position: relative;
  background-color: transparent;
  width: 17px;
  height: 17px;
  border: 1px solid ${({theme}) => theme.primary6};
  outline: 0;
  border-radius: 50%;
  -webkit-appearance: none;
  -webkit-tap-highlight-color: transparent;
  font-size: inherit;
  color: inherit;
  cursor: pointer;
  &[type='checkbox']:checked {
    text-align: center;
    border: 1px solid ${({theme}) => theme.primary6};
    background-clip: padding-box;
    color: #fff;
    cursor: pointer;
  }
  &[type='checkbox']:checked:after {
    cursor: pointer;
    content: '✓';
    font-size: 16px;
    top: -2.5px;
    position: relative;
    border-radius: 50%;
    color: ${({theme}) => theme.primary6};
  }
`
const Contai = styled.div`
  overflow-y: scroll;
`

const DivText = styled.div`
  font-family: 'Pacifico-Regular';
  font-weight: 400;
  font-size: 16px;
  display: flex;
  width: 100%;
  line-height: 36px;
  justify-content: space-between;
`
