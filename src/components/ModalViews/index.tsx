import React, {  } from 'react'
import { useActiveWeb3React } from '../../hooks'

import { AutoColumn, ColumnCenter } from '../Column'
import styled, {  } from 'styled-components'
import { RowBetween } from '../Row'
import { TYPE, CloseIcon, CustomLightSpinner } from '../../theme'
import { ArrowUpCircle } from 'react-feather'

import Circle from '../../assets/images/blue-loader.svg'
import { getEtherscanLink } from '../../utils'
import { ExternalLink } from '../../theme/components'
import { useTranslation } from 'react-i18next'

const ConfirmOrLoadingWrapper = styled.div`
  width: 100%;
  padding: 24px;
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 60px 0;
`

export function LoadingView({ children, onDismiss }: { children: any; onDismiss: () => void }) {
  const { t } = useTranslation()
  return (
    <ConfirmOrLoadingWrapper>
      <RowBetween>
        <div />
        <CloseIcon onClick={onDismiss} />
      </RowBetween>
      <ConfirmedIcon>
        <CustomLightSpinner src={Circle} alt="loader" size={'150px'} />
      </ConfirmedIcon>
      <AutoColumn gap="100px" justify={'center'}>
        {children}
        <TYPE.subHeader>{t("Confirm this transaction in your wallet")}</TYPE.subHeader>
      </AutoColumn>
    </ConfirmOrLoadingWrapper>
  )
}

export function SubmittedView({
  children,
  onDismiss,
  hash
}: {
  children: any
  onDismiss: () => void
  hash: string | undefined
}) {

  const { chainId } = useActiveWeb3React()

  const { t } = useTranslation()

  return (
    <ConfirmOrLoadingWrapper>
      <RowBetween>
        <div />
        <CloseIcon onClick={onDismiss} />
      </RowBetween>
      <ConfirmedIcon>
        <ArrowUpCircle strokeWidth={0.5} size={150} color={'#FFE600'} />
      </ConfirmedIcon>
      <AutoColumn gap="100px" justify={'center'}>
        {children}
        {chainId && hash && (
          <ExternalLink href={getEtherscanLink(chainId, hash, 'transaction')} style={{ marginLeft: '4px' }}>
            <TYPE.subHeader>{t("View transaction on wanscan.org")}</TYPE.subHeader>
          </ExternalLink>
        )}
      </AutoColumn>
    </ConfirmOrLoadingWrapper>
  )
}
