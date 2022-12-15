import { ChainId } from '@wanswap/sdk'
import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import Modal from '../Modal'
import { ExternalLink, TYPE } from '../../theme'
import { Text } from 'rebass'
import { CloseIcon } from '../../theme/components'
import { RowBetween } from '../Row'
import { AlertTriangle, ArrowUpCircle } from 'react-feather'
import { ButtonPrimary, ButtonGreen } from '../Button'
import { AutoColumn, ColumnCenter } from '../Column'
import LoadingLogoIcon from '../../assets/images/png/loading_logo.png';

import { getEtherscanLink } from '../../utils'
import { useActiveWeb3React } from '../../hooks'
import { useTranslation } from 'react-i18next'

const Wrapper = styled.div`
  width: 100%;
`
const Section = styled(AutoColumn)`
  padding: 24px;
`

const BottomSection = styled(Section)`
  background-color: ${({ theme }) => theme.bg2};
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`

const BottomSectionGapS = styled(BottomSection)`
  grid-row-gap: 0.5rem;
  background: none;
  padding-top: 0;
`;

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 60px 0;
`

const LogoIcon = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: ${({theme}) => theme.bg6};
`;

function ConfirmationPendingContent({ onDismiss, pendingText }: { onDismiss: () => void; pendingText: Array<string> }) {
  const {t} = useTranslation()
  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <div />
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <ConfirmedIcon>
          <LogoIcon src={LoadingLogoIcon} alt="loader" />
        </ConfirmedIcon>
        <AutoColumn gap="12px" justify={'center'}>
          <Text fontWeight={500} fontSize={20}>
            {t('waitingForConfirmation')}
          </Text>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.white fontWeight={600} fontSize={14} style={{display: 'flex'}}>
              {pendingText[0]}&nbsp;
              <TYPE.yellow3 fontWeight={600} fontSize={14}>
                {pendingText[1]}&nbsp;
              </TYPE.yellow3>
              {pendingText[2]}&nbsp;
              <TYPE.yellow3 fontWeight={600} fontSize={14}>
                {pendingText[3]}
              </TYPE.yellow3>
            </TYPE.white>
          </AutoColumn>
          <Text fontSize={12} color="#565A69" textAlign="center">
            {t('confirmThisTransaction')}
          </Text>
        </AutoColumn>
      </Section>
    </Wrapper>
  )
}

function TransactionSubmittedContent({
  onDismiss,
  chainId,
  hash
}: {
  onDismiss: () => void
  hash: string | undefined
  chainId: ChainId
}) {
  
  const { t } = useTranslation()
  const theme = useContext(ThemeContext);
  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <div />
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <ConfirmedIcon>
          <ArrowUpCircle strokeWidth={0.5} size={150} color={theme.green2} />
        </ConfirmedIcon>
        <AutoColumn gap="12px" justify={'center'}>
          <Text fontWeight={500} fontSize={20} color={theme.green2}>
            {t('transactionSubmitted')}
          </Text>
          {chainId && hash && (
            <ExternalLink href={getEtherscanLink(chainId, hash, 'transaction')} style={{width: '100%', textDecoration: 'none'}}>
              <ButtonGreen onClick={onDismiss} style={{ margin: '20px 0 0 0' }}>
                <Text fontWeight={500} fontSize={20} color="">
                  {t('viewOn')}
                </Text>
              </ButtonGreen>
            </ExternalLink>
          )}
        </AutoColumn>
      </Section>
    </Wrapper>
  )
}

export function ConfirmationModalContent({
  title,
  bottomContent,
  onDismiss,
  topContent
}: {
  title: string
  onDismiss: () => void
  topContent: () => React.ReactNode
  bottomContent: () => React.ReactNode
}) {
  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <Text fontWeight={500} fontSize={20}>
            {title}
          </Text>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        {topContent()}
      </Section>
      <BottomSectionGapS gap="20px">{bottomContent()}</BottomSectionGapS>
    </Wrapper>
  )
}

export function TransactionErrorContent({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  const theme = useContext(ThemeContext)
  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <Text fontWeight={500} fontSize={20}>
            Error
          </Text>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <AutoColumn style={{ marginTop: 20, padding: '2rem 0' }} gap="24px" justify="center">
          <AlertTriangle color={theme.red1} style={{ strokeWidth: 1.5 }} size={64} />
          <Text fontWeight={500} fontSize={16} color={theme.red1} style={{ textAlign: 'center', width: '85%' }}>
            {message}
          </Text>
        </AutoColumn>
      </Section>
      <BottomSection gap="12px">
        <ButtonPrimary onClick={onDismiss}>Dismiss</ButtonPrimary>
      </BottomSection>
    </Wrapper>
  )
}

interface ConfirmationModalProps {
  isOpen: boolean
  onDismiss: () => void
  hash: string | undefined
  content: () => React.ReactNode
  attemptingTxn: boolean
  pendingText: Array<string>
}

export default function TransactionConfirmationModal({
  isOpen,
  onDismiss,
  attemptingTxn,
  hash,
  pendingText,
  content
}: ConfirmationModalProps) {
  const { chainId } = useActiveWeb3React()

  if (!chainId) return null

  // confirmation screen
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90}>
      {attemptingTxn ? (
        <ConfirmationPendingContent onDismiss={onDismiss} pendingText={pendingText} />
      ) : hash ? (
        <TransactionSubmittedContent chainId={chainId} hash={hash} onDismiss={onDismiss} />
      ) : (
        content()
      )}
    </Modal>
  )
}
