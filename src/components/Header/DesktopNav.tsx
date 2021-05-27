import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui'
import styled from 'styled-components'
import NAV_ITEMS from './items'

const MenuItem = styled(EuiFlexItem)`
  padding: 0 20px;
`

const Link = styled.a`
  position: relative;
  text-transform: uppercase;
  font-weight: 700;
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

  &:hover {
    color: ${props => props.theme.primary};

    &::before {
      width: 100%;
    }
  }
`
const SubText = styled.span`
  position: absolute;
  left: 0;
  bottom: 10px;
  width: 100%;
  font-size: 9px;
  text-align: center;
  text-transform: uppercase;
  color: primary;
`

const DesktopNav: React.FC = () => {
  return (
    <EuiFlexGroup gutterSize="none" justifyContent="flexEnd">
      {NAV_ITEMS.map(navItem => (
        <MenuItem key={navItem.label} grow={false}>
          <Link href={navItem.href ?? '#'}>{navItem.label}</Link>
          {navItem.subLabel && <SubText>{navItem.subLabel}</SubText>}
        </MenuItem>
      ))}
    </EuiFlexGroup>
  )
}

export default DesktopNav
