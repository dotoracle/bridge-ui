import styled, { css } from 'styled-components/macro'
import { Link } from 'react-router-dom'

export const TitleWrapper = styled.div`
  position: relative;
`
export const Title = styled.h1`
  position: relative;
  z-index: 2;
  margin-top: 1.5rem;
  line-height: 1.5;
  text-align: center;
  font-family: MarketSans, sans-serif;
  font-size: 36px;
  text-transform: uppercase;
  color: #fff;

  @media (min-width: 768px) {
    font-size: 50px;
  }

  @media (min-width: 992px) {
    font-size: 70px;
  }

  @media (min-width: 1200px) {
    font-size: 90px;
  }
`
export const TitleShadow = styled.span`
  position: absolute;
  top: 0;
  left: 50%;
  margin-top: 2px;
  margin-left: 2px;
  transform: translate(-50%);
  z-index: 1;
  width: 100%;
  line-height: 1.5;
  text-align: center;
  font-family: MarketSans, sans-serif;
  font-size: 36px;
  text-transform: uppercase;
  color: transparent;
  -webkit-text-stroke-width: 2px;
  -webkit-text-stroke-color: #ff9100;

  @media (min-width: 768px) {
    font-size: 50px;
    margin-top: 3px;
    margin-left: 3px;
  }

  @media (min-width: 992px) {
    font-size: 70px;
  }

  @media (min-width: 1200px) {
    font-size: 90px;
  }
`

export const SubHeading = styled.h2`
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5rem;
  color: #fff;

  @media (min-width: 768px) {
    font-size: 28px;
  }
`
export const MenuLinkStyle = css`
  position: relative;
  text-transform: uppercase;
  font-weight: 500;
  color: #fff;

  &::before {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 0;
    height: 2px;
    transition: all 400ms ease;
    background-color: ${props => props.theme.primary};
  }

  &:hover,
  &.active {
    color: ${props => props.theme.primary};

    &::before {
      width: 100%;
    }
  }
`
export const MenuLink = styled(Link)`
  ${MenuLinkStyle}
`
export const MenuA = styled.a`
  ${MenuLinkStyle}
`
