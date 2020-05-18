import "dotenv/config";

import Web3 from "web3";

const {WEB3_KEYSTORE_JSON, WEB3_KEYSTORE_PASSWORD, WEB3_PROVIDER_URL} = process.env;

export const web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER_URL));

const keystore = JSON.parse(WEB3_KEYSTORE_JSON);

const {privateKey} = web3.eth.accounts.decrypt(keystore, WEB3_KEYSTORE_PASSWORD);

export const {address} = keystore;

web3.eth.accounts.wallet.add(privateKey);
