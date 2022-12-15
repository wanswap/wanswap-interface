import React, { useContext } from 'react'
import { useActiveWeb3React } from '../../hooks'

import { AutoColumn, ColumnCenter } from '../Column'
import styled, { ThemeContext } from 'styled-components'
import { RowBetween } from '../Row'
import { TYPE, CloseIcon } from '../../theme'
import { ArrowUpCircle } from 'react-feather'

import { getEtherscanLink } from '../../utils'
import { ExternalLink } from '../../theme/components'
import { useTranslation } from 'react-i18next'
import LoadingLogoIcon from '../../assets/images/png/loading_logo.png';
import { ButtonGreen } from '../Button'

const ConfirmOrLoadingWrapper = styled.div`
  width: 100%;
  padding: 24px;
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 60px 0;
`

const LogoIcon = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: ${({theme}) => theme.bg6};
`;

export function LoadingView({ children, onDismiss }: { children: any; onDismiss: () => void }) {
  const { t } = useTranslation()
  return (
    <ConfirmOrLoadingWrapper>
      <RowBetween>
        <div />
        <CloseIcon onClick={onDismiss} />
      </RowBetween>
      <ConfirmedIcon>
        <LogoIcon src={LoadingLogoIcon} alt="loader" />
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
  const theme = useContext(ThemeContext);

  return (
    <ConfirmOrLoadingWrapper>
      <RowBetween>
        <div />
        <CloseIcon onClick={onDismiss} />
      </RowBetween>
      <ConfirmedIcon>
        <ArrowUpCircle strokeWidth={0.5} size={150} color={theme.green2} />
      </ConfirmedIcon>
      <AutoColumn gap="100px" justify={'center'}>
        {children}
        {chainId && hash && (
          <ExternalLink href={getEtherscanLink(chainId, hash, 'transaction')} style={{ marginLeft: '4px' }}>
            <ButtonGreen>
              {t("View transaction on wanscan.org")}
            </ButtonGreen>
          </ExternalLink>
        )}
      </AutoColumn>
    </ConfirmOrLoadingWrapper>
  )
}
