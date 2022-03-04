//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MockEthets is ERC721Enumerable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdTracker;

  ISidekick private SIDEKICK;

  constructor() ERC721("CryptoWars Ethereum ET", "CWEE") {}

  function hybridize(uint256 token_1, uint256 token_2) external {
    SIDEKICK.mint(token_1, token_2);
  }

  function setSidekick(address sidekickAddress) external {
    SIDEKICK = ISidekick(sidekickAddress);
  }

  function mint(address recipient) external {
    _safeMint(recipient, _tokenIdTracker.current());
    _tokenIdTracker.increment();
  }
}

interface ISidekick {
  function mint(uint256 tokenId_1, uint256 tokenId_2) external;
}