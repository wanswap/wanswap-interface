import React, { useState, useCallback } from 'react'
// import useIsArgentWallet from '../../hooks/useIsArgentWallet'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'
import Modal from '../Modal'
import { AutoColumn } from '../Column'
import styled from 'styled-components'
import { RowBetween } from '../Row'
import { TYPE, CloseIcon } from '../../theme'
import { ButtonConfirmed, ButtonError } from '../Button'
import ProgressCircles from '../ProgressSteps'
import CurrencyInputPanel from '../CurrencyInputPanel'
import { TokenAmount } from '@wanswap/sdk'
import { useActiveWeb3React } from '../../hooks'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { useHiveContract } from '../../hooks/useContract'
import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'
// import { splitSignature } from 'ethers/lib/utils'
import { StakingInfo, useDerivedStakeInfo } from '../../state/stake/hooks'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { LoadingView, SubmittedView } from '../ModalViews'
import { HIVE_ADDRESS } from '../../constants/abis/bridge'
import { useTranslation } from 'react-i18next'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1rem;
`

interface StakingModalProps {
  isOpen: boolean
  onDismiss: () => void
  stakingInfo: StakingInfo
  userLiquidityUnstaked: TokenAmount | undefined
}

export default function StakingAutoWaspModal({ isOpen, onDismiss, stakingInfo, userLiquidityUnstaked }: StakingModalProps) {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  // track and parse user input
  const [typedValue, setTypedValue] = useState('')
  const { parsedAmount, error } = useDerivedStakeInfo(typedValue, stakingInfo.stakedAmount.token, userLiquidityUnstaked)

  // state for pending and submitted txn views
  const addTransaction = useTransactionAdder()
  const [attempting, setAttempting] = useState<boolean>(false)
  const [hash, setHash] = useState<string | undefined>()
  const wrappedOnDismiss = useCallback(() => {
    setHash(undefined)
    setAttempting(false)
    onDismiss()
  }, [onDismiss])

  // pair contract for this token to be staked
  const dummyPair = undefined
  // const pairContract = usePairContract(dummyPair.liquidityToken.address)

  // approval data for stake
  const deadline = useTransactionDeadline()
  const [approval, approveCallback] = useApproveCallback(
    parsedAmount,
    chainId ? HIVE_ADDRESS[chainId] : undefined
  )

  // const isArgentWallet = useIsArgentWallet()
  const bridgeMinerContract = useHiveContract()
  async function onStake() {
    setAttempting(true)
    if (bridgeMinerContract && parsedAmount && deadline) {
      if (approval === ApprovalState.APPROVED) {
        await bridgeMinerContract
          .deposit(stakingInfo.pid, `0x${parsedAmount.raw.toString(16)}`, { gasLimit: 500000 })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: `Deposit WASP`
            })
            setHash(response.hash)
          })
          .catch((error: any) => {
            setAttempting(false)
            console.log(error)
          })
      } else {
        setAttempting(false)
        throw new Error('Attempting to stake without approval or a signature. Please contact support.')
      }
    }
  }

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback((typedValue: string) => {
    setTypedValue(typedValue)
  }, [])

  // used for max input button
  const maxAmountInput = maxAmountSpend(userLiquidityUnstaked)
  const atMaxAmount = Boolean(maxAmountInput && parsedAmount?.equalTo(maxAmountInput))
  const handleMax = useCallback(() => {
    maxAmountInput && onUserInput(maxAmountInput.toExact())
  }, [maxAmountInput, onUserInput])

  return (
    <Modal isOpen={isOpen} onDismiss={wrappedOnDismiss} maxHeight={90}>
      {!attempting && !hash && (
        <ContentWrapper gap="md">
          <RowBetween>
            <TYPE.mediumHeader>{t("Deposit")}</TYPE.mediumHeader>
            <CloseIcon onClick={wrappedOnDismiss} />
          </RowBetween>
          <CurrencyInputPanel
            value={typedValue}
            onUserInput={onUserInput}
            onMax={handleMax}
            showMaxButton={!atMaxAmount}
            currency={stakingInfo.stakedAmount.token}
            pair={dummyPair}
            label={''}
            disableCurrencySelect={true}
            customBalanceText={'Available to deposit: '}
            id="stake-liquidity-token"
          />

          <RowBetween>
            <ButtonConfirmed
              mr="0.5rem"
              onClick={approveCallback}
              altDisabledStyle={true}
              confirmed={approval === ApprovalState.APPROVED}
              disabled={approval !== ApprovalState.NOT_APPROVED}
            >
              {t("Approve")}
            </ButtonConfirmed>
            <ButtonError
              altDisabledStyle={true}
              disabled={!!error || approval !== ApprovalState.APPROVED}
              error={!!error && !!parsedAmount}
              onClick={onStake}
            >
              {error ?? t('Deposit')}
            </ButtonError>
          </RowBetween>
          <ProgressCircles steps={[approval === ApprovalState.APPROVED]} disabled={true} />
        </ContentWrapper>
      )}
      {attempting && !hash && (
        <LoadingView onDismiss={wrappedOnDismiss}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.largeHeader>{t("Depositing WASP")}</TYPE.largeHeader>
            <TYPE.body fontSize={20}>{parsedAmount?.toSignificant(4)} WASP</TYPE.body>
          </AutoColumn>
        </LoadingView>
      )}
      {attempting && hash && (
        <SubmittedView onDismiss={wrappedOnDismiss} hash={hash}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.largeHeader>{t("Transaction Submitted")}</TYPE.largeHeader>
            <TYPE.body fontSize={20}>{t("Deposited")} {parsedAmount?.toSignificant(4)} WASP</TYPE.body>
          </AutoColumn>
        </SubmittedView>
      )}
    </Modal>
  )
}
