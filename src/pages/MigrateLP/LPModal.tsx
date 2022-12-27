import React from 'react'
import styled, { css } from 'styled-components'
import { isMobile } from 'react-device-detect'
import '@reach/dialog/styles.css'
import { animated, useTransition, useSpring } from 'react-spring'
import { DialogOverlay, DialogContent } from '@reach/dialog'
import { transparentize } from 'polished'
import { useGesture } from 'react-use-gesture';
import { TYPE } from '../../theme';
import { ReactComponent as Close } from '../../assets/svg/close.svg';

const CloseSvg = styled(Close)`
  cursor: pointer;
`;

const AnimatedDialogOverlay = animated(DialogOverlay)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogOverlay = styled(AnimatedDialogOverlay)`
  &[data-reach-dialog-overlay] {
    z-index: 2;
    background-color: transparent;
    overflow: hidden;

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: ${({ theme }) => theme.modalBG};
  }
`

const AnimatedDialogContent = animated(DialogContent)
// destructure to not pass custom props to Dialog DOM element
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogContent = styled(({ bg, minHeight, maxHeight, mobile, isOpen, enlarge, border, borderRadius, ...rest }) => (
  <AnimatedDialogContent {...rest} />
)).attrs({
  'aria-label': 'dialog'
})`
  overflow-y: ${({ mobile }) => (mobile ? 'scroll' : 'hidden')};

  &[data-reach-dialog-content] {
    margin: 0 0 2rem 0;
    border: none;
    background-color: #171717;
    box-shadow: 0 4px 8px 0 ${({ theme }) => transparentize(0.95, theme.shadow1)};
    padding: 0px;
    width: 620px;
    max-width: 620px;
    overflow-y: ${({ mobile }) => (mobile ? 'scroll' : 'hidden')};
    overflow-x: hidden;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    padding: 32px 40px;
    ${({ theme, mobile }) => theme.mediaWidth.upToSmall`
      width:  85vw;
      ${mobile &&
        css`
          width: 100vw;
          border-radius:10px;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        `}
    `}
  }
`;

const ModalTop = styled.div`
  display: flex;
  justify-content: space-between;
`;

interface ModalProps {
  isOpen: boolean
  onDismiss: () => void
  children?: React.ReactNode
  title?: string
}

export default function LpModal({
  isOpen,
  onDismiss,
  children,
  title = ''
}: ModalProps) {
  const fadeTransition = useTransition(isOpen, null, {
  config: { duration: 200 },
  from: { opacity: 0 },
  enter: { opacity: 1 },
  leave: { opacity: 0 }
})

const [{ y }, set] = useSpring(() => ({ y: 0, config: { mass: 1, tension: 210, friction: 20 } }))
const bind = useGesture({
  onDrag: state => {
    set({
      y: state.down ? state.movement[1] : 0
    })
    if (state.movement[1] > 300 || (state.velocity > 3 && state.direction[1] > 0)) {
      onDismiss()
    }
  }
})

  return (
    <>
    {fadeTransition.map(
      ({ item, key, props }) =>
        item && (
          <StyledDialogOverlay key={key} style={props} onDismiss={onDismiss}>
            <StyledDialogContent
              {...(isMobile
                ? {
                    ...bind(),
                    style: { transform: y.interpolate(y => `translateY(${y > 0 ? y : 0}px)`) }
                  }
                : {})}
              aria-label="dialog content"
              mobile={isMobile}
            >
              {title && <ModalTop>
                  <TYPE.white fontSize={'22px'}>{title}</TYPE.white>
                  <CloseSvg onClick={onDismiss} />
                </ModalTop>}
              {children}
            </StyledDialogContent>
          </StyledDialogOverlay>
        )
    )}
  </>
  )
}
