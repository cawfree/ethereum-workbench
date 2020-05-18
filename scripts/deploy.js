#!/usr/bin/env node

import "dotenv/config";

import fs from "fs";
import Web3 from "web3";
import {typeCheck} from "type-check";
import {basename} from "path";
import solc from "solc";

import {argv} from "yargs";

const {contract: path} = argv;

const {
  WEB3_KEYSTORE_JSON,
  WEB3_KEYSTORE_PASSWORD,
  WEB3_PROVIDER_URL,
} = process.env;

if (!typeCheck("String", path)) {
  throw new Error(`Expected String --contract, encountered ${path}.`);
} else if (!fs.existsSync(path)) {
  throw new Error(`${path} is not a valid path.`);
}

const web3 = new Web3(
  new Web3.providers.HttpProvider(WEB3_PROVIDER_URL),
);

const content = fs.readFileSync(path).toString();
const name = basename(path);

const {contracts:{[name]: result}} = JSON.parse(solc.compile(JSON.stringify({
  language: 'Solidity',
  sources: {
    [name]: {
      content,
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
})));

// XXX: We only support a single contract during deployment.
if (Object.keys(result).length > 1 || Object.keys(result).length < 1) {
  throw new Error(`Expected a single contract declaration, but encountered ${Object.keys(result.length)}.`);
}
const [contractName] = Object.keys(result);
const contract = result[contractName];

const keystore = JSON.parse(WEB3_KEYSTORE_JSON);
const {address: from} = keystore;
const {privateKey} = web3.eth.accounts.decrypt(
  keystore,
  WEB3_KEYSTORE_PASSWORD,
);

web3.eth.accounts.wallet.add(privateKey);

// TODO: gasEstimates
(async () => {
  const {abi, evm: {bytecode:{object}}} = contract;
  const gasPrice = await web3.eth.getGasPrice();
  const result = await new web3.eth.Contract(abi)
    .deploy({data: `0x${object}`})
    .send({
      from,
      gas: 3000000,
    });
  console.log('Deployed!');
})();
