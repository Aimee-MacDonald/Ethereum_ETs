//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Ethetsks is ERC721Enumerable {
  IEthets private ETHETS;

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdTracker;

  mapping(uint256 => Statistics) private _statistics;
  mapping(uint256 => uint256) _tokenTypes;
  mapping(uint256 => AbilitySet) _abilities;

  struct Statistics {
    uint8 firing_range;
    uint8 firing_speed;
    uint8 reload_speed;
    uint8 melee_damage;
    uint8 melee_speed;
    uint8 magazine_capacity;
    uint8 health;
  }

  struct AbilitySet {
    Ability ability_1;
    Ability ability_2;
  }

  enum Ability {
    NONE,
    HEALTH_REGEN,
    SHIELD,
    DUAL_WEAPONS,
    GRENADES,
    DECOY
  }

  constructor(address ethetsAddress) ERC721("CryptoWars Ethereum ET Sidekick", "CWEES") {
    ETHETS = IEthets(ethetsAddress);
  }

  function mint(uint256 token_1, uint256 token_2) external {
    require(_msgSender() == address(ETHETS), "Ethetsks: Minting restricted");
    
    address recipient = ETHETS.ownerOf(token_1);
    
    _setStats(token_1, token_2);
    _setTokenType(token_1, token_2);
    _setAbilities(token_1, token_2);

    _safeMint(recipient, _tokenIdTracker.current());
    _tokenIdTracker.increment();
  }

  function _setStats(uint256 token_1, uint256 token_2) private {
    IEthets.Statistics memory stats_1 = ETHETS.statsOf(token_1);
    IEthets.Statistics memory stats_2 = ETHETS.statsOf(token_2);

    uint8 firing_range = (stats_1.firing_range + stats_2.firing_range) / 20;
    uint8 firing_speed = (stats_1.firing_speed + stats_2.firing_speed) / 20;
    uint8 reload_speed = (stats_1.reload_speed + stats_2.reload_speed) / 20;
    uint8 melee_damage = (stats_1.melee_damage + stats_2.melee_damage) / 20;
    uint8 melee_speed = (stats_1.melee_speed + stats_2.melee_speed) / 20;
    uint8 magazine_capacity = (stats_1.magazine_capacity + stats_2.magazine_capacity) / 20;
    uint8 health = (stats_1.health + stats_2.health) / 20;

    _statistics[_tokenIdTracker.current()] = Statistics(firing_range, firing_speed, reload_speed, melee_damage, melee_speed, magazine_capacity, health);
  }

  function _setTokenType(uint256 token_1, uint256 token_2) private {
    uint256 rank_1 = ETHETS.rankGroupOf(token_1);
    uint256 rank_2 = ETHETS.rankGroupOf(token_2);

    if(rank_1 > rank_2) {
      _tokenTypes[_tokenIdTracker.current()] = rank_1;
    } else {
      _tokenTypes[_tokenIdTracker.current()] = rank_2;
    }
  }

  function _setAbilities(uint256 token_1, uint256 token_2) private {
    uint256 ability_1 = uint256(ETHETS.abilityOf(token_1));
    uint256 ability_2 = uint256(ETHETS.abilityOf(token_2));
    
    _abilities[_tokenIdTracker.current()] = AbilitySet(Ability(ability_1), Ability(ability_2));
  }

  function statsOf(uint256 tokenId) external view returns (Statistics memory) {
    return _statistics[tokenId];
  }

  function typeOf(uint256 tokenId) external view returns (uint256) {
    return _tokenTypes[tokenId];
  }

  function abilityOf(uint256 tokenId) external view returns (AbilitySet memory) {
    return _abilities[tokenId];
  }
}

interface IEthets {
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
  
  function ownerOf(uint256 tokenId) external view returns (address owner);
  function statsOf(uint256 tokenId) external view returns (Statistics memory);
  function rankGroupOf(uint256 tokenId) external view returns (uint256);
  function abilityOf(uint256 tokenId) external view returns (Ability);
}