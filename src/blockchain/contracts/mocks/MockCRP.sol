//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockCRP is ERC20 {
  constructor() ERC20("Cryptonium", "CRP") {}

  function mint(address account, uint256 amount) external {
    _mint(account, amount);
  }
}