import React, { useCallback, useContext, useState } from 'react';
import { CurrencyAmount } from '@wanswap/sdk';
import { ThemeContext } from 'styled-components';
import { AppBodyV2 } from '../AppBody';
import { SwapPoolTabs } from '../../components/NavigationTabs';
import { ArrowWrapper, Wrapper } from '../../components/swap/styleds';
import { AutoColumn } from '../../components/Column';
import { ButtonLight } from '../../components/Button';
import { Field } from '../../state/swap/actions';
import CurrencyInputPanel from '../../components/CurrencyInputPanel';
import { AutoRow } from '../../components/Row';
import { useTranslation } from 'react-i18next';
import { maxAmountSpend } from '../../utils/maxAmountSpend';
import { ChevronDown, ChevronUp, LogIn } from 'react-feather';
import AdvancedSwapDetailsDropdown from '../../components/swap/AdvancedSwapDetailsDropdown';
import {
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState
} from '../../state/swap/hooks'
import styled from 'styled-components';

function ConvertWasp() {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  // swap state
  const { independentField, typedValue } = useSwapState();
  const {
    currencyBalances,
    currencies,
  } = useDerivedSwapInfo();
  const { onSwitchTokens, onCurrencySelection, onUserInput } = useSwapActionHandlers();
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;
  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT]);
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);
  const trade = undefined;
  console.log('approvalSubmitted', approvalSubmitted)

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: ''
  };

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  );

  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput]
  );

  const handleOutputSelect = useCallback(outputCurrency => onCurrencySelection(Field.OUTPUT, outputCurrency), [
    onCurrencySelection
  ]);

  const handleInputSelect = useCallback(
    inputCurrency => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
    },
    [onCurrencySelection]
  );
  const handleMaxInput = useCallback(() => {
    maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact())
  }, [maxAmountInput, onUserInput])
  
  return (
    <SwapCon>
      <AppBodyV2>
        <SwapPoolTabs active={'swap'} />
        <Wrapper id="swap-page">
          <AutoColumnCus gap={'md'}>
            <CurrencyInputPanel
              label={t('from')}
              value={formattedAmounts[Field.INPUT]}
              showMaxButton={false}
              currency={currencies[Field.INPUT]}
              onUserInput={handleTypeInput}
              onMax={handleMaxInput}
              onCurrencySelect={handleInputSelect}
              otherCurrency={currencies[Field.OUTPUT]}
              id="swap-currency-input"
            />
            <AutoColumn
              justify="space-between"
              style={{ marginTop: '-30px', marginBottom: '-30px', position: 'relative', zIndex: 2 }}
            >
              <AutoRow justify="center" style={{ padding: '0 1rem' }}>
                <ArrowWrapper
                  onClick={() => {
                    setApprovalSubmitted(false) // reset 2 step UI for approvals
                    onSwitchTokens()
                  }}
                  clickable
                  style={{
                    borderRadius: '50%',
                    border: '1px solid white',
                    padding: 5,
                    marginTop: 0,
                    marginBottom: 0,
                    width: 35,
                    height: 35,
                    lineHeight: '25px',
                    paddingTop: 10,
                    display: 'inline-flex'
                  }}
                >
                  <ChevronDown style={{ marginRight: '-5px' }} size="14" color={theme.text2} />
                  <ChevronUp size="14" color={theme.text2} />
                </ArrowWrapper>
              </AutoRow>
            </AutoColumn>
            <CurrencyInputPanel
              value={formattedAmounts[Field.OUTPUT]}
              onUserInput={handleTypeOutput}
              label={t('to')}
              showMaxButton={false}
              currency={currencies[Field.OUTPUT]}
              onCurrencySelect={handleOutputSelect}
              otherCurrency={currencies[Field.INPUT]}
              id="swap-currency-output-2"
            />
          </AutoColumnCus>
          <BottomGroupingCus
            showWrap={false}
          >
            <ButtonLight onClick={() => {}}>
              <LogIn style={{ marginRight: 5 }} size="18" color="#ffffff" /> {t('connectWallet')}
            </ButtonLight>
          </BottomGroupingCus>
        </Wrapper>
      </AppBodyV2>
      <AdvancedSwapDetailsDropdown trade={trade} />
    </SwapCon>
  )
}

const SwapCon = styled.div`
  position: relative;
`;

const AutoColumnCus = styled(AutoColumn)`
  grid-row-gap: 30px;
`;

const BottomGroupingCus = styled.div<{
  showWrap: boolean
}>`
  margin-top: ${({ showWrap }) => (showWrap ? '1rem' : '2rem')};
`

export default ConvertWasp;