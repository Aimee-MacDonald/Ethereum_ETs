//SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

////
//  NOT IN PRODUCTION
//
import "hardhat/console.sol";
//
//  NOT IN PRODUCTION
////

contract Ethetsks is ERC721Enumerable, VRFConsumerBase {
  IEthets private ETHETS;
  IUtils private UTILS;

  bool public airdropSeeded;
  bool public airdropExecuted;
  uint256 private airdropSeed;

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdTracker;

  bytes32 private immutable VRF_KEY_HASH;
  uint256 private immutable VRF_FEE;

  mapping(uint256 => Statistics) private _statistics;
  mapping(uint256 => uint256) _tokenTypes;
  mapping(uint256 => AbilitySet) _abilities;
  mapping(uint256 => uint256) _variants;
  mapping(bytes32 => RandomnessRequest) _randomnessRequests;

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
    Ability ability_0;
    Ability ability_1;
  }

  struct RandomnessRequest {
    uint256 tokenId;
    RandomnessRequestType requestType;
  }

  enum RandomnessRequestType {
    NONE,
    AIRDROP,
    HYBRIDIZE
  }

  enum Ability {
    NONE,
    HEALTH_REGEN,
    SHIELD,
    DUAL_WEAPONS,
    GRENADES,
    DECOY
  }

  event RandomnessRequested(bytes32 requestId);

  constructor(address ethetsAddress, address utilsAddress, address vrfCoordinator, address linkToken) ERC721("CryptoWars Ethereum ET Sidekick", "CWEES") VRFConsumerBase(vrfCoordinator, linkToken) {
    ETHETS = IEthets(ethetsAddress);
    UTILS = IUtils(utilsAddress);
    VRF_KEY_HASH = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
    VRF_FEE = 0.0001 * 10 ** 18;
  }

  function mint(uint256 token_1, uint256 token_2) external {
    require(_msgSender() == address(ETHETS), "Ethetsks: Minting restricted");
    
    address recipient = ETHETS.ownerOf(token_1);
    
    _setStats(token_1, token_2);
    _setTokenType(token_1, token_2);
    _setAbilities(token_1, token_2);

    bytes32 requestId = requestRandomness(VRF_KEY_HASH, VRF_FEE);
    _randomnessRequests[requestId] = RandomnessRequest(_tokenIdTracker.current(), RandomnessRequestType.HYBRIDIZE);
    emit RandomnessRequested(requestId);

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
    require(_exists(tokenId), "Ethetsks: Token does not Exist");

    return _statistics[tokenId];
  }

  function typeOf(uint256 tokenId) external view returns (uint256) {
    require(_exists(tokenId), "Ethetsks: Token does not Exist");

    return _tokenTypes[tokenId];
  }

  function abilityOf(uint256 tokenId) external view returns (AbilitySet memory) {
    require(_exists(tokenId), "Ethetsks: Token does not Exist");
    
    return _abilities[tokenId];
  }

  function airdrop(address[] memory addresses) external {
    require(airdropSeeded, "Ethetsks: Airdrop not seeded");
    require(!airdropExecuted, "Ethetstks: Airdrop already executed");

    uint256 total = totalSupply();

    for(uint256 i = 0; i < addresses.length; i++) {
      uint8[] memory statValues = new uint8[](7);
      for(uint256 j = 0; j < 7; j++) statValues[j] = uint8(uint256(keccak256(abi.encodePacked(airdropSeed, i * 2, j))) % 10 + 1);
      _statistics[_tokenIdTracker.current()] = Statistics(statValues[0], statValues[1], statValues[2], statValues[3], statValues[4], statValues[5], statValues[6]);
 
      _tokenTypes[_tokenIdTracker.current()] = uint256(keccak256(abi.encodePacked(airdropSeed, i * 4))) % 4 + 1;

      uint256[] memory abilityVals = new uint256[](2);
      for(uint256 j = 0; j < 2; j++) abilityVals[j] = uint256(keccak256(abi.encodePacked(airdropSeed, i * 8, j))) % 5 + 1;
      _abilities[_tokenIdTracker.current()] = AbilitySet(Ability(abilityVals[0]), Ability(abilityVals[1]));

      //  Randomly select a token variant
      _variants[_tokenIdTracker.current()] = uint256(keccak256(abi.encodePacked(airdropSeed, i * 16))) % 4 + 1;

      _safeMint(addresses[i], _tokenIdTracker.current());
      _tokenIdTracker.increment();
    }

    require(totalSupply() - total == addresses.length, "Ethetsks: Airdrop failed unexpectedly");
    airdropExecuted = true;
  }

  function seedAirdrop() external {
    require(!airdropSeeded, "Ethetsks: Airdrop already seeded");
    
    bytes32 requestId = requestRandomness(VRF_KEY_HASH, VRF_FEE);
    _randomnessRequests[requestId] = RandomnessRequest(0, RandomnessRequestType.AIRDROP);

    emit RandomnessRequested(requestId);
  }

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    RandomnessRequest memory randomnessRequest = _randomnessRequests[requestId];

    uint256 requestType = uint256(randomnessRequest.requestType);

    if(requestType == 1 && airdropSeeded == false && randomness != 0) {
      airdropSeeded = true;
      airdropSeed = randomness;
    } else if(requestType == 2) {
      _variants[randomnessRequest.tokenId] = randomness % 4 + 1;
    }

    //  Delete Randomness Request

