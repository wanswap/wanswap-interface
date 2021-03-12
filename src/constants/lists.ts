// the Uniswap Default token list lives here
// export const DEFAULT_TOKEN_LIST_URL = 'tokens.uniswap.eth'
export const DEFAULT_TOKEN_LIST_URL = window.location.origin + '/wanswap.tokenlist.json'

console.log('DEFAULT_TOKEN_LIST_URL', DEFAULT_TOKEN_LIST_URL);

export const DEFAULT_LIST_OF_LISTS: string[] = [
  DEFAULT_TOKEN_LIST_URL,
  // 'https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json',
  // 'https://umaproject.org/uma.tokenlist.json'
  // 'https://wanswap.finance/wanswap.tokenlist.json',
]
