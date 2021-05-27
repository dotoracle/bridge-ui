import { createGlobalStyle } from 'styled-components'

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
      border-color: ${props => props.theme.primary};

      &:hover,
      &:focus {
        border-color: ${props => props.theme.secondary};
      }
    }

    &.euiButton--primary.euiButton--fill {
      background-color: ${props => props.theme.primary};

      &:hover,
      &:focus {
        background-color: ${props => props.theme.secondary};
        border-color: ${props => props.theme.secondary};
      }
    }
  }
`

export default GlobalStyle
