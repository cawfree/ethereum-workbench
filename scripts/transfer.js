#!/usr/bin/env node

import "@babel/polyfill";

import { Transaction as Tx } from "ethereumjs-tx";
import {argv} from "yargs";
import {typeCheck} from "type-check";
import BigNumber from "bignumber.js";

import {web3, address, privateKey} from "./setup";

const getGasPrice = () => new Promise(
  (resolve, reject) => web3.eth.getGasPrice(
    (e, r) => {
      if (e) {
        return reject(e);
      }
      return resolve(r);
    },
  ),
);

const getTransactionCount = address => new Promise(
  (resolve, reject) => web3.eth.getTransactionCount(
    address,
    (err, count) => {
      if (err) {
        return reject(err);
      }
      return resolve(count);
    },
  ),
);

const placeTransaction = (tx, chain) => new Promise(
  (resolve, reject) => {
    const txn = new Tx(tx, { chain });
    txn.sign(Buffer.from(privateKey.substring(2), "hex"));

    return web3.eth.sendSignedTransaction(
      `0x${txn.serialize().toString("hex")}`,
    )
      .on('receipt', resolve)
      .on("error", reject);
  },
);

(async () => {
  const {target, wei, gasLimit, network} = argv;

  if (!typeCheck("String", target) || target.length <= 0) {
    throw new Error(`Expected non-empty String target, encountered ${target}.`);
  } else if (!typeCheck("String", network) || network.length <= 0) {
    throw new Error(`Expected non-empty String network, encountered ${network}.`);
  }

  const gasPrice = await getGasPrice();
  console.log(`The gas price is ${gasPrice}.`);
  const transactionCount = await web3.eth.getTransactionCount(address);
  console.log(`The address ${target} currently has ${transactionCount} transactions.`);
  
  const tx = {
    to: target,
    nonce: web3.utils.toHex(transactionCount),
    value: web3.utils.toHex(wei),
    gasLimit: web3.utils.toHex(gasLimit),
    gasPrice: web3.utils.toHex(new BigNumber(gasPrice).multipliedBy("1.1").toString()),
    data: null,
  };

  const result = await placeTransaction(tx, network);
  console.log(result);
})();
