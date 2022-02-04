//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MockSideKick is ERC721 {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdTracker;

  constructor() ERC721("CryptoWars Sidekick", "CWSK") {}

  function mint(address recipient) external returns (bool) {
    _safeMint(recipient, _tokenIdTracker.current());
    _tokenIdTracker.increment();

    return true;
  }
}