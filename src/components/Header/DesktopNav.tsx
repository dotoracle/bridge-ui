import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui'
import styled from 'styled-components'
import NAV_ITEMS from './items'

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
    <EuiFlexGroup gutterSize="xl" justifyContent="flexEnd">
      {NAV_ITEMS.map(navItem => (
        <EuiFlexItem key={navItem.label} grow={false}>
          <a href={navItem.href ?? '#'}>{navItem.label}</a>
          {navItem.subLabel && <SubText>{navItem.subLabel}</SubText>}
        </EuiFlexItem>
      ))}
    </EuiFlexGroup>
  )
}

export default DesktopNav
