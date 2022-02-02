//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
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

contract Ethets is Ownable, ERC721Enumerable, VRFConsumerBase {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdTracker;

  mapping(uint256 => Statistics) private _statistics;
  mapping(uint256 => Ability) private _abilities;
  mapping(uint256 => WeaponTier) private _weaponTiers;
  mapping(bytes32 => uint256) private _vrfRequestToToken;

  bool public saleIsActive;
  uint256 public maxTokens = 900;
  string private _baseTokenURI;
  bytes32 internal keyHash;
  uint256 internal fee;

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

  constructor(address vrfCoordinator, address linkToken) ERC721("CryptoWars Ethereum ET", "CWEE") VRFConsumerBase(vrfCoordinator, linkToken) {
    keyHash = 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4;
    fee = 0.1 * 10 ** 18;
  }

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    _setStats(_vrfRequestToToken[requestId], randomness);
  }

  function mint(address recipient, uint256 amount) external returns (bool) {
    require(saleIsActive, "Ethets: Sale must be active to mint");
    require(amount > 0 && amount <= 30, "Ethets: Max 30 NFTs per transaction");
    require(totalSupply() + amount <= maxTokens, "Ethers: Purchase would exceed max supply");
    require(balanceOf(recipient) + amount <= 30, "Ethers: Limit is 30 tokens per wallet, sale not allowed");

    for(uint256 i = 0; i < amount; i++) {
      require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
      bytes32 requestId = requestRandomness(keyHash, fee);
      _vrfRequestToToken[requestId] = _tokenIdTracker.current();
      
      _safeMint(recipient, _tokenIdTracker.current());
      
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

  function _setStats(uint256 tokenId, uint256 randomSeed) private {
    uint256 numStats = 7;

    uint8[] memory statValues = new uint8[](numStats);

    for(uint256 i = 0; i < numStats; i++) statValues[i] = uint8(uint256(keccak256(abi.encodePacked(randomSeed, i))) % 100 + 1);

    _statistics[tokenId] = Statistics(statValues[0], statValues[1], statValues[2], statValues[3], statValues[4], statValues[5], statValues[6]);
  }

  function statsOf(uint256 tokenId) external view returns (Statistics memory) {
    return _statistics[tokenId];
  }

  function rerollStats(uint256 tokenId) external returns (bool) {
    require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
    bytes32 requestId = requestRandomness(keyHash, fee);
    _vrfRequestToToken[requestId] = _tokenIdTracker.current();

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