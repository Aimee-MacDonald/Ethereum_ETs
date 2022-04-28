//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Cryptonium is ERC20 {
  constructor() ERC20("Cryptonium", "CRP") {}

  function mint(address recipient, uint256 amount) external {
    _mint(recipient, amount);
  }

  function decimals() public view virtual override returns (uint8) {
    return 0;
  }
}