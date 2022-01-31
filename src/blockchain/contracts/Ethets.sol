//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

////
//  NOT IN PRODUCTION
//
import "hardhat/console.sol";
//
//  NOT IN PRODUCTION
////

contract Ethets is Ownable, ERC721Enumerable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdTracker;

  mapping(uint256 => Statistics) private _statistics;
  mapping(uint256 => Ability) private _abilities;
  mapping(uint256 => WeaponTier) private _weaponTiers;

  bool public saleIsActive;
  uint256 public maxTokens = 900;
  string private _baseTokenURI;

  ////
  //  NOT IN PRODUCTION
  //
  uint256 public randCounter = 16;
  //
  //  NOT IN PRODUCTION
  ////

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

  enum WeaponTier {
    TIER_0,
    TIER_1,
    TIER_2,
    TIER_3,
    TIER_4,
    TIER_5
  }

  event SaleIsActiveToggle(bool saleIsActive);
  event BaseURLChanged(string baseURI);
  event StatsRerolled(uint256 tokenId);
  event AbilityRerolled(uint256 tokenId);
  event WeaponUpgraded(uint256 tokenId);

  constructor() ERC721("CryptoWars Ethereum ET", "CWEE") {}

  function mint(address recipient, uint256 amount) external returns (bool) {
    require(saleIsActive, "Ethets: Sale must be active to mint");
    require(amount > 0 && amount <= 30, "Ethets: Max 30 NFTs per transaction");
    require(totalSupply() + amount <= maxTokens, "Ethers: Purchase would exceed max supply");
    require(balanceOf(recipient) + amount <= 30, "Ethers: Limit is 30 tokens per wallet, sale not allowed");

    for(uint256 i = 0; i < amount; i++) {
      _safeMint(recipient, _tokenIdTracker.current());

      ////
      //  NOT IN PRODUCTION
      //
      uint8 firing_range = uint8(uint256(keccak256(abi.encodePacked(randCounter))) % 100 + 1);
      randCounter = randCounter + 1;

      uint8 firing_speed = uint8(uint256(keccak256(abi.encodePacked(randCounter))) % 100 + 1);
      randCounter = randCounter + 1;

      uint8 reload_speed = uint8(uint256(keccak256(abi.encodePacked(randCounter))) % 100 + 1);
      randCounter = randCounter + 1;

      uint8 melee_damage = uint8(uint256(keccak256(abi.encodePacked(randCounter))) % 100 + 1);
      randCounter = randCounter + 1;

      uint8 melee_speed = uint8(uint256(keccak256(abi.encodePacked(randCounter))) % 100 + 1);
      randCounter = randCounter + 1;

      uint8 magazine_capacity = uint8(uint256(keccak256(abi.encodePacked(randCounter))) % 100 + 1);
      randCounter = randCounter + 1;

      uint8 health = uint8(uint256(keccak256(abi.encodePacked(randCounter))) % 100 + 1);
      randCounter = randCounter + 1;


      _statistics[_tokenIdTracker.current()] = Statistics(firing_range, firing_speed, reload_speed, melee_damage, melee_speed, magazine_capacity, health);
      //
      //  NOT IN PRODUCTION
      ////

      _abilities[_tokenIdTracker.current()] = Ability.NONE;
      _weaponTiers[_tokenIdTracker.current()] = WeaponTier.TIER_0;
      _tokenIdTracker.increment();
    }

    return true;
  }
  
  function toggleSaleIsActive() external onlyOwner {
    saleIsActive = !saleIsActive;
    emit SaleIsActiveToggle(saleIsActive);
  }

  function statsOf(uint256 tokenId) external view returns (Statistics memory) {
    return _statistics[tokenId];
  }

  function rerollStats(uint256 tokenId) external returns (bool) {

    ////
    //  NOT IN PRODUCTION
    //
    uint8 firing_range = uint8(uint256(keccak256(abi.encodePacked(randCounter))) % 100 + 1);
    randCounter = randCounter + 1;

    uint8 firing_speed = uint8(uint256(keccak256(abi.encodePacked(randCounter))) % 100 + 1);
    randCounter = randCounter + 1;

    uint8 reload_speed = uint8(uint256(keccak256(abi.encodePacked(randCounter))) % 100 + 1);
    randCounter = randCounter + 1;

    uint8 melee_damage = uint8(uint256(keccak256(abi.encodePacked(randCounter))) % 100 + 1);
    randCounter = randCounter + 1;

    uint8 melee_speed = uint8(uint256(keccak256(abi.encodePacked(randCounter))) % 100 + 1);
    randCounter = randCounter + 1;

    uint8 magazine_capacity = uint8(uint256(keccak256(abi.encodePacked(randCounter))) % 100 + 1);
    randCounter = randCounter + 1;

    uint8 health = uint8(uint256(keccak256(abi.encodePacked(randCounter))) % 100 + 1);
    randCounter = randCounter + 1;

    _statistics[tokenId] = Statistics(firing_range, firing_speed, reload_speed, melee_damage, melee_speed, magazine_capacity, health);
    //
    //  NOT IN PRODUCTION
    ////

    emit StatsRerolled(tokenId);

    return true;
  }

  function abilityOf(uint256 tokenId) external view returns (Ability) {
    return _abilities[tokenId];
  }

  function rerollAbility(uint tokenId) external returns (bool) {

    ////
    //  NOT IN PRODUCTION
    //
    _abilities[tokenId] = Ability(uint256(keccak256(abi.encodePacked(randCounter))) % 5 + 1);
    randCounter = randCounter + 1;
    //
    //  NOT IN PRODUCTION
    ////

    emit AbilityRerolled(tokenId);

    return true;
  }

  function weaponTierOf(uint256 tokenId) external view returns (WeaponTier) {
    return _weaponTiers[tokenId];
  }

  function upgradeWeapon(uint256 tokenId) external returns (bool) {
    require(uint256(_weaponTiers[tokenId]) < 5, "Ethets: Weapon is already fully upgraded");

    uint256 newTier = uint256(_weaponTiers[tokenId]);
    _weaponTiers[tokenId] = WeaponTier(newTier + 1);
    
    emit WeaponUpgraded(tokenId);
    
    return true;
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }
  
  function supportsInterface(bytes4 interfaceId) public view override(ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  ////
  //  URI management part from CryptoWarsGenesisSpies
  ////

  function _setBaseURI(string memory baseURI) internal virtual {
    _baseTokenURI = baseURI;
  }

  function _baseURI() internal view override returns (string memory) {
    return _baseTokenURI;
  }

  function setBaseURI(string memory baseURI) external onlyOwner {
    _setBaseURI(baseURI);
    emit BaseURLChanged(baseURI);
  }

  function tokenURI(uint256 tokenId) public view override(ERC721) returns (string memory) {
    string memory _tokenURI = super.tokenURI(tokenId);
    return bytes(_tokenURI).length > 0 ? string(abi.encodePacked(_tokenURI, ".json")) : "";
  }
}