import { ChainId, CurrencyAmount, JSBI, Token, TokenAmount, Pair } from '@wanswap/sdk'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { WASP } from '../../constants'
import { useBlockNumber } from '../application/hooks'

import { useActiveWeb3React } from '../../hooks'
import { useTrackedTokenPairs } from '../user/hooks'
import { WANV2_PAIR_INTERFACE, BRIDGE_MINER_ADDRESS } from '../../constants/abis/bridge'
import { useMultipleContractSingleData, useSingleCallResult, useSingleContractMultipleData } from '../multicall/hooks'
import { tryParseAmount } from '../swap/hooks'
import { useBridgeMinerContract } from '../../hooks/useContract'

export const STAKING_GENESIS = 1600387200

export const REWARDS_DURATION_DAYS = 60

// TODO add staking rewards addresses here
// export const STAKING_REWARDS_INFO: {
//   [chainId in ChainId]?: {
//     tokens: [Token, Token]
//     stakingRewardAddress: string
//   }[]
// } = {
//   [ChainId.MAINNET]: [],
//   [ChainId.ROPSTEN]: []
// }

// console.log(STAKING_REWARDS_INFO)

export interface StakingInfo {
  pid: number
  // the address of the reward contract
  stakingRewardAddress: string
  // the tokens involved in this pair
  tokens: [Token, Token]
  // the amount of token currently staked, or undefined if no account
  stakedAmount: TokenAmount
  // the amount of reward token earned by the active account, or undefined if no account
  earnedAmount: TokenAmount
  // the total amount of token staked in the contract
  totalStakedAmount: TokenAmount
  // the amount of token distributed per second to all LPs, constant
  totalRewardRate: TokenAmount
  // the current amount of token distributed to the active account per second.
  // equivalent to percent of total supply * reward rate
  rewardRate: TokenAmount
  // when the period ends
  periodFinish: Date | undefined
  // calculates a hypothetical amount of token distributed to the active account per second.
  getHypotheticalRewardRate: (
    stakedAmount: TokenAmount,
    totalStakedAmount: TokenAmount,
    totalRewardRate: TokenAmount
  ) => TokenAmount
}

export function usePoolInfo() {
  const bridgeMinerContract = useBridgeMinerContract()
  const poolLength = useSingleCallResult(bridgeMinerContract, 'poolLength').result?.toString()
  return useSingleContractMultipleData(
    bridgeMinerContract,
    'poolInfo',
    poolLength ? new Array(Number(poolLength)).fill(poolLength).map((_v, _i) => [_i]) : []
  )
}

export function useAllStakingRewardsInfo() {
  const { chainId } = useActiveWeb3React()
  const poolInfo = usePoolInfo()
  const lpTokenAddr = useMemo(() => poolInfo?.map(_v => _v.result?.lpToken), [poolInfo])
  const token1Info = useMultipleContractSingleData(lpTokenAddr, WANV2_PAIR_INTERFACE, 'token1')
  const token0Info = useMultipleContractSingleData(lpTokenAddr, WANV2_PAIR_INTERFACE, 'token0')
  const trackedTokenPairs = useTrackedTokenPairs()

  return useMemo(() => {
    const info: {
      [chainId in ChainId]?: {
        tokens: [Token, Token]
        stakingRewardAddress: string
      }[]
    } = {
      [ChainId.MAINNET]: [],
      [ChainId.ROPSTEN]: []
    }
    token1Info.forEach((_v, _i) => {
      if (!_v.result || !chainId) return
      const ret = trackedTokenPairs.find(
        val => token0Info[_i].result?.[0] === val[0].address && _v.result && val[1].address === _v.result[0]
      )
      if (ret) {
        info[chainId]?.push({
          tokens: [ret[0], ret[1]],
          stakingRewardAddress: lpTokenAddr[_i]
        })
      }
    })
    return info
  }, [chainId, lpTokenAddr, token0Info, token1Info, trackedTokenPairs])
}

