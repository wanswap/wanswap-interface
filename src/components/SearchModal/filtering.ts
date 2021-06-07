import { isAddress } from '../../utils'
import { Token } from '@wanswap/sdk'

const prepareTermForSearch = (term: string) =>
  term
    .toLowerCase()
    .split(/\s+/)
    .filter(s => s.length > 0)

export function filterTokens(tokens: Token[], search: string): Token[] {
  if (search.length === 0) return tokens

  const searchingAddress = isAddress(search)

  if (searchingAddress) {
    return tokens.filter(token => token.address === searchingAddress)
  }

  const lowerSearchParts = prepareTermForSearch(search)

  if (lowerSearchParts.length === 0) {
    return tokens
  }

  const matchesSearch = (s: string): boolean => {
    const sParts = prepareTermForSearch(s)

    return lowerSearchParts.every(p => p.length === 0 || sParts.some(sp => sp.includes(p)))
  }

  return tokens.filter(token => {
    const { symbol, name } = token

    return (symbol && matchesSearch(symbol)) || (name && matchesSearch(name))
  })
}
