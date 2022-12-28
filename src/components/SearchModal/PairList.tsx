import { Currency, ETHER, Token } from '@wanswap/sdk'
import React, { CSSProperties, MutableRefObject, useCallback, useMemo } from 'react'
import { FixedSizeList } from 'react-window'
import { Text } from 'rebass'
import { useActiveWeb3React } from '../../hooks'
import Column from '../Column'
import styled from 'styled-components'
import { V1_FARM_PAIRS } from '../../constants/abis/bridge'
import { useSelectedTokenList } from '../../state/lists/hooks'
import { WrappedTokenInfo } from '../../state/lists/hooks'

const MenuItem = styled.div`
  display: flex;
  margin: 0 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px 0;
  align-items: center;
`;

const CurrencyLogo = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  z-index: 1;
`;

function currencyKey(currency: Currency): string {
  return currency instanceof Token ? currency.address : currency === ETHER ? 'ETHER' : ''
}

function CurrencyRow({
  pairName,
  // onSelect,
  // isSelected,
  // otherSelected,
  style
}: {
  pairName: string
  // onSelect: () => void
  // isSelected: boolean
  // otherSelected: boolean
  style: CSSProperties
}) {
  // only show add or remove buttons if not on selected list
  const [currency1Name, currency2Name] = pairName.split('/');
  const { chainId } = useActiveWeb3React()
  const networkId = chainId ? chainId : 999;
  const selectedTokenList = Object.values(useSelectedTokenList()[networkId])
  const [currency1Info, currency2Info]:[WrappedTokenInfo | undefined, WrappedTokenInfo | undefined] = [selectedTokenList.find(v => v.symbol === currency1Name), selectedTokenList.find(v => v.symbol === currency2Name)]
  console.log('currency1Info', currency1Info, currency2Info)
  return (
    <MenuItem
      // onClick={() => (isSelected ? null : onSelect())}
      // onClick={() => onSelect()}
      // disabled={isSelected}
      // selected={otherSelected}
    >
      <CurrencyLogo src={currency1Info?.tokenInfo.logoURI} style={{zIndex: 2}} alt="" />
      <CurrencyLogo src={currency2Info?.tokenInfo.logoURI} style={{marginLeft: '-6px'}} alt="" />
      <Column>
        <Text title={pairName} fontWeight={500} fontSize={'22px'} marginLeft={'10px'}>
          {currency1Name}&nbsp;/&nbsp;{currency2Name}
        </Text>
      </Column>
    </MenuItem>
  )
}

export default function PairList({
  height,
  currencies,
  selectedCurrency,
  // onCurrencySelect,
  otherCurrency,
  fixedListRef,
  showETH
}: {
  height: number
  currencies: Currency[]
  selectedCurrency?: Currency | null
  // onCurrencySelect: (lpAddr: string) => void
  otherCurrency?: Currency | null
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  showETH: boolean
}) {
  const { chainId } = useActiveWeb3React()
  const itemData = useMemo(() => chainId ? V1_FARM_PAIRS[chainId] : [], [chainId])

  const Row = useCallback(
    ({ data, index, style }) => {
      // const currency: Currency = data[index]
      // const isSelected = Boolean(selectedCurrency && currencyEquals(selectedCurrency, currency))
      // const otherSelected = Boolean(otherCurrency && currencyEquals(otherCurrency, currency))
      // const handleSelect = () => onCurrencySelect(data[index].lpAddress)
      return (
        <CurrencyRow
          style={style}
          pairName={data[index].name}
          // isSelected={isSelected}
          // onSelect={handleSelect}
          // otherSelected={otherSelected}
        />
      )
    },
    // [ otherCurrency, selectedCurrency]
    []
  )

  const itemKey = useCallback((index: number, data: any) => currencyKey(data[index]), [])

  return (
    <FixedSizeList
      height={height}
      ref={fixedListRef as any}
      width="100%"
      itemData={itemData}
      itemCount={itemData.length}
      itemSize={56}
      itemKey={itemKey}
    >
      {Row}
    </FixedSizeList>
  )
}
