#!/usr/bin/env node

import "@babel/polyfill";

import {argv} from "yargs";
import {web3, address} from "./setup";

console.log("i am going to pay a balance on rinkeby to a specified address");

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

(async () => {
  const gasPrice = await getGasPrice();
  console.log(`The gas price is ${gasPrice}.`);
})();




//import {web3, address} from "./setup";
//import {deploy} from "../src";
//
//const {contract: path} = argv;
//
//deploy(web3, address, path);
