import React, { RefObject, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
// import { useActiveWeb3React } from '../../hooks'
import { useSelectedListInfo } from '../../state/lists/hooks'
import { CloseIcon, LinkStyledButton, TYPE } from '../../theme'
import Card from '../Card'
import Column from '../Column'
import ListLogo from '../ListLogo'
import Modal from '../Modal';
import Row, { RowBetween } from '../Row'
import PairList from './PairList'
import SortButton from './SortButton'
import { PaddedColumn, SearchInput, Separator } from './styleds'
import AutoSizer from 'react-virtualized-auto-sizer'

interface CurrencySearchProps {
  isOpen: boolean
  onDismiss: () => void
  onCurrencySelect: (addr: string) => void
  curSelectedIndex: string | undefined | null
  onChangeList: () => void
}

export function LPPairSearchModal({
  onCurrencySelect,
  curSelectedIndex,
  onDismiss,
  isOpen,
  onChangeList
}: CurrencySearchProps) {
  const { t } = useTranslation()
  // const { chainId } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

  const [searchQuery, setSearchQuery] = useState<string>('')
  const [invertSearchOrder, setInvertSearchOrder] = useState<boolean>(false)

  const handleCurrencySelect = useCallback(
    (addr:string) => {
      onCurrencySelect(addr)
      onDismiss()
    },
    [onDismiss, onCurrencySelect]
  )

  // clear the input on open
  useEffect(() => {
    if (isOpen) setSearchQuery('')
  }, [isOpen])

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()
  const handleInput = useCallback(event => {
    const input = event.target.value.toLowerCase().trim()
    setSearchQuery(input)
  }, [])

  const selectedListInfo = useSelectedListInfo()

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={80} minHeight={80}>
      <Column style={{ width: '100%', flex: '1 1' }}>
        <PaddedColumn gap="14px">
          <RowBetween>
            <Text fontWeight={500} fontSize={16}>
              Select WanSwap V1 LP token
            </Text>
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
          <SearchInput
            type="text"
            id="token-search-input"
            placeholder={t('Search LP token')}
            value={searchQuery}
            ref={inputRef as RefObject<HTMLInputElement>}
            onChange={handleInput}
          />
          <RowBetween>
            <Text color={theme.primary6} fontSize={14} fontWeight={500}>
              LP token Name
            </Text>
            <SortButton ascending={invertSearchOrder} toggleSortOrder={() => setInvertSearchOrder(iso => !iso)} />
          </RowBetween>
        </PaddedColumn>

        <Separator />

        <div style={{ flex: '1' }}>
          <AutoSizer disableWidth>
            {({ height }) => (
              <PairList
                height={height}
                onCurrencySelect={handleCurrencySelect}
                curSelectedIndex={curSelectedIndex}
                searchQuery={searchQuery}
              />
            )}
          </AutoSizer>
        </div>

        <Separator />
        <Card>
          <RowBetween>
            {selectedListInfo.current ? (
              <Row>
                {selectedListInfo.current.logoURI ? (
                  <ListLogo
                    style={{ marginRight: 12 }}
                    logoURI={selectedListInfo.current.logoURI}
                    alt={`${selectedListInfo.current.name} list logo`}
                  />
                ) : null}
                <TYPE.main id="currency-search-selected-list-name">{selectedListInfo.current.name}</TYPE.main>
              </Row>
            ) : null}
            <LinkStyledButton
              style={{ fontWeight: 500, color: theme.text2, fontSize: 16 }}
              onClick={onChangeList}
              id="currency-search-change-list-button"
            >
              {selectedListInfo.current ? 'Change' : 'Select'}
            </LinkStyledButton>
          </RowBetween>
        </Card>
      </Column>
    </Modal>
  )
}
