import Network from 'type/Network'

const alwaysTrue = () => true

/**
 * Create a filter function to apply to a token for whether it matches a particular search query
 * @param search the search query to apply to the token
 */
export function createTokenFilterFunction<T extends Network>(search: string): (tokens: T) => boolean {
  const searchingChainId = !isNaN(parseInt(search))

  if (searchingChainId) {
    const chainId = parseInt(search)
    return (n: T) => chainId === n.chainId
  }

  const lowerSearchParts = search
    .toLowerCase()
    .split(/\s+/)
    .filter(s => s.length > 0)

  if (lowerSearchParts.length === 0) return alwaysTrue

  const matchesSearch = (s: string): boolean => {
    const sParts = s
      .toLowerCase()
      .split(/\s+/)
      .filter(_s => _s.length > 0)

    return lowerSearchParts.every(p => p.length === 0 || sParts.some(sp => sp.startsWith(p) || sp.endsWith(p)))
  }

  return ({ name, chainId }: T): boolean =>
    Boolean((chainId && matchesSearch(chainId.toString())) || (name && matchesSearch(name)))
}

export function filterNetworks<T extends Network>(tokens: T[], search: string): T[] {
  return tokens.filter(createTokenFilterFunction(search))
}
