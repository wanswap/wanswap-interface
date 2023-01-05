import { Currency, CurrencyAmount, Fraction, Percent } from '@wanswap/sdk'
import React, { useContext } from 'react'
import { Text } from 'rebass'
import { ButtonGreen } from '../../components/Button'
import { RowBetween, RowFixed } from '../../components/Row'
import { Field } from '../../state/mint/actions'
import { TYPE } from '../../theme'
import { useTranslation } from 'react-i18next'
import { NoBgCard } from '../../components/Card';
import { isMobile } from 'react-device-detect'
import styled, { css, ThemeContext } from 'styled-components'

const RowFixedMobile = styled(RowFixed)`
  ${
    isMobile && css`
      align-items: flex-end;
    `
  }
`;

const Row = styled.div`
  display: flex;
  align-items: flex-end;
`;

export function ConfirmAddModalBottom({
  noLiquidity,
  price,
  currencies,
  parsedAmounts,
  poolTokenPercentage,
  onAdd
}: {
  noLiquidity?: boolean
  price?: Fraction
  currencies: { [field in Field]?: Currency }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  poolTokenPercentage?: Percent
  onAdd: () => void
}) {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext);
  return (
    <>
      <NoBgCard>
        <RowBetween>
          <TYPE.body>{currencies[Field.CURRENCY_A]?.symbol} Deposited</TYPE.body>
          <RowFixedMobile>
            <TYPE.yellow3>{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</TYPE.yellow3>
            <TYPE.body fontSize={12} color={theme.text6}>&nbsp;{currencies[Field.CURRENCY_A]?.symbol}</TYPE.body>
          </RowFixedMobile>
        </RowBetween>
      </NoBgCard>
      <NoBgCard>
        <RowBetween>
          <TYPE.body>{currencies[Field.CURRENCY_B]?.symbol} Deposited</TYPE.body>
          <RowFixedMobile>
            <TYPE.yellow3>{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</TYPE.yellow3>
            <TYPE.body fontSize={12} color={theme.text6}>&nbsp;{currencies[Field.CURRENCY_B]?.symbol}</TYPE.body>
          </RowFixedMobile>
        </RowBetween>
      </NoBgCard>
      <NoBgCard>
        <RowBetween>
          <TYPE.body>Rates</TYPE.body>
          <Row>
            <TYPE.yellow3>1</TYPE.yellow3>
            <TYPE.body fontSize={12} color={theme.text6}>&nbsp;{currencies[Field.CURRENCY_A]?.symbol}</TYPE.body>
            &nbsp;=&nbsp;
            <TYPE.yellow>{price?.toSignificant(4)}</TYPE.yellow>
            <TYPE.body fontSize={12} color={theme.text6}>&nbsp;{currencies[Field.CURRENCY_B]?.symbol}</TYPE.body>
          </Row>
        </RowBetween>
        <RowBetween style={{ justifyContent: 'flex-end' }}>
          <Row>
            <TYPE.yellow3>1</TYPE.yellow3>
            <TYPE.body fontSize={12} color={theme.text6}>&nbsp;{currencies[Field.CURRENCY_B]?.symbol}</TYPE.body>
            &nbsp;=&nbsp;
            <TYPE.yellow>{price?.invert().toSignificant(4)}</TYPE.yellow>
            <TYPE.body fontSize={12} color={theme.text6}>&nbsp;{currencies[Field.CURRENCY_A]?.symbol}</TYPE.body>
          </Row>
        </RowBetween>
      </NoBgCard>
      <NoBgCard>
        <RowBetween>
          <TYPE.body>{t('shareOfPool')}:</TYPE.body>
          <TYPE.yellow3>{noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%</TYPE.yellow3>
        </RowBetween>
      </NoBgCard>
      <ButtonGreen style={{ margin: '20px 0 0 0' }} onClick={onAdd}>
        <Text fontWeight={500} fontSize={20}>
          {noLiquidity ? t('createPoolSupply') : t('confirmSupply')}
        </Text>
      </ButtonGreen>
    </>
  )
}
