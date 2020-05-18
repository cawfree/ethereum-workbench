// SPDX-License-Identifier: MIT
pragma solidity ^0.6.8;

contract HelloWorld {
  string defaultSuffix;
  constructor() public {
    defaultSuffix = '!';
  }
  function main(string memory name) public view returns(string memory) {
    return string(abi.encodePacked("Hello, ", name, defaultSuffix));
  }
}
