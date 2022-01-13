import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

export const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://graph.wanswap.finance/subgraphs/name/wanswap/wanswap-subgraph-3'
  }),
  cache: new InMemoryCache(),
  shouldBatch: true
})

export const healthClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://graph.wanswap.finance:1443/graphql'
  }),
  cache: new InMemoryCache(),
  shouldBatch: true
})

export const v1Client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://graph.wanswap.finance/subgraphs/name/ianlapham/uniswap'
  }),
  cache: new InMemoryCache(),
  shouldBatch: true
})

export const stakingClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://graph.wanswap.finance/subgraphs/name/way2rach/talisman'
  }),
  cache: new InMemoryCache(),
  shouldBatch: true
})

export const blockClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://graph.wanswap.finance/subgraphs/name/blocklytics/ethereum-blocks'
  }),
  cache: new InMemoryCache()
})
