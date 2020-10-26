# wanswap Interface

[![Lint](https://github.com/wanswap/wanswap-interface/workflows/Lint/badge.svg)](https://github.com/wanswap/wanswap-interface/actions?query=workflow%3ALint)
[![Tests](https://github.com/wanswap/wanswap-interface/workflows/Tests/badge.svg)](https://github.com/wanswap/wanswap-interface/actions?query=workflow%3ATests)
[![Styled With Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)

An open source interface for wanswap -- a protocol for decentralized exchange of Ethereum tokens.

- Website: [testnet.wanswap.finance](https://testnet.wanswap.finance/)
- Email: [morpheus.blockchain@gmail.com](mailto:morpheus.blockchain@gmail.com)

## Accessing the wanswap Interface

To access the wanswap Interface, use an IPFS gateway link from the
[latest release](https://github.com/wanswap/wanswap-interface/releases/latest), 
or visit [app.wanswap.org](https://wanswap.finance).

## Listing a token

Please see the
[@wanswap/token-list](https://github.com/wanswap/token-list) 
repository.

## Development

### Install Dependencies

```bash
yarn
```

### Run

```bash
yarn start
```

### Configuring the environment (optional)

To have the interface default to a different network when a wallet is not connected:

1. Make a copy of `.env` named `.env.local`
2. Change `REACT_APP_NETWORK_ID` to `"{YOUR_NETWORK_ID}"`
3. Change `REACT_APP_NETWORK_URL` to e.g. `"https://{YOUR_NETWORK_ID}.infura.io/v3/{YOUR_INFURA_KEY}"` 

Note that the interface only works on testnets where both

Wanswap Factory

[multicall](https://github.com/makerdao/multicall) are deployed.
The interface will not work on other networks.

## Contributions

**Please open all pull requests against the `master` branch.** 
CI checks will run against all PRs.
