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
    - You'll need to [**make a public request**](https://twitter.com/cawfree/status/1297930888550981633).
  - [**Ropsten Faucet**](https://faucet.ropsten.be/)
  - [**Kovan Faucet**](https://faucet.kovan.network/)

## Scripts

### Deploy a Contract (`yarn deploy`)

**Usage**

```bash
yarn deploy --contract=contracts/01-HelloWorld.sol
```

### Transfer Funds (`yarn transfer`)

**Usage**

```bash
# e.g. initialize a Gnosis multisig wallet
yarn transfer --target 0x2b58Af5592Ad3a14A6851a19b0b37012d5d497cF --wei 345551800314138 --gasLimit 10000000 --network rinkeby
```
