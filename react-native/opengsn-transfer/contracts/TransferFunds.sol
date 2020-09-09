pragma solidity ^0.6.2;

import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";

contract TransferFunds is BaseRelayRecipient {
  constructor(address _forwarder) public {
    trustedForwarder = _forwarder;
  }

  event Transfer(address _toAddress, uint _amount); 
  event InsufficientFunds(address _toAddress, uint _amount, uint _currentBalance);

  /* this contract can receive funds */
  receive() external payable {}
  fallback() external {}

  function transferFunds(address payable _toAddress, uint _amount) public {
    address _myAddress = address(this);
    uint _currentBalance = _myAddress.balance;
    if (_currentBalance >= _amount) {
      _toAddress.transfer(_amount);
      emit Transfer(_toAddress, _amount);
    } else {
      emit InsufficientFunds(_toAddress, _amount, _currentBalance);
    }
  }
  function versionRecipient() external override view returns (string memory) {
    return "1.0.0";
  }
}
