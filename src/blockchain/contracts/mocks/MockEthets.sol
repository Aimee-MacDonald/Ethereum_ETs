//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MockEthets is ERC721Enumerable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdTracker;

  ISidekick private SIDEKICK;

  struct Statistics {
    uint8 firing_range;
    uint8 firing_speed;
    uint8 reload_speed;
    uint8 melee_damage;
    uint8 melee_speed;
    uint8 magazine_capacity;
    uint8 health;
  }

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

  function statsOf(uint256 tokenId) external pure returns (Statistics memory) {
    if(tokenId == 0) {
      return Statistics(55, 55, 55, 55, 55, 55, 55);
    } else {
      return Statistics(15, 15, 15, 15, 15, 15, 15);
    }
  }

  function rankGroupOf(uint256 tokenId) external pure returns (uint256) {
    if(tokenId == 0) {
      return 1;
    } else if(tokenId == 1) {
      return 2;
    } else if(tokenId == 2) {
      return 3;
    } else if(tokenId == 3) {
      return 4;
    } else if(tokenId == 4) {
      return 1;
    } else if(tokenId == 5) {
      return 2;
    } else if(tokenId == 6) {
      return 3;
    } else if(tokenId == 7) {
      return 4;
    }
  }

  function abilityOf(uint256 tokenId) external pure returns (uint256) {
    if(tokenId == 0) {
      return 0;
    } else if(tokenId == 1) {
      return 1;
    } else if(tokenId == 2) {
      return 2;
    } else if(tokenId == 3) {
      return 3;
    } else if(tokenId == 4) {
      return 4;
    } else if(tokenId == 5) {
      return 5;
    } else if(tokenId == 6) {
      return 0;
    } else if(tokenId == 7) {
      return 1;
    } else if(tokenId == 8) {
      return 2;
    } else if(tokenId == 9) {
      return 3;
    } else if(tokenId == 10) {
      return 4;
    } else if(tokenId == 11) {
      return 5;
    }
  }
}

interface ISidekick {
  function mint(uint256 tokenId_1, uint256 tokenId_2) external;
}