import fs from "fs";
import {typeCheck} from "type-check";
import {basename} from "path";
import solc from "solc";

export default (web3, from, path) => {

  if (!typeCheck("String", path)) {
    throw new Error(`Expected String --contract, encountered ${path}.`);
  } else if (!fs.existsSync(path)) {
    throw new Error(`${path} is not a valid path.`);
  }
  
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

  return Promise
    .all(
      Object
        .entries(result)
        .map(
          ([contractName, contract]) => {
            const {abi, evm: {bytecode:{object}}} = contract;
            return new web3.eth.Contract(abi)
              .deploy({data: `0x${object}`})
              .send({
                from,
                gas: 3000000,
              })
              .then(({options: {address}}) => [contractName, address]);
          },
        )
    )
    .then(Object.fromEntries);
};
