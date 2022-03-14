import { useState } from 'react'
import { EuiCollapsibleNav, EuiButtonIcon, EuiHideFor } from '@elastic/eui'
import NAV_ITEMS from './items'
import styled from 'styled-components/macro'
import { Link, useLocation } from 'react-router-dom'

const MenuToggle = styled(EuiButtonIcon)`
  margin-left: 16px;
  color: #fff;

  &:hover,
  &:focus {
    transform: none !important;
  }
`
const MobileMenuItem = styled.li`
  border-bottom: 1px solid #333;
  padding: 15px 20px;
`
const MobileMenuLink = styled(Link)`
  color: #fff;
  font-weight: 500;
  text-transform: uppercase;
`
const MobileMenuA = styled.a`
  color: #fff;
  font-weight: 500;
  text-transform: uppercase;
`
const SubText = styled.span`
  display: inline-block;
  vertical-align: middle;
  margin-left: 15px;
  padding: 5px;
  border-radius: 3px;
  width: fit-content;
  font-size: 7px;
  font-weight: 500;
  text-align: center;
  letter-spacing: 0.05rem;
  text-transform: uppercase;
  color: #fff;
  background-color: ${props => props.theme.primary};
`

function MobileNav(): JSX.Element {
  const [navIsOpen, setNavIsOpen] = useState(false)

  const location = useLocation()
  const { pathname } = location

  return (
    <EuiHideFor sizes={['m', 'l', 'xl']}>
      <EuiCollapsibleNav
        side="right"
        isOpen={navIsOpen}
        onClose={() => setNavIsOpen(false)}
        closeButtonPosition="inside"
        button={<MenuToggle iconType="menu" iconSize="l" onClick={() => setNavIsOpen(!navIsOpen)} />}
      >
        <ul>
          {NAV_ITEMS.map(navItem => (
            <MobileMenuItem key={navItem.label}>
              {navItem.href && (
                <MobileMenuA
                  href={navItem.href}
                  target={navItem.target ?? '_self'}
                  className={`${pathname.includes(navItem.href) && 'active'}`}
                >
                  {navItem.label}
                </MobileMenuA>
              )}
              {navItem.to && (
                <MobileMenuLink to={navItem.to} className={`${pathname.includes(navItem.to) && 'active'}`}>
                  {navItem.label}
                </MobileMenuLink>
              )}
              {navItem.subLabel && <SubText>{navItem.subLabel}</SubText>}
            </MobileMenuItem>
          ))}
        </ul>
      </EuiCollapsibleNav>
    </EuiHideFor>
  )
}

export default MobileNav