// gets the staking info from the network for the active chain id
export function useStakingInfo(pairToFilterBy?: Pair | null): StakingInfo[] {
  const currentBlockNumber = useBlockNumber()
  const poolInfo = usePoolInfo()

  const { chainId, account } = useActiveWeb3React()
  const bridgeMinerContract = useBridgeMinerContract()
  const allStakingRewards = useAllStakingRewardsInfo()
  const info = useMemo(() => {
    return chainId
      ? allStakingRewards[chainId]?.filter(stakingRewardInfo =>
          pairToFilterBy === undefined
            ? true
            : pairToFilterBy === null
            ? false
            : pairToFilterBy.involvesToken(stakingRewardInfo.tokens[0]) &&
              pairToFilterBy.involvesToken(stakingRewardInfo.tokens[1])
        ) ?? []
      : []
  }, [allStakingRewards, chainId, pairToFilterBy])

  const uni = chainId ? WASP[chainId] : undefined
  const lpTokenAddr = useMemo(() => info.map(({ stakingRewardAddress }) => stakingRewardAddress), [info])

  const userInfoParams = useMemo(() => {
    if (account) {
      return poolInfo.map((_v, _i) => [_i.toString(), account ?? undefined])
    } else {
      return []
    }
  }, [account, poolInfo])

  // get all the info from the staking rewards contracts
  const balances = useSingleContractMultipleData(bridgeMinerContract, 'userInfo', userInfoParams)
  const totalSupplies = useMultipleContractSingleData(lpTokenAddr, WANV2_PAIR_INTERFACE, 'balanceOf', [
    chainId ? BRIDGE_MINER_ADDRESS[chainId] : undefined
  ])
  const earnedAmounts = useSingleContractMultipleData(bridgeMinerContract, 'pendingBridge', userInfoParams)
  const rewardRates = useSingleCallResult(bridgeMinerContract, 'bridgePerBlock')
  const startBlock = useSingleCallResult(bridgeMinerContract, 'startBlock')
  const testEndBlock = useSingleCallResult(bridgeMinerContract, 'testEndBlock')
  const bonusEndBlock = useSingleCallResult(bridgeMinerContract, 'bonusEndBlock')
  const periodFinishes = useSingleCallResult(bridgeMinerContract, 'allEndBlock')
  const totalAllocPoint = useSingleCallResult(bridgeMinerContract, 'totalAllocPoint')

  const radix = useMemo(() => {
    if (testEndBlock.result?.[0]?.lt(currentBlockNumber) && bonusEndBlock.result?.[0]?.gt(currentBlockNumber)) {
      return 1
    } else if (
      (startBlock.result?.[0].lt(currentBlockNumber) && testEndBlock.result?.[0].gt(currentBlockNumber)) ||
      (bonusEndBlock.result?.[0].lt(currentBlockNumber) && periodFinishes.result?.[0].gt(currentBlockNumber))
    ) {
      return 0.2
    } else {
      return 0
    }
  }, [bonusEndBlock, currentBlockNumber, periodFinishes, startBlock, testEndBlock])
  return useMemo(() => {
    if (!chainId || !uni) return []

    return lpTokenAddr.reduce<StakingInfo[]>((memo, rewardsAddress, index) => {
      // these two are dependent on account
      const balanceState = balances[index]
      const earnedAmountState = earnedAmounts[index]

      // these get fetched regardless of account
      const totalSupplyState = totalSupplies[index]
      const rewardRateState = rewardRates
      const periodFinishState = periodFinishes

      if (
        // these may be undefined if not logged in
        !balanceState?.loading &&
        !earnedAmountState?.loading &&
        // always need these
        totalSupplyState &&
        !totalSupplyState.loading &&
        rewardRateState &&
        !rewardRateState.loading &&
        periodFinishState &&
        !periodFinishState.loading
      ) {
        if (
          balanceState?.error ||
          earnedAmountState?.error ||
          totalSupplyState.error ||
          rewardRateState.error ||
          periodFinishState.error
        ) {
          console.error('Failed to load staking rewards info')
          return memo
        }

        // get the LP token
        const tokens = info[index].tokens
        const dummyPair = new Pair(new TokenAmount(tokens[0], '0'), new TokenAmount(tokens[1], '0'))

        // check for account, if no account set to 0

        const stakedAmount = new TokenAmount(dummyPair.liquidityToken, JSBI.BigInt(balanceState?.result?.[0] ?? 0))
        const totalStakedAmount = new TokenAmount(dummyPair.liquidityToken, JSBI.BigInt(totalSupplyState.result?.[0]))
        const totalRewardRate = new TokenAmount(
          uni,
          JSBI.BigInt(
            rewardRateState.result?.[0]
              .mul(radix)
              .mul(poolInfo[index].result?.allocPoint)
              ?.div(totalAllocPoint.result?.[0])
          )
        )

        const getHypotheticalRewardRate = (
          stakedAmount: TokenAmount,
          totalStakedAmount: TokenAmount,
          totalRewardRate: TokenAmount
        ): TokenAmount => {
          return new TokenAmount(
            uni,
            JSBI.greaterThan(totalStakedAmount.raw, JSBI.BigInt(0))
              ? JSBI.divide(JSBI.multiply(totalRewardRate.raw, stakedAmount.raw), totalStakedAmount.raw)
              : JSBI.BigInt(0)
          )
        }

        const individualRewardRate = getHypotheticalRewardRate(stakedAmount, totalStakedAmount, totalRewardRate)
        const periodFinishMs = periodFinishState.result?.[0]
          ?.sub(currentBlockNumber)
          ?.mul(5000)
          ?.add(Date.now())
          ?.toNumber()

        memo.push({
          pid: index,
          stakingRewardAddress: rewardsAddress,
          tokens: info[index].tokens,
          periodFinish: periodFinishMs > 0 ? new Date(periodFinishMs) : undefined,
          earnedAmount: new TokenAmount(uni, JSBI.BigInt(earnedAmountState?.result?.[0] ?? 0)),
          rewardRate: individualRewardRate,
          totalRewardRate: totalRewardRate,
          stakedAmount: stakedAmount,
          totalStakedAmount: totalStakedAmount,
          getHypotheticalRewardRate
        })
      }
      return memo
    }, [])
  }, [
    chainId,
    uni,
    lpTokenAddr,
    balances,
    earnedAmounts,
    totalSupplies,
    rewardRates,
    periodFinishes,
    info,
    radix,
    poolInfo,
    totalAllocPoint,
    currentBlockNumber
  ])
}

