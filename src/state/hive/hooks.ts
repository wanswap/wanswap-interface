import { ChainId, CurrencyAmount, JSBI, Token, TokenAmount, WETH } from '@wanswap/sdk'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { WASP } from '../../constants'
import { useBlockNumber } from '../application/hooks'

import { useActiveWeb3React } from '../../hooks'
import { BRIDGE_TOKEN_ADDRESS } from '../../constants/abis/bridge'
import { useSingleCallResult, useSingleContractMultipleData } from '../multicall/hooks'
import { tryParseAmount } from '../swap/hooks'
import { useHiveContract } from '../../hooks/useContract'

export const STAKING_GENESIS = 1606976660

export const REWARDS_DURATION_DAYS = 365*2

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
  // when the period ends
  periodStart: Date | undefined

  allocPoint?: any
  // calculates a hypothetical amount of token distributed to the active account per second.
  getHypotheticalRewardRate: (
    stakedAmount: TokenAmount,
    totalStakedAmount: TokenAmount,
    totalRewardRate: TokenAmount
  ) => TokenAmount
}

export function usePoolInfo() {
  const hiveContract = useHiveContract()
  const poolLength = useSingleCallResult(hiveContract, 'poolLength').result?.toString()
  return useSingleContractMultipleData(
    hiveContract,
    'poolInfo',
    poolLength ? new Array(Number(poolLength)).fill(poolLength).map((_v, _i) => [_i]) : []
  )
}

export function useAllStakingRewardsInfo() {
  const { chainId } = useActiveWeb3React()
  const poolInfo = usePoolInfo()
  const lpTokenAddr = useMemo(() => poolInfo?.map(_v => _v.result?.lpToken), [poolInfo])
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
    lpTokenAddr.forEach((_v, _i) => {
      if (!_v || !chainId) return
      const ret = new Token(chainId, BRIDGE_TOKEN_ADDRESS[chainId], 18, 'WASP', 'WASP');
      if (ret) {
        info[chainId]?.push({
          tokens: [ret, ret],
          stakingRewardAddress: lpTokenAddr[_i]
        })
      }
    })
    return info
  }, [chainId, lpTokenAddr])
}

// gets the staking info from the network for the active chain id
export function useStakingInfo(token?: Token | null, pid?: string | number | null | undefined): StakingInfo[] {
  const currentBlockNumber = useBlockNumber()
  const poolInfo = usePoolInfo()
  const { chainId, account } = useActiveWeb3React()
  const bridgeMinerContract = useHiveContract()
  const allStakingRewards = useAllStakingRewardsInfo()
  const info = useMemo(() => {
    return chainId
      ? allStakingRewards[chainId]?.filter(stakingRewardInfo =>
        token === undefined
            ? true
            : token === null
            ? false
            : token.symbol === stakingRewardInfo.tokens[0].symbol
        ) ?? []
      : []
  }, [allStakingRewards, chainId, token])

  const uni = chainId ? WASP[chainId] : undefined
  const lpTokenAddr = useMemo(() => info.map(({ stakingRewardAddress }) => stakingRewardAddress), [info])

  const userInfoParams = useMemo(() => {
    if (account) {
      return lpTokenAddr.map((_v, i) => {
        const pid = i
        return [pid.toString(), account ?? undefined]
      })
    } else {
      return []
    }
  }, [account, lpTokenAddr])
  // get all the info from the staking rewards contracts

  const earnedAmounts = useSingleContractMultipleData(bridgeMinerContract, 'pendingwanWan', userInfoParams)

  return useMemo(() => {
    if (!chainId || !uni) return []
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

    return lpTokenAddr.reduce<StakingInfo[]>((memo, rewardsAddress, i) => {
      let index = 0;
      if (!pid) {
        index = i;
      } else {
        index = Number(pid)
      }
      const rewardRates = poolInfo[index];
      const startBlock = poolInfo[index] ? poolInfo[index].result?.bonusStartBlock : 0;
      const endBlock = poolInfo[index] ? poolInfo[index].result?.bonusEndBlock : 0;
      const totalSupplies = poolInfo[index] ? poolInfo[index].result?.currentSupply : 0;

      let totalRewardRate = new TokenAmount(WETH[chainId], rewardRates.result?.rewardPerBlock)
      if (currentBlockNumber && (currentBlockNumber > endBlock)) {
        totalRewardRate = new TokenAmount(WETH[chainId], '0')
      }

      let stakedAmount = new TokenAmount(uni, JSBI.BigInt(earnedAmounts[index]?.result?.[0] ?? 0));
      let totalStakedAmount = new TokenAmount(uni, totalSupplies);
      let rewardRate = new TokenAmount(WETH[chainId], totalStakedAmount.greaterThan('0') ? totalRewardRate.multiply(stakedAmount).divide(totalStakedAmount).multiply('1000000000000000000').toFixed(0) : '0');
      // these two are dependent on account
      memo.push({
        pid: index,
        stakingRewardAddress: rewardsAddress,
        tokens: info[index].tokens,
        periodFinish: currentBlockNumber? (new Date((endBlock - currentBlockNumber) * 5000 + Date.now())) : undefined,
        periodStart: currentBlockNumber? (new Date((startBlock - currentBlockNumber) * 5000 + Date.now())) : undefined,
        earnedAmount: new TokenAmount(uni, JSBI.BigInt(earnedAmounts[index]?.result?.[1] ?? 0)),
        rewardRate,
        totalRewardRate,
        stakedAmount,
        totalStakedAmount,
        getHypotheticalRewardRate
      })
      
      return memo
    }, [])
  }, [
    chainId,
    uni,
    lpTokenAddr,
    earnedAmounts,
    info,
    poolInfo,
    currentBlockNumber,
    pid
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
