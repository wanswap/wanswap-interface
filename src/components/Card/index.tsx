import React from 'react'
import styled from 'styled-components'
import { CardProps, Text } from 'rebass'
import { Box } from 'rebass/styled-components'

const Card = styled(Box)<{ padding?: string; border?: string; borderRadius?: string }>`
  width: 100%;
  border-radius:10px;
  padding: 1.25rem;
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  
`
export default Card

export const LightCard = styled(Card)`
  border: 0;
  background-color: rgb(26, 61, 119);
`

export const GreyCard = styled(Card)`
  background-color: rgba(1,1,1,0.5);
`

export const GreyLightCard = styled(Card)`
  background-color: rgba(255, 255, 255, 0.1);
`

export const NoBgCard = styled(Card)`
  background-color: none;
  border-radius: 16px;
  border: 1px solid ${({theme}) => theme.bg7};
`

export const BlackCard = styled(Card)`
  background-color: ${({theme}) => theme.bg6};
`

export const Black1Card = styled(Card)`
  background-color: ${({theme}) => theme.black1};
`

export const OutlineCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.bg3};
`

export const YellowCard = styled(Card)`
  background-color: rgba(243, 132, 30, 0.05);
  color: ${({ theme }) => theme.yellow2};
  font-weight: 500;
`

export const PinkCard = styled(Card)`
  background-color: rgba(255, 0, 122, 0.03);
  color: ${({ theme }) => theme.primary1};
  font-weight: 500;
`

const BlueCardStyled = styled(Card)`
  background-color: ${({ theme }) => theme.primary5};
  color: ${({ theme }) => theme.primary1};
  border-radius:10px;
  width: fit-content;
`

export const BlueCard = ({ children, ...rest }: CardProps) => {
  return (
    <BlueCardStyled {...rest}>
      <Text fontWeight={500} color="#2172E5">
        {children}
      </Text>
    </BlueCardStyled>
  )
}
