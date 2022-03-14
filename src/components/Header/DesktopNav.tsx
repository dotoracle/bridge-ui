import { EuiFlexGroup, EuiFlexItem, EuiShowFor } from '@elastic/eui'
import styled from 'styled-components/macro'
import { useLocation } from 'react-router-dom'
import NAV_ITEMS from './items'
import { MenuA, MenuLink } from '../../styled'

const MenuItem = styled(EuiFlexItem)`
  position: relative;
  padding: 0 20px;
`
const SubText = styled.span`
  padding: 5px;
  border-radius: 3px;
  position: absolute;
  right: 0;
  top: -25px;
  width: fit-content;
  font-size: 7px;
  font-weight: 500;
  text-align: center;
  letter-spacing: 0.05rem;
  text-transform: uppercase;
  color: #fff;
  background-color: ${props => props.theme.primary};
`

function DesktopNav(): JSX.Element {
  const location = useLocation()
  const { pathname } = location

  return (
    <EuiShowFor sizes={['m', 'l', 'xl']}>
      <EuiFlexGroup gutterSize="none" justifyContent="flexEnd">
        {NAV_ITEMS.map(navItem => (
          <MenuItem key={navItem.label} grow={false}>
            {navItem.href && (
              <MenuA
                href={navItem.href}
                target={navItem.target ?? '_self'}
                className={`${pathname.includes(navItem.href) && 'active'}`}
              >
                {navItem.label}
              </MenuA>
            )}
            {navItem.to && (
              <MenuLink to={navItem.to} className={`${pathname === navItem.to && 'active'}`}>
                {navItem.label}
              </MenuLink>
            )}
            {navItem.subLabel && <SubText>{navItem.subLabel}</SubText>}
          </MenuItem>
        ))}
      </EuiFlexGroup>
    </EuiShowFor>
  )
}

export default DesktopNav
