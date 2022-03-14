import NavItem from './NavItem.type'

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Home',
    to: '/',
  },
  {
    label: 'Faucet',
    href: 'https://faucet.dotoracle.network',
    target: '__blank',
  },
  {
    label: 'Transfer ERC20 Token',
    to: '/transfer',
  },
]

export default NAV_ITEMS
