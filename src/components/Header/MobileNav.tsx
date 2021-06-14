import { useState } from 'react'
import { EuiCollapsibleNav, EuiButtonIcon, EuiHideFor } from '@elastic/eui'
import NAV_ITEMS from './items'
import styled from 'styled-components'

const MenuToggle = styled(EuiButtonIcon)`
  margin-left: 16px;
  color: #fff;

  &:hover,
  &:focus {
    transform: none !important;
  }
`
const MobileMenu = styled.ul``
const MobileMenuItem = styled.li`
  border-bottom: 1px solid #333;
  padding: 15px 20px;
`
const MobileMenuLink = styled.a`
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

  return (
    <EuiHideFor sizes={['m', 'l', 'xl']}>
      <EuiCollapsibleNav
        side="right"
        isOpen={navIsOpen}
        onClose={() => setNavIsOpen(false)}
        closeButtonPosition="inside"
        button={<MenuToggle iconType="menu" iconSize="l" onClick={() => setNavIsOpen(!navIsOpen)} />}
      >
        <MobileMenu>
          {NAV_ITEMS.map(navItem => (
            <MobileMenuItem key={navItem.label}>
              <MobileMenuLink href={navItem.href ?? '#'} target={navItem.target ?? '_self'}>
                {navItem.label}
              </MobileMenuLink>
              {navItem.subLabel && <SubText>{navItem.subLabel}</SubText>}
            </MobileMenuItem>
          ))}
        </MobileMenu>
      </EuiCollapsibleNav>
    </EuiHideFor>
  )
}

export default MobileNav
