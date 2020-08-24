# ethereum-workbench
A project containing various examples for deploying, interacting and experimenting with Ethereum contracts and concepts.

## Environment

This project uses `.env` variables to configure access to the ethereum blockchain. **Three** environment variables are required:

```
WEB3_KEYSTORE_JSON=<stringified-json-keystore>
WEB3_KEYSTORE_PASSWORD=<keystore-password>
WEB3_PROVIDER_URL=<your-provider-url>
```

To access the Web3 API, you can easily use [**Infura**](https://infura.io/) as a Web3 `provider`.

If you need some ether to experiment on the testnet, try one of the **faucets** below:

  - [**Rinkeby Faucet**](https://faucet.rinkeby.io/)
  - [**Ropsten Faucet**](https://faucet.ropsten.be/)
  - [**Kovan Faucet**](https://faucet.kovan.network/)

## Scripts

### Deploy a Contract (`yarn deploy`)

**Usage**

```bash
yarn deploy --contract=contracts/01-HelloWorld.sol
```
