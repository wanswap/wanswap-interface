import React from 'react'
import styled from 'styled-components'
import { isMobile } from 'react-device-detect'

export const BodyWrapper = styled.div`
  position: relative;
  max-width: 500px;
  width: 100%;
  background: ${({theme}) => theme.bg6};
  box-shadow: 0 0 50px 0 #000;
  border-radius: 16px;
  padding: 15px;
`

export const BodyWrapperV1 = styled.div`
  position: relative;
  width: 100%;
  background: rgba(0, 0, 0, 0.05);
  box-shadow: 0px 0px 50px 0px rgba(0, 0, 0, 0.2);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 15px 0;
  backdrop-filter: blur(10px);
`

export const BodyWrapperV2 = styled.div`
  position: relative;
  width: ${isMobile ? '100%' : '500px'};
  min-height: 363px;
  background: rgba(23, 23, 23, 1);
  /* box-shadow: 10px 8px 15px 5px #0000002e, -8px -10px 15px 5px #ffffff90; */
  box-shadow: 0px 0px 50px 0px rgba(0, 0, 0, 0.2);
  border-radius: 24px;
  padding: 15px;
`

export const BodyWrapperV3 = styled.div`
  position: relative;
  width: 100%;
  background: ${({theme}) => theme.black1};
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 15px 0;
  backdrop-filter: blur(10px);
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper id="body-wrapper">{children}</BodyWrapper>
}

export function AppBodyV1({ children }: { children: React.ReactNode }) {
  return <BodyWrapperV1 id="body-wrapper">{children}</BodyWrapperV1>
}

export function AppBodyV3({ children }: { children: React.ReactNode }) {
  return <BodyWrapperV3 id="body-wrapper">{children}</BodyWrapperV3>
}

export function AppBodyV2({ children }: { children: React.ReactNode }) {
  return <BodyWrapperV2 id="body-wrapper">{children}</BodyWrapperV2>
}
