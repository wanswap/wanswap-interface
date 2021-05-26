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

  //will remove comments before merge, just wondering what this is meant to do?
  //It doesn't seem like you can write whitespace characters into the search bar so the split doesn't make much sense to me
  const lowerSearchParts = prepareTermForSearch(search)

  if (lowerSearchParts.length === 0) {
    return tokens
  }

  const matchesSearch = (s: string): boolean => {
    //likewise, I dont think you're symbols or names will have whitespace characters in them
    const sParts = prepareTermForSearch(s)

    // return lowerSearchParts.every(p => p.length === 0 || sParts.some(sp => sp.startsWith(p) || sp.endsWith(p)))
    return lowerSearchParts.every(p => p.length === 0 || sParts.some(sp => sp.includes(p)))
  }

  return tokens.filter(token => {
    const { symbol, name } = token

    return (symbol && matchesSearch(symbol)) || (name && matchesSearch(name))
  })
}
