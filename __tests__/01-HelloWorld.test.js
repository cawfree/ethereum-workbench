import {web3, address} from "../scripts/setup";
import {deploy} from "../src";

jest.setTimeout(30 * 60 * 1000);

it("should be possible to invoke the contract", () => {
  expect(
    deploy(web3, address, 'contracts/01-HelloWorld.sol')
      .then(
        /* call the main() method and supply the parameter "you" */
        ({['HelloWorld']: contract}) => contract
          .methods
          .main("you")
          .call(),
      ),
  )
    .resolves
    .toBe("Hello, you!");
});
