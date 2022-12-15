import { Currency, CurrencyAmount, Fraction, Percent } from '@wanswap/sdk'
import React from 'react'
import { Text } from 'rebass'
import { ButtonGreen } from '../../components/Button'
import { RowBetween, RowFixed } from '../../components/Row'
import CurrencyLogo from '../../components/CurrencyLogo'
import { Field } from '../../state/mint/actions'
import { TYPE } from '../../theme'
import { useTranslation } from 'react-i18next'
import { NoBgCard } from '../../components/Card';

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
  return (
    <>
      <NoBgCard>
        <RowBetween>
          <TYPE.body>{currencies[Field.CURRENCY_A]?.symbol} Deposited</TYPE.body>
          <RowFixed>
            <CurrencyLogo currency={currencies[Field.CURRENCY_A]} style={{ marginRight: '8px' }} />
            <TYPE.body>{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</TYPE.body>
          </RowFixed>
        </RowBetween>
      </NoBgCard>
      <NoBgCard>
        <RowBetween>
          <TYPE.body>{currencies[Field.CURRENCY_B]?.symbol} Deposited</TYPE.body>
          <RowFixed>
            <CurrencyLogo currency={currencies[Field.CURRENCY_B]} style={{ marginRight: '8px' }} />
            <TYPE.body>{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</TYPE.body>
          </RowFixed>
        </RowBetween>
      </NoBgCard>
      <NoBgCard>
        <RowBetween>
          <TYPE.body>Rates</TYPE.body>
          <TYPE.body>
            {`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(4)} ${
              currencies[Field.CURRENCY_B]?.symbol
            }`}
          </TYPE.body>
        </RowBetween>
      </NoBgCard>
      <NoBgCard>
        <RowBetween style={{ justifyContent: 'flex-end' }}>
          <TYPE.body>
            {`1 ${currencies[Field.CURRENCY_B]?.symbol} = ${price?.invert().toSignificant(4)} ${
              currencies[Field.CURRENCY_A]?.symbol
            }`}
          </TYPE.body>
        </RowBetween>
      </NoBgCard>
      <NoBgCard>
        <RowBetween>
          <TYPE.body>{t('shareOfPool')}:</TYPE.body>
          <TYPE.body>{noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%</TYPE.body>
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
