import { EuiFlexGroup, EuiFlexItem, EuiShowFor } from '@elastic/eui'
import styled from 'styled-components'
import NAV_ITEMS from './items'

const MenuItem = styled(EuiFlexItem)`
  position: relative;
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
  padding: 5px;
  border-radius: 3px;
  position: absolute;
  right: 0;
  top: -25px;
  width: fit-content;
  font-size: 7px;
  font-weight: 600;
  text-align: center;
  letter-spacing: 0.05rem;
  text-transform: uppercase;
  color: #fff;
  background-color: ${props => props.theme.primary};
`

const DesktopNav: React.FC = () => {
  return (
    <EuiShowFor sizes={['m', 'l', 'xl']}>
      <EuiFlexGroup gutterSize="none" justifyContent="flexEnd">
        {NAV_ITEMS.map(navItem => (
          <MenuItem key={navItem.label} grow={false}>
            <Link href={navItem.href ?? '#'}>{navItem.label}</Link>
            {navItem.subLabel && <SubText>{navItem.subLabel}</SubText>}
          </MenuItem>
        ))}
      </EuiFlexGroup>
    </EuiShowFor>
  )
}

export default DesktopNav
