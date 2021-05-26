import { transparentize } from 'polished'
import React, { useMemo } from 'react'
import styled, {
  ThemeProvider as StyledComponentsThemeProvider,
  createGlobalStyle,
  css,
  DefaultTheme
} from 'styled-components'
/*import { useIsDarkMode } from '../state/user/hooks'*/
import { Text, TextProps } from 'rebass'
import { Colors } from './styled'

export * from './components'

const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 720,
  upToMedium: 960,
  upToLarge: 1280
}

const mediaWidthTemplates: { [width in keyof typeof MEDIA_WIDTHS]: typeof css } = Object.keys(MEDIA_WIDTHS).reduce(
  (accumulator, size) => {
    ; (accumulator as any)[size] = (a: any, b: any, c: any) => css`
      @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
        ${css(a, b, c)}
      }
    `
    return accumulator
  },
  {}
) as any

const white = '#FFFFFF'
const black = '#313131'

export function colors(darkMode: boolean): Colors {
  return {
    // base
    white,
    black,

    // text
    text1: darkMode ? '#FFFFFF' : '#313131',
    text2: darkMode ? '#C3C5CB' : '#565A69',
    text3: darkMode ? '#6C7284' : '#888D9B',
    text4: darkMode ? '#565A69' : '#C3C5CB',
    text5: darkMode ? '#2C2F36' : '#EDEEF2',

    // backgrounds / greys
    bg1: darkMode ? '#212429' : '#FFFFFF',
    bg2: darkMode ? '#2C2F36' : '#F7F8FA',
    bg3: darkMode ? '#40444F' : '#EDEEF2',
    bg4: darkMode ? '#565A69' : '#CED0D9',
    bg5: darkMode ? '#6C7284' : '#888D9B',

    //specialty colors
    modalBG: darkMode ? 'rgba(0,0,0,.425)' : 'rgba(0,0,0,0.3)',
    advancedBG: darkMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.6)',

    //primary colors
    primary1: darkMode ? '#2172E5' : '#ff007a',
    primary2: darkMode ? '#3680E7' : '#FF8CC3',
    primary3: darkMode ? '#4D8FEA' : '#FF99C9',
    primary4: darkMode ? '#376bad70' : '#F6DDE8',
    primary5: darkMode ? '#153d6f70' : '#FDEAF1',

    // color text
    primaryText1: darkMode ? '#6da8ff' : '#ff007a',

    // secondary colors
    secondary1: darkMode ? '#2172E5' : '#ff007a',
    secondary2: darkMode ? '#17000b26' : '#F6DDE8',
    secondary3: darkMode ? '#17000b26' : '#FDEAF1',

    // other
    red1: '#FF6871',
    red2: '#F82D3A',
    green1: '#27AE60',
    yellow1: '#FFE270',
    yellow2: '#F3841E',
    blue1: '#2172E5'

    // dont wanna forget these blue yet
    // blue4: darkMode ? '#153d6f70' : '#C4D9F8',
    // blue5: darkMode ? '#153d6f70' : '#EBF4FF',
  }
}

export function theme(darkMode: boolean): DefaultTheme {
  return {
    ...colors(darkMode),

    grids: {
      sm: 8,
      md: 12,
      lg: 24
    },

    //shadows
    shadow1: darkMode ? '#000' : '#2F80ED',

    // media queries
    mediaWidth: mediaWidthTemplates,

    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = true;/*useIsDarkMode()*/

  const themeObject = useMemo(() => theme(darkMode), [darkMode])

  return <StyledComponentsThemeProvider theme={themeObject}>{children}</StyledComponentsThemeProvider>
}

const TextWrapper = styled(Text) <{ color: keyof Colors }>`
  color: ${({ color, theme }) => (theme as any)[color]};
`

export const TYPE = {
  main(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text2'} {...props} />
  },
  link(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
  },
  black(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text1'} {...props} />
  },
  white(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'white'} {...props} />
  },
  body(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={16} color={'text1'} {...props} />
  },
  largeHeader(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={24} {...props} />
  },
  mediumHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={20} {...props} />
  },
  subHeader(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={14} {...props} />
  },
  small(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={11} {...props} />
  },
  blue(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
  },
  yellow(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'yellow1'} {...props} />
  },
  darkGray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text3'} {...props} />
  },
  gray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'bg3'} {...props} />
  },
  italic(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={12} fontStyle={'italic'} color={'text2'} {...props} />
  },
  error({ error, ...props }: { error: boolean } & TextProps) {
    return <TextWrapper fontWeight={500} color={error ? 'red1' : 'text2'} {...props} />
  }
}

