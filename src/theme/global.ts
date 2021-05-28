import { createGlobalStyle } from 'styled-components'
import theme from './index'

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Montserrat', sans-serif;
  }

  .euiButton {
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    text-transform: uppercase;

    &:hover,
    &:focus {
      transform: none !important;
      text-decoration: none !important;
    }

    &.euiButton--primary {
      border-color: ${theme.primary};

      &:hover,
      &:focus {
        border-color: ${theme.secondary};
      }
    }

    &.euiButton--primary.euiButton--fill {
      background-color: ${theme.primary};

      &:hover,
      &:focus {
        background-color: ${theme.secondary};
        border-color: ${theme.secondary};
      }
    }
  }
`

export default GlobalStyle
