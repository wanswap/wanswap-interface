import React, { useContext, useState } from 'react'
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


const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1rem;
`

interface StakingModalProps {
  isOpen: boolean
  onDismiss: () => void
  stakingInfo: StakingInfo
}

export default function ClaimRewardModal({ isOpen, onDismiss, stakingInfo }: StakingModalProps) {
  const theme = useContext(ThemeContext);
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  // monitor call to help UI loading state
  const addTransaction = useTransactionAdder()
  const [hash, setHash] = useState<string | undefined>()
  const [attempting, setAttempting] = useState(false)

  function wrappedOnDismiss() {
    setHash(undefined)
    setAttempting(false)
    onDismiss()
  }

  const bridgeMinerContract = useBridgeMinerContract()

  async function onClaimReward() {
    if (bridgeMinerContract && stakingInfo?.earnedAmount) {
      setAttempting(true)
      let gas = await bridgeMinerContract.estimateGas['deposit'](stakingInfo.pid, '0x0');
      await bridgeMinerContract.deposit(stakingInfo.pid, '0x0', {gasLimit: calculateGasMargin(gas)})
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: t(`Claim accumulated WASP rewards`)
          })
          setHash(response.hash)
        })
        .catch((error: any) => {
          setAttempting(false)
          console.log(error)
        })
    }
  }

  let error: string | undefined
  if (!account) {
    error = t('connectWallet')
  }
  if (!stakingInfo?.stakedAmount) {
    error = error ?? t('enterAnAmount')
  }

  return (
    <Modal isOpen={isOpen} onDismiss={wrappedOnDismiss} maxHeight={90}>
      {!attempting && !hash && (
        <ContentWrapper gap="lg">
          <RowBetween>
            <TYPE.mediumHeader>{t("Claim")}</TYPE.mediumHeader>
            <CloseIcon onClick={wrappedOnDismiss} />
          </RowBetween>
          {stakingInfo?.earnedAmount && (
            <AutoColumn justify="center" gap="md">
              <TYPE.body fontWeight={600} fontSize={36}>
                {stakingInfo?.earnedAmount?.toSignificant(6)}
              </TYPE.body>
              <TYPE.body>{t("Unclaimed")} WASP</TYPE.body>
            </AutoColumn>
          )}
          <TYPE.subHeader style={{ textAlign: 'center' }}>
            {t("When you claim without withdrawing your liquidity remains in the mining pool.")}
          </TYPE.subHeader>
          <ButtonError style={!!!error ? {background: theme.primary6, color: '#fff', border: 'none !important'} : {}} disabled={!!error} error={!!error && !!stakingInfo?.stakedAmount} onClick={onClaimReward}>
            {error ?? t('Claim')}
          </ButtonError>
        </ContentWrapper>
      )}
      {attempting && !hash && (
        <LoadingView onDismiss={wrappedOnDismiss}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.body fontSize={20}>{t("Claiming")} {stakingInfo?.earnedAmount?.toSignificant(6)} WASP</TYPE.body>
          </AutoColumn>
        </LoadingView>
      )}
      {hash && (
        <SubmittedView onDismiss={wrappedOnDismiss} hash={hash}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.largeHeader>{t("Transaction Submitted")}</TYPE.largeHeader>
            <TYPE.body fontSize={20}>{t("Claimed WASP!")}</TYPE.body>
          </AutoColumn>
        </SubmittedView>
      )}
    </Modal>
  )
}