export const FixedGlobalStyle = createGlobalStyle`
html, input, textarea, button {
  font-family: 'Inter', sans-serif;
  font-display: fallback;
}
@supports (font-variation-settings: normal) {
  html, input, textarea, button {
    font-family: 'Inter var', sans-serif;
  }
}

html,
body {
  margin: 0;
  padding: 0;
}

 a {
   color: ${colors(false).blue1}; 
 }

* {
  box-sizing: border-box;
}

button {
  user-select: none;
}

html {
  font-size: 16px;
  font-variant: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  font-feature-settings: 'ss01' on, 'ss02' on, 'cv01' on, 'cv03' on;
  
  background: url(images/hexagons.png), -moz-linear-gradient(45deg, rgba(16, 114, 189, 1) 0%, rgba(16, 114, 189, 1) 23%, rgba(2, 41, 97, 1) 48%, rgba(0, 4, 38, 1) 73%, rgba(0, 0, 21, 1) 100%);
			background: url(images/hexagons.png),-webkit-linear-gradient(45deg, rgba(16, 114, 189, 1) 0%, rgba(16, 114, 189, 1) 23%, rgba(2, 41, 97, 1) 48%, rgba(0, 4, 38, 1) 73%, rgba(0, 0, 21, 1) 100%);
			background: url(images/hexagons.png),-o-linear-gradient(45deg, rgba(16, 114, 189, 1) 0%, rgba(16, 114, 189, 1) 23%, rgba(2, 41, 97, 1) 48%, rgba(0, 4, 38, 1) 73%, rgba(0, 0, 21, 1) 100%);
			background: url(images/hexagons.png),-ms-linear-gradient(45deg, rgba(16, 114, 189, 1) 0%, rgba(16, 114, 189, 1) 23%, rgba(2, 41, 97, 1) 48%, rgba(0, 4, 38, 1) 73%, rgba(0, 0, 21, 1) 100%);
			background: url(images/hexagons.png),linear-gradient(45deg, rgba(16, 114, 189, 1) 0%, rgba(16, 114, 189, 1) 23%, rgba(2, 41, 97, 1) 48%, rgba(0, 4, 38, 1) 73%, rgba(0, 0, 21, 1) 100%);
      background-attachment: fixed;		
}
div[data-reach-dialog-content] a
{
  color:#FFE600 ;
}

#center-logo
{
  margin-bottom:40px;
  zoom:0.8;
  position: relative;
    z-index: 1;
}

#animate-zoom
{
  display:inline-block;
  
  animation: blink-animation 0.4s infinite;
}
@keyframes blink-animation {
  form {
    transform:scale(1)
  }
  to {
    transform:scale(1.3)
  }
}


.token-amount-input::placeholder
{
  color:rgba(255,255,255,0.5) !important;
}

#shadow_bottom
		{
			background:url(./images/shadow_bottom.png) repeat-x;
			width:100%;
			height:860px;
			position:fixed;
			bottom:0;
			z-index:-1;
    }
    
@media only screen and (max-width: 960px) {
  #shadow_bottom
		{
      opacity:0.6;
    }
    #center-logo
    {
      display:none
    }

    #logo-symbol
    {
      display:none;
    }
    #logo-full
    {
      display:block !important;
      margin:0 auto;
      margin-top:20px;
    }
    #logo-wrapper
    {
      margin-right:0px;
    }
    #body-wrapper
    {
      box-shadow: 0 0 50px #01001de6;
    }
}

#stake-liquidity-token div:first-child
{
  background: transparent !important;
}

div[data-reach-dialog-overlay] {
  background:rgba(20,30,75,0.80) !important;

}
div[data-reach-dialog-content]{
  box-shadow: 0 0 100px #01001de6 !important;
}
.bfqITV
{
  border-radius:0 !important;
}

`

export const ThemedGlobalStyle = createGlobalStyle`
html {
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg2};
}

body {
  min-height: 100vh;
  background-position: 0 -30vh;
  background-repeat: no-repeat;
  background-image: ${({ theme }) =>
    `radial-gradient(50% 50% at 50% 50%, ${transparentize(0.9, theme.primary1)} 0%, ${transparentize(
      1,
      theme.bg1
    )} 100%)`};
}
`
