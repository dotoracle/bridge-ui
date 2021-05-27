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
  border-bottom: 1px solid #e6e6e6;
  padding: 15px 20px;
`
const MobileMenuLink = styled.a`
  color: #333;
  font-weight: 700;
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
  font-weight: 600;
  text-align: center;
  letter-spacing: 0.05rem;
  text-transform: uppercase;
  color: #fff;
  background-color: ${props => props.theme.primary};
`

const MobileNav: React.FC = () => {
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
              <MobileMenuLink href={navItem.href ?? '#'}>{navItem.label}</MobileMenuLink>
              {navItem.subLabel && <SubText>{navItem.subLabel}</SubText>}
            </MobileMenuItem>
          ))}
        </MobileMenu>
      </EuiCollapsibleNav>
    </EuiHideFor>
  )
}

export default MobileNav
