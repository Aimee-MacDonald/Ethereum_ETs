//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MockSideKick is ERC721 {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdTracker;

  uint256 public token_1;
  uint256 public token_2;

  IEthet immutable private ETHET;

  constructor(address ethetAddress) ERC721("CryptoWars Sidekick", "CWSK") {
    ETHET = IEthet(ethetAddress);
  }

  function mint(uint256 tokenId_1, uint256 tokenId_2) external returns (bool) {
    address tokenOwner = ETHET.ownerOf(tokenId_1);
    token_1 = tokenId_1;
    token_2 = tokenId_2;
    _safeMint(tokenOwner, _tokenIdTracker.current());
    _tokenIdTracker.increment();

    return true;
  }
}

interface IEthet {
  function ownerOf(uint256 tokenId) external view returns (address);
}