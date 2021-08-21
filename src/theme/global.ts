import { createGlobalStyle } from 'styled-components/macro'
import theme from './index'

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Montserrat', sans-serif;

    #root {
      overflow-x: hidden;
    }
  }

  a {
    transition: 0.5s all ease;
  }

  .euiContextMenuItem {
    font-family: 'Montserrat', sans-serif;
  }

  .euiFilterSelectItem__content {
    margin: 0.5rem !important;
    font-family: 'Montserrat', sans-serif;
  }

  .euiFilterSelectItem:focus, .euiFilterSelectItem-isFocused {
    background-color: ${theme.secondary}1a;
    color: ${theme.primary};

    p {
      color: ${theme.primary};
    }
  }

  .euiModalHeader__title {
    font-weight: 500;
    font-size: 1.5rem;
  }

  .euiButtonEmpty {
    font-family: 'Montserrat', sans-serif;
    font-size: 0.875rem;
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
      color: ${theme.primary};
      border-color: ${theme.primary};

      &:hover,
      &:focus {
        border-color: ${theme.secondary};
        background-color: ${theme.secondary}1a;
      }

      &.euiButton-isDisabled {
        color: #757678;
        border-color: #434548;

        &:hover {
          background-color: #4345481a;
        }
      }
    }

    &.euiButton--fill {
      color: #fff;
      background-color: ${theme.primary};

      &:not([class*='isDisabled']):hover,
      &:not([class*='isDisabled']):focus,
      &:not([class*='isDisabled']):focus-within {
        background-color: ${theme.secondary};
        border-color: ${theme.secondary};
      }
    }
  }

  .euiFieldText:focus,
  .euiFieldNumber:focus,
  .euiFieldSearch:focus {
    background-image: linear-gradient(to top, ${theme.primary}, ${theme.primary} 2px, #0000 2px, #0000 100%);
  }

  @media (max-width: 767px) {
    .euiTable.euiTable--responsive .euiTableRow.euiTableRow-isExpandable .euiTableRowCell--isExpander,
    .euiTable.euiTable--responsive .euiTableRow.euiTableRow-hasActions .euiTableRowCell--hasActions {
      right: 0;
    }
  }

  .euiPagination .euiButtonIcon[disabled] {
    opacity: 0.5;
    cursor: initial;
  }
`

export default GlobalStyle
