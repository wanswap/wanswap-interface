import React, { useContext } from 'react'
import { Text } from 'rebass'
import styled from 'styled-components'
import { RowFixed } from '../Row'
import { ThemeContext } from 'styled-components';

export const FilterWrapper = styled(RowFixed)`
  padding: 8px;
  background-color: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text1};
  border-radius:10px;
  user-select: none;
  & > * {
    user-select: none;
  }
  :hover {
    cursor: pointer;
  }
`

export default function SortButton({
  toggleSortOrder,
  ascending
}: {
  toggleSortOrder: () => void
  ascending: boolean
}) {
  const theme = useContext(ThemeContext);
  return (
    <FilterWrapper onClick={toggleSortOrder}>
      <Text color={theme.primary6} fontSize={14} fontWeight={500}>
        {ascending ? '↑' : '↓'}
      </Text>
    </FilterWrapper>
  )
}
