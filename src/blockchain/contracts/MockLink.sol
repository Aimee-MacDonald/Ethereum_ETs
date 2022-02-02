//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockLink is ERC20 {
  constructor() ERC20("Mock", "MCK") {}

  function mint(address account, uint256 amount) external {
    _mint(account, amount);
  }

  function transferAndCall(address to, uint256 value, bytes calldata data) external returns (bool success) {
    return true;
  }
}