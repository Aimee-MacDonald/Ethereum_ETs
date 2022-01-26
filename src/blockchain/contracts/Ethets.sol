//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Ethets is Ownable, ERC721Enumerable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdTracker;

  mapping(uint256 => Statistics) private _statistics;
  mapping(uint256 => Ability) private _abilities;

  struct Statistics {
    uint8 firing_range;
    uint8 firing_speed;
    uint8 reload_speed;
    uint8 melee_damage;
    uint8 melee_speed;
    uint8 magazine_capacity;
    uint8 health;
  }

  enum Ability {
    NONE,
    HEALTH_REGEN,
    SHIELD,
    DUAL_WEAPONS,
    GRENADES,
    DECOY
  }

  constructor() ERC721("Ethereum ET", "ETHET") {}

  function mint(address recipient) external returns (bool) {
    _safeMint(recipient, _tokenIdTracker.current());
    _statistics[_tokenIdTracker.current()] = Statistics(100, 100, 100, 100, 100, 100, 100);
    _abilities[_tokenIdTracker.current()] = Ability.NONE;
    _tokenIdTracker.increment();

    return true;
  }

  function statsOf(uint256 tokenId) external view returns (Statistics memory) {
    return _statistics[tokenId];
  }

  function abilityOf(uint256 tokenId) external view returns (Ability) {
    return _abilities[tokenId];
  }
}