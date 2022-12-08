import { Box as RebassBox } from 'rebass'
import styled, { css } from 'styled-components'
import { isMobile } from 'react-device-detect'

const panelPseudo = css`
  :after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 10px;
  }

  @media only screen and (min-width: 40em) {
    :after {
      content: unset;
    }
  }
`

const Panel = styled(RebassBox)`
  position: relative;
  /* padding: 0 1.25rem; */
  // background: rgba(255, 255, 255, 0.05);
  background-color: ${({ theme }) => theme.bg6};
  // border: 1px solid rgba(255, 255, 255, 0.2);
  width: ${isMobile ? '100%' : '35%'};
  max-width: 500px;
  height: 395px;
  display: flex;
  padding: 10px 0;
  flex-direction: column;
  justify-content: flex-start;
  border-radius: 24px;
  margin-right: 40px!important;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.05); /* box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.01), 0px 16px 24px rgba(0, 0, 0, 0.01), 0px 24px 32px rgba(0, 0, 0, 0.01); */
  :hover {
    cursor: ${({ hover }) => hover && 'pointer'};
    border: ${({ hover, theme }) => hover && '1px solid' + theme.bg5};
  }

  ${props => props.background && `background-color: ${props.theme.advancedBG};`}

  ${props => (props.area ? `grid-area: ${props.area};` : null)}

  ${props =>
    props.grouped &&
    css`
      @media only screen and (min-width: 40em) {
        &:first-of-type {
          border-radius: 20px 20px 0 0;
        }
        &:last-of-type {
          border-radius: 0 0 20px 20px;
        }
      }
    `}

  ${props =>
    props.rounded &&
    css`
      border-radius: 8px;
      @media only screen and (min-width: 40em) {
        border-radius: 10px;
      }
    `};

  ${props => !props.last && panelPseudo}
`

export default Panel
