type NavItem = {
  label: string
  subLabel?: string
  children?: Array<NavItem>
  href?: string
  dot?: true
}

export default NavItem
