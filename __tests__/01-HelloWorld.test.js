import {web3, address} from "../scripts/setup";
import {deploy} from "../src";

jest.setTimeout(5 * 60 * 1000);

it("should be possible to invoke the contract", () => {
  expect(
    deploy(web3, address, 'contracts/01-HelloWorld.sol')
      .then((results) => {
        console.log(results);
        return true;
      }),
  )
    .resolves
    .toBeTruthy();
});
