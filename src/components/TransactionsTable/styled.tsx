import styled from 'styled-components/macro'
import { EuiButtonEmpty } from '@elastic/eui'

export const TableWrap = styled.div`
  margin-top: 1.5rem;
  border-top: 1px solid #222;
  padding-top: 2rem;

  @media (min-width: 1200px) {
    margin-top: 0;
    border-top: 0;
    padding-top: 0;
  }

  .euiTable {
    .euiTableHeaderCell:nth-child(2),
    .euiTableRowCell:nth-child(2),
    .euiTableHeaderCell:nth-child(6),
    .euiTableRowCell:nth-child(6) {
      display: none;
    }
  }
`
export const TableTitle = styled.h2`
  margin-bottom: 1.5rem;
  position: relative;
  font-family: MarketSans, sans-serif;
  font-size: 18px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #fff;
`
// export const RefreshButton = styled(EuiButtonEmpty)`
//   display: block;
//   margin-top: 1.5rem;
//   border-radius: 5px;
//   height: 30px;
//   text-transform: none;
//   color: #adadb4;
//   border-color: #adadb4;

//   &.euiButton {
//   }

//   &:active,
//   &:focus,
//   &:hover {
//     color: #fff;
//     border-color: #fff;
//     background-color: #ffffff1f;
//   }

//   &:disabled {
//     border-color: #4c4e51;
//   }

//   @media (min-width: 768px) {
//     position: absolute;
//     right: 0;
//     top: 0;
//     margin-top: -7px;
//   }
// `
export const StyledSpan = styled.span`
  font-size: 0.75rem;
`
export const Wrapper = styled.div`
  display: flex;
  align-items: center;
`
export const NetworkLogo = styled.img`
  margin-right: 0.25rem;
  margin-left: 0.25rem;
  height: 18px;
  width: 18px;
`
export const NetworkName = styled.p`
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.5;
  color: #fff;
`
export const ExplorerLogo = styled.img`
  height: 20px;
  width: 20px;
  margin-right: 0.5rem;
`
export const Link = styled.a`
  font-size: 0.75rem;
  color: #fff;

  &:hover {
    text-decoration: underline;
  }
`
export const FakeLink = styled.span`
  font-size: 0.75rem;
  color: #fff;

  &:hover {
    text-decoration: underline;
  }
`
export const CollapseWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-top: 1px solid #343741;
  padding: 0.5rem;
  width: 100%;
  font-size: 0.75rem;
  line-height: 2;
  color: #aeaeb5;

  a {
    color: ${props => props.theme.primary};

    &:hover {
      text-decoration: underline;
    }
  }

  @media (min-width: 768px) {
    border-top: 0;
  }
`
export const Row = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;

  > div {
    display: flex;
    align-items: center;
    margin-right: 0.5rem;

    > span {
      margin-right: 0.25rem;

      + span {
        margin: 0;
      }
    }
  }

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`
export const StyledClaimButton = styled(EuiButtonEmpty)`
  padding: 0;
  height: auto;

  &.euiButtonEmpty {
    color: ${props => props.theme.primary};
  }

  &:disabled {
    color: #4c4e51;
  }

  &:focus {
    background: transparent;
  }
`
export const ConfirmMessage = styled.div`
  img {
    width: 24px !important;
    height: 24px !important;
  }

  > div {
    margin-top: 1rem;
  }

  p {
    font-size: 1rem;
  }
`