export function useTotalUniEarned(): TokenAmount | undefined {
  const { chainId } = useActiveWeb3React()
  const uni = chainId ? WASP[chainId] : undefined
  const stakingInfos = useStakingInfo()

  return useMemo(() => {
    if (!uni) return undefined
    return (
      stakingInfos?.reduce(
        (accumulator, stakingInfo) => accumulator.add(stakingInfo.earnedAmount),
        new TokenAmount(uni, '0')
      ) ?? new TokenAmount(uni, '0')
    )
  }, [stakingInfos, uni])
}

// based on typed value
export function useDerivedStakeInfo(
  typedValue: string,
  stakingToken: Token,
  userLiquidityUnstaked: TokenAmount | undefined
): {
  parsedAmount?: CurrencyAmount
  error?: string
} {
  const { account } = useActiveWeb3React()

  const { t } = useTranslation()

  const parsedInput: CurrencyAmount | undefined = tryParseAmount(typedValue, stakingToken)

  const parsedAmount =
    parsedInput && userLiquidityUnstaked && JSBI.lessThanOrEqual(parsedInput.raw, userLiquidityUnstaked.raw)
      ? parsedInput
      : undefined

  let error: string | undefined
  if (!account) {
    error = t('connectWallet')
  }
  if (!parsedAmount) {
    error = error ?? t('enterAnAmount')
  }

  return {
    parsedAmount,
    error
  }
}

// based on typed value
export function useDerivedUnstakeInfo(
  typedValue: string,
  stakingAmount: TokenAmount
): {
  parsedAmount?: CurrencyAmount
  error?: string
} {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()

  const parsedInput: CurrencyAmount | undefined = tryParseAmount(typedValue, stakingAmount.token)

  const parsedAmount = parsedInput && JSBI.lessThanOrEqual(parsedInput.raw, stakingAmount.raw) ? parsedInput : undefined

  let error: string | undefined
  if (!account) {
    error = t('connectWallet')
  }
  if (!parsedAmount) {
    error = error ?? t('enterAnAmount')
  }

  return {
    parsedAmount,
    error
  }
}
