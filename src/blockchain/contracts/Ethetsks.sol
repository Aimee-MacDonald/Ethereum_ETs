//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Ethetsks is ERC721Enumerable {
  IEthets private ETHETS;

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdTracker;

  constructor(address ethetsAddress) ERC721("CryptoWars Ethereum ET Sidekick", "CWEES") {
    ETHETS = IEthets(ethetsAddress);
  }

  function mint(uint256 token_1, uint256 token_2) external {
    address recipient = ETHETS.ownerOf(token_1);
    _safeMint(recipient, _tokenIdTracker.current());
  }
}

interface IEthets {
  function ownerOf(uint256 tokenId) external view returns (address owner);
}