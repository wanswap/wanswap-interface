import React, { useCallback, useMemo } from 'react'
import { Text } from 'rebass'
import { useActiveWeb3React } from '../../hooks'
import Column from '../Column'
import styled from 'styled-components'
import { V1_FARM_PAIRS, V1FarmPairInfo } from '../../constants/abis/bridge'
import { useSelectedTokenList } from '../../state/lists/hooks'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import { Check } from 'react-feather'

const Menu = styled.div<{height:number}>`
  width: 100%;
  height: ${({height}) => height}px;
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }
`

const MenuItem = styled.div`
  display: flex;
  margin: 0 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px 0;
  align-items: center;
  justify-content: space-between;
`;

const MenuItemLeft = styled.div`
  display: flex;
  align-items: center;
`;

const CurrencyLogo = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  z-index: 1;
`;

function CurrencyRow({
  pairInfo,
  index,
  onSelect,
  curSelectedIndex,
}: {
  pairInfo: V1FarmPairInfo
  index: number
  onSelect: () => void
  curSelectedIndex: number
}) {
  // only show add or remove buttons if not on selected list
  const [currency1Name, currency2Name] = pairInfo.name.split('/');
  const { chainId } = useActiveWeb3React()
  const networkId = chainId ? chainId : 888;
  const selectedTokenList = Object.values(useSelectedTokenList()[networkId])
  const pair = V1_FARM_PAIRS[networkId][index];
  
  const [currency1Info, currency2Info]:[WrappedTokenInfo | undefined, WrappedTokenInfo | undefined] = [selectedTokenList.find(v => v.address === pair.token0.address), selectedTokenList.find(v => v.address === pair.token1.address)]
  console.log('!!! currency1Info', currency1Info, currency2Info, selectedTokenList)
  return (
    <MenuItem
      onClick={() => curSelectedIndex === index ? null : onSelect()}
    >
      <MenuItemLeft>
        <CurrencyLogo src={currency1Info?.tokenInfo.logoURI} style={{zIndex: 2}} alt="" />
        <CurrencyLogo src={currency2Info?.tokenInfo.logoURI} style={{marginLeft: '-6px'}} alt="" />
        <Column>
          <Text title={pairInfo.name} fontWeight={500} fontSize={'22px'} marginLeft={'10px'}>
            {currency1Name}&nbsp;/&nbsp;{currency2Name}
          </Text>
        </Column>
      </MenuItemLeft>
      { curSelectedIndex === index ? <Check size={'30px'} color={'#00A045'} /> : null }
    </MenuItem>
  )
}

export default function PairList({
  height,
  onCurrencySelect,
  curSelectedIndex,
  searchQuery
}: {
  height: number
  onCurrencySelect: (index: number) => void
  curSelectedIndex: number
  searchQuery: string
}) {
  const { chainId } = useActiveWeb3React()
  const itemData = useMemo(() => chainId ? V1_FARM_PAIRS[chainId] : [], [chainId]);
  const filterList = useMemo(() => {
    return itemData.filter(v => {
      return v.name.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase());
    })
  }, [searchQuery, itemData]);

  const Row = useCallback(
    ({ data, index }) => {
      const handleSelect = () => onCurrencySelect(index)
      return (
        <CurrencyRow
          pairInfo={data}
          index={index}
          curSelectedIndex={curSelectedIndex}
          onSelect={handleSelect}
        />
      )
    },
    [curSelectedIndex, onCurrencySelect]
  )

  return (
    <Menu height={height}>
      {
        filterList.map((data:V1FarmPairInfo, index:number) => Row({data, index}))
      }
    </Menu>
  )
}
