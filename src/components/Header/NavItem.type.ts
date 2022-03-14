type NavItem = {
  label: string
  subLabel?: string
  children?: Array<NavItem>
  href?: string
  to?: string
  target?: string
  dot?: true
}

export default NavItem
