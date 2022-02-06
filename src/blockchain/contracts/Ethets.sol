//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

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
  mapping(bytes32 => RandomnessRequest) private _randomnessRequests;

  bytes32 private immutable VRF_KEY_HASH;
  uint256 private immutable VRF_FEE;
  uint256 public constant MAX_TOKENS = 900;
  
  bool public saleIsActive;
  bool public hybridizationIsActive;
  string private _baseTokenURI;
  ISidekick private SIDEKICK;

  event SaleIsActiveToggle(bool saleIsActive);
  event HybridizationIsActiveToggle(bool hybridizationIsActive);
  event BaseURLChanged(string baseURI);
  event RandomnessRequested(bytes32 requestId);
  event StatsRerolled(uint256 tokenId);
  event AbilityRerolled(uint256 tokenId);
  event WeaponUpgraded(uint256 tokenId);

  struct RandomnessRequest {
    uint256 tokenId;
    RandomnessRequestType requestType;
    address recipient;
    uint256 amount;
  }

  struct Statistics {
    uint8 firing_range;
    uint8 firing_speed;
    uint8 reload_speed;
    uint8 melee_damage;
    uint8 melee_speed;
    uint8 magazine_capacity;
    uint8 health;
  }

  enum RandomnessRequestType {
    NONE,
    MINT,
    STATISTICS,
    ABILITY
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

  ////
  //
  //  In production, these parameters can be made constant
  //
  ////
  constructor(address vrfCoordinator, address linkToken) ERC721("CryptoWars Ethereum ET", "CWEE") VRFConsumerBase(vrfCoordinator, linkToken) {
    VRF_KEY_HASH = 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4;
    VRF_FEE = 0.1 * 10 ** 18;
  }

  function toggleSaleIsActive() external onlyOwner {
    saleIsActive = !saleIsActive;

    emit SaleIsActiveToggle(saleIsActive);
  }

  function toggleHybridizationIsActive() external onlyOwner {
    hybridizationIsActive = !hybridizationIsActive;

    emit HybridizationIsActiveToggle(hybridizationIsActive);
  }
  
  function setSidekick(address contractAddress) external onlyOwner returns (bool) {
    require(address(SIDEKICK) == address(0), "Ethets: Sidekick has already been set");

    SIDEKICK = ISidekick(contractAddress);

    return true;
  }

  function mint(address recipient, uint256 amount) external returns (bool) {
    require(saleIsActive, "Ethets: Sale must be active to mint");
    require(amount > 0 && amount <= 30, "Ethets: Max 30 NFTs per transaction");
    require(totalSupply() + amount <= MAX_TOKENS, "Ethers: Purchase would exceed max supply");
    require(balanceOf(recipient) + amount <= 30, "Ethers: Limit is 30 tokens per wallet, sale not allowed");
    require(LINK.balanceOf(address(this)) >= VRF_FEE, "Ethets: Not enough LINK in the contract");

    bytes32 requestId = requestRandomness(VRF_KEY_HASH, VRF_FEE);
    _randomnessRequests[requestId] = RandomnessRequest(0, RandomnessRequestType.MINT, recipient, amount);

    emit RandomnessRequested(requestId);

    return true;
  }

  function statsOf(uint256 tokenId) external view returns (Statistics memory) {
    return _statistics[tokenId];
  }
  
  function abilityOf(uint256 tokenId) external view returns (Ability) {
    return _abilities[tokenId];
  }

  function weaponTierOf(uint256 tokenId) external view returns (WeaponTier) {
    return _weaponTiers[tokenId];
  }

  function rerollStats(uint256 tokenId) external returns (bool) {
    ////
    //  !!!! IMPORTANT !!!!
    //
    //  Requires CRP
    //
    //  !!!! IMPORTANT !!!!
    ////
    require(LINK.balanceOf(address(this)) >= VRF_FEE, "Ethets: Not enough LINK in the contract");
    
    bytes32 requestId = requestRandomness(VRF_KEY_HASH, VRF_FEE);
    _randomnessRequests[requestId] = RandomnessRequest(tokenId, RandomnessRequestType.STATISTICS, address(0), 0);

    emit RandomnessRequested(requestId);

    return true;
  }

  function rerollAbility(uint tokenId) external returns (bool) {
    ////
    //  !!!! IMPORTANT !!!!
    //
    //  Requires CRP
    //
    //  !!!! IMPORTANT !!!!
    ////
    require(LINK.balanceOf(address(this)) >= VRF_FEE, "Ethets: Not enough LINK in the contract");
    
    bytes32 requestId = requestRandomness(VRF_KEY_HASH, VRF_FEE);
    _randomnessRequests[requestId] = RandomnessRequest(tokenId, RandomnessRequestType.ABILITY, address(0), 0);

    emit RandomnessRequested(requestId);

    return true;
  }

  function upgradeWeapon(uint256 tokenId) external returns (bool) {
    ////
    //  !!!! IMPORTANT !!!!
    //
    //  Requires CRP
    //
    //  !!!! IMPORTANT !!!!
    ////
    require(uint256(_weaponTiers[tokenId]) < 5, "Ethets: Weapon is already fully upgraded");

    uint256 newTier = uint256(_weaponTiers[tokenId]);
    _weaponTiers[tokenId] = WeaponTier(newTier + 1);
    
    emit WeaponUpgraded(tokenId);
    
    return true;
  }

  function _fullMint(address recipient, uint256 amount, uint256 randomSeed) private {
    for(uint256 i = 0; i < amount; i++) {
      uint256 randomness = uint256(keccak256(abi.encodePacked(randomSeed, i)));

      _safeMint(recipient, _tokenIdTracker.current());
      _setStats(_tokenIdTracker.current(), randomness);
      _abilities[_tokenIdTracker.current()] = Ability.NONE;
      _weaponTiers[_tokenIdTracker.current()] = WeaponTier.TIER_0;

      _tokenIdTracker.increment();
    }
  }

  function _setStats(uint256 tokenId, uint256 randomSeed) private {
    uint256 numStats = 7;
    uint8[] memory statValues = new uint8[](numStats);

    for(uint256 i = 0; i < numStats; i++) statValues[i] = uint8(uint256(keccak256(abi.encodePacked(randomSeed, i))) % 100 + 1);

    _statistics[tokenId] = Statistics(statValues[0], statValues[1], statValues[2], statValues[3], statValues[4], statValues[5], statValues[6]);
  }

  function _setAbility(uint256 tokenId, uint256 randomSeed) private {
    _abilities[tokenId] = Ability(randomSeed % 5 + 1);
  }

  function hybridize(uint256 token_1, uint256 token_2) external returns (bool) {
    ////
    //  !!!! IMPORTANT !!!!
    //
    //  Requires CRP
    //
    //  !!!! IMPORTANT !!!!
    ////
    require(hybridizationIsActive, "Ethets: Hybridization is not active");
    require(address(SIDEKICK) != address(0), "Ethets: Sidekick contract not set");
    require(_exists(token_1) && _exists(token_2), "Ethets: operator query for nonexistent token");
    require(ownerOf(token_1) == _msgSender() && ownerOf(token_2) == _msgSender(), "Ethets: This token does not belong to you");

    SIDEKICK.mint(_msgSender());

    return true;
  }

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    RandomnessRequest memory request = _randomnessRequests[requestId];
    require(request.requestType != RandomnessRequestType.NONE, "Ethets: RandomnessRequest does not have a type");

    if(request.requestType == RandomnessRequestType.MINT) {
      _fullMint(request.recipient, request.amount, randomness);
    } else if(request.requestType == RandomnessRequestType.STATISTICS) {
      _setStats(request.tokenId, randomness);
      emit StatsRerolled(request.tokenId);
    } else if(request.requestType == RandomnessRequestType.ABILITY) {
      _setAbility(request.tokenId, randomness);
      emit AbilityRerolled(request.tokenId);
    }

    ////
    //  !!!! IMPORTANT !!!!
    //
    //  Delete RandomnessRequest
    //
    //  !!!! IMPORTANT !!!!
    ////
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }
  
  function supportsInterface(bytes4 interfaceId) public view override(ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  ////
  //
  //  URI management part from CryptoWarsGenesisSpies
  //  Needs Black Magic here....
  //
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

interface ISidekick {
  function mint(address recipient) external returns (bool);
}