import { Currency, Percent, Price } from '@wanswap/sdk'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { AutoColumn } from '../../components/Column'
import { AutoRow } from '../../components/Row'
import { ONE_BIPS } from '../../constants'
import { Field } from '../../state/mint/actions'
import { TYPE } from '../../theme'
import { isMobile } from 'react-device-detect'
import styled, { css } from 'styled-components'

const AutoRowMobile = styled(AutoRow)`
  ${
    isMobile && css`
      display: flex;
      flex-direction: column;
    `
  }
`;

const AutoColumnMobile = styled(AutoColumn)`
  justify-content: center;

  ${
    isMobile && css`
      display: flex;
      justify-content: space-between;
      padding: 0 1rem;
      width: 100%;
      flex-direction: row-reverse;
    `
  }
`;

const TextMobile = styled(Text)`
  font-weight: 500;
  font-size: 14px;
  color: ${({ theme }) => isMobile ? theme.white1 : theme.text2 };
`;

export function PoolPriceBar({
  currencies,
  noLiquidity,
  poolTokenPercentage,
  price
}: {
  currencies: { [field in Field]?: Currency }
  noLiquidity?: boolean
  poolTokenPercentage?: Percent
  price?: Price
}) {
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()
  return (
    <AutoColumn gap="md">
      <AutoRowMobile justify="space-around" gap="4px">
        <AutoColumnMobile>
          <TYPE.yellow3 color={isMobile ? theme.primary6 : theme.yellow3}>{price?.toSignificant(6) ?? '-'}</TYPE.yellow3>
          <TextMobile pt={1}>
            {currencies[Field.CURRENCY_B]?.symbol} per {currencies[Field.CURRENCY_A]?.symbol}
          </TextMobile>
        </AutoColumnMobile>
        <AutoColumnMobile>
          <TYPE.yellow3 color={isMobile ? theme.primary6 : theme.yellow3}>{price?.invert()?.toSignificant(6) ?? '-'}</TYPE.yellow3>
          <TextMobile pt={1}>
            {currencies[Field.CURRENCY_A]?.symbol} per {currencies[Field.CURRENCY_B]?.symbol}
          </TextMobile>
        </AutoColumnMobile>
        <AutoColumnMobile>
          <TYPE.yellow3 color={isMobile ? theme.primary6 : theme.yellow3}>
            {noLiquidity && price
              ? '100'
              : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'}
            %
          </TYPE.yellow3>
          <TextMobile pt={1}>
            {t('shareOfPool')}
          </TextMobile>
        </AutoColumnMobile>
      </AutoRowMobile>
    </AutoColumn>
  )
}