/* 
    if(randomnessRequest.type == airdropSeed && airdropSeeded == false) {
      //  Seed Airdrop
    } else if(randomnessRequest.type == hybridize && tokenExists && tokenVariant == 0) {
      //  Set token variant
    }
     */

/* 
    if(randomness != 0) {
      airdropSeeded = true;
      airdropSeed = randomness;
    }
     */
  }

  function stringAbilityOf(uint256 tokenId) external view returns (string memory) {
    AbilitySet memory abilities = _abilities[tokenId];
    string memory finalString = "";

    uint256 ability_0 = uint256(abilities.ability_0);
    uint256 ability_1 = uint256(abilities.ability_1);

    if(ability_0 == 0) {
      finalString = UTILS.concatenateStrings(finalString, "None");
    } else if(ability_0 == 1) {
      finalString = UTILS.concatenateStrings(finalString, "Health Regen");
    } else if(ability_0 == 2) {
      finalString = UTILS.concatenateStrings(finalString, "Shield");
    } else if(ability_0 == 3) {
      finalString = UTILS.concatenateStrings(finalString, "Dual Weapons");
    } else if(ability_0 == 4) {
      finalString = UTILS.concatenateStrings(finalString, "Grenades");
    } else if(ability_0 == 5) {
      finalString = UTILS.concatenateStrings(finalString, "Decoy");
    }

    finalString = UTILS.concatenateStrings(finalString, "/");

    if(ability_1 == 0) {
      finalString = UTILS.concatenateStrings(finalString, "None");
    } else if(ability_1 == 1) {
      finalString = UTILS.concatenateStrings(finalString, "Health Regen");
    } else if(ability_1 == 2) {
      finalString = UTILS.concatenateStrings(finalString, "Shield");
    } else if(ability_1 == 3) {
      finalString = UTILS.concatenateStrings(finalString, "Dual Weapons");
    } else if(ability_1 == 4) {
      finalString = UTILS.concatenateStrings(finalString, "Grenades");
    } else if(ability_1 == 5) {
      finalString = UTILS.concatenateStrings(finalString, "Decoy");
    }
    
    return finalString;
  }

  function variantOf(uint256 tokenId) external view returns (uint256) {
    //  Check that token exists

    return _variants[tokenId];
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

interface IUtils {
  function concatenateStrings(string memory string_0, string memory string_1) external pure returns (string memory);
}