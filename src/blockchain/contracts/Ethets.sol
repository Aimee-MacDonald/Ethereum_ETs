//SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

////
//  NOT IN PRODUCTION
//
import "hardhat/console.sol";
//
//  NOT IN PRODUCTION
////

contract Ethets is Ownable, ERC721Enumerable, VRFConsumerBase, ReentrancyGuard {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdTracker;
  Counters.Counter private _reservedTokenIdTracker;

  mapping(uint256 => Statistics) private _statistics;
  mapping(uint256 => VisualData) private _visualData;
  mapping(uint256 => uint256) private _rankGroup;
  mapping(uint256 => Ability) private _abilities;
  mapping(uint256 => WeaponTier) private _weaponTiers;
  mapping(uint256 => uint256) private _hybridCounts;
  mapping(bytes32 => RandomnessRequest) private _randomnessRequests;

  uint256[5] private _weaponUpgradeCosts;
  uint256[10] private _hybridCosts;
  bytes32 private immutable VRF_KEY_HASH;
  uint256 private immutable VRF_FEE;
  uint256 public constant MAX_TOKENS = 300; //  Should be set to 8000 in production
  uint256 public constant MAX_RESERVED_TOKENS = 333;
  uint256 public reservedTokensMinted;
  
  uint256 public mintingPrice = 35000000000000000; //  0.035 eth
  bool public saleIsActive;
  bool public rerollingIsActive;
  bool public hybridizationIsActive;
  string private _baseTokenURI;
  
  IUtils private UTILS;
  ISidekick private SIDEKICK;
  ICryptonium private CRP;

  event SaleIsActiveToggle(bool saleIsActive);
  event RerollingIsActiveToggle(bool rerollingIsActive);
  event HybridizationIsActiveToggle(bool hybridizationIsActive);
  event BaseURLChanged(string baseURI);
  event RandomnessRequested(bytes32 requestId);
  event StatsRerolled(uint256 tokenId);
  event VisualDataChanged(uint256 tokenId);
  event AbilityRerolled(uint256 tokenId);
  event WeaponUpgraded(uint256 tokenId);
  event SidekickAddressSet(address contractAddress);
  event CRPAddressSet(address contractAddress);
  event TokensHybridized(uint256 token_1, uint256 token_2);
  event FundsWithdrawn(string tokenSymbol);
  event MintingPriceChanged(uint256 newPrice);
  event ReservedTokenMinted(uint256 tokenId);

  struct RandomnessRequest {
    uint256 tokenId;
    RandomnessRequestType requestType;
    address recipient;
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

  struct VisualData {
    string background;
    string outfit;
    string belt;
    string token_type;
    string face_accessory;
    string head_gear;
    string weapon;
    string rank;
  }

  enum RandomnessRequestType {
    NONE,
    MINT,
    MINT_RESERVED,
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
  constructor(address utils, address vrfCoordinator, address linkToken) ERC721("CryptoWars Ethereum ET", "CWEE") VRFConsumerBase(vrfCoordinator, linkToken) {
    UTILS = IUtils(utils);

    VRF_KEY_HASH = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
    VRF_FEE = 0.0001 * 10 ** 18;

    _weaponUpgradeCosts[0] = 100;
    _weaponUpgradeCosts[1] = 200;
    _weaponUpgradeCosts[2] = 400;
    _weaponUpgradeCosts[3] = 1000;
    _weaponUpgradeCosts[4] = 1800;

    _hybridCosts[0] = 100;
    _hybridCosts[1] = 250;
    _hybridCosts[2] = 550;
    _hybridCosts[3] = 1150;
    _hybridCosts[4] = 1750;
    _hybridCosts[5] = 2350;
    _hybridCosts[6] = 2950;
    _hybridCosts[7] = 3550;
    _hybridCosts[8] = 3550;
    _hybridCosts[9] = 3550;
  }

  function toggleSaleIsActive() external onlyOwner {
    saleIsActive = !saleIsActive;

    emit SaleIsActiveToggle(saleIsActive);
  }

  function toggleRerollingIsActive() external onlyOwner {
    require(address(CRP) != address(0), "Ethets: CRP not set");
    
    rerollingIsActive = !rerollingIsActive;

    emit RerollingIsActiveToggle(rerollingIsActive);
  }

  function toggleHybridizationIsActive() external onlyOwner {
    hybridizationIsActive = !hybridizationIsActive;

    emit HybridizationIsActiveToggle(hybridizationIsActive);
  }

  function setSidekick(address contractAddress) external onlyOwner{
    require(address(SIDEKICK) == address(0), "Ethets: Sidekick has already been set");
    SIDEKICK = ISidekick(contractAddress);

    emit SidekickAddressSet(contractAddress);
  }

  function setCRP(address contractAddress) external onlyOwner {
    require(address(CRP) == address(0), "Ethets: CRP has already been set");
    CRP = ICryptonium(contractAddress);

    emit CRPAddressSet(contractAddress);
  }

  function setMintingPrice(uint256 newPrice) external onlyOwner {
    mintingPrice = newPrice;

    emit MintingPriceChanged(newPrice);
  }

  function mint(address recipient, uint256 amount) external payable nonReentrant {
    require(saleIsActive, "Ethets: Sale must be active to mint");
    require(amount > 0 && amount <= 30, "Ethets: Max 30 NFTs per transaction");
    require(totalSupply() + amount <= MAX_TOKENS, "Ethers: Purchase would exceed max supply");
    require(balanceOf(recipient) + amount <= 30, "Ethers: Limit is 30 tokens per wallet, sale not allowed");
    require(msg.value >= mintingPrice * amount, "Not enough ETH for transaction");
    require(LINK.balanceOf(address(this)) >= VRF_FEE, "Ethets: Not enough LINK in the contract");

    for(uint256 i = 0; i < amount; i++) {
      bytes32 requestId = requestRandomness(VRF_KEY_HASH, VRF_FEE);
      _randomnessRequests[requestId] = RandomnessRequest(0, RandomnessRequestType.MINT, recipient);

      emit RandomnessRequested(requestId);
    }
  }

  function mintReservedToken(address recipient, uint256 amount) external onlyOwner nonReentrant {
    require(reservedTokensMinted < MAX_RESERVED_TOKENS, "Ethets: Only 333 total reserved tokens can be minted");

    for(uint256 i = 0; i < amount; i++) {
      bytes32 requestId = requestRandomness(VRF_KEY_HASH, VRF_FEE);
      _randomnessRequests[requestId] = RandomnessRequest(0, RandomnessRequestType.MINT_RESERVED, recipient);

      emit RandomnessRequested(requestId);
    }
  }

  function statsOf(uint256 tokenId) public view returns (Statistics memory) {
    return _statistics[tokenId];
  }

  function visualDataOf(uint256 tokenId) public view returns (VisualData memory) {
    return _visualData[tokenId];
  }

  function rankGroupOf(uint256 tokenId) external view returns (uint256) {
    return _rankGroup[tokenId];
  }
  
  function abilityOf(uint256 tokenId) external view returns (Ability) {
    return _abilities[tokenId];
  }

  function stringAbilityOf(uint256 tokenId) external view returns (string memory) {
    uint256 ability = uint256(_abilities[tokenId]);

    if(ability == 0) {
      return "None";
    } else if(ability == 1) {
      return "Health Regen";
    } else if(ability == 2) {
      return "Shield";
    } else if(ability == 3) {
      return "Dual Weapons";
    } else if(ability == 4) {
      return "Grenades";
    } else if(ability == 5) {
      return "Decoy";
    }
  }

  function weaponTierOf(uint256 tokenId) external view returns (WeaponTier) {
    return _weaponTiers[tokenId];
  }

  function hybridCountOf(uint256 tokenId) external view returns (uint256) {
    return _hybridCounts[tokenId];
  }

  function rerollStats(uint256 tokenId) external nonReentrant {
    require(ownerOf(tokenId) == _msgSender(), "Ethets: This token does not belong to you");
    require(rerollingIsActive, "Ethets: Rerolling is not active");
    require(address(CRP) != address(0), "Ethets: CRP not set");
    require(LINK.balanceOf(address(this)) >= VRF_FEE, "Ethets: Not enough LINK in the contract");

    CRP.burnFrom(_msgSender(), 950);
    
    bytes32 requestId = requestRandomness(VRF_KEY_HASH, VRF_FEE);
    _randomnessRequests[requestId] = RandomnessRequest(tokenId, RandomnessRequestType.STATISTICS, address(0));

    emit RandomnessRequested(requestId);
  }

  function setVisualDataOf(uint256 tokenId, string memory background, string memory outfit, string memory belt, string memory tokenType, string memory faceAccessory, string memory headGear, string memory weapon, string memory rank, uint256 rankGroup) external onlyOwner {
    _rankGroup[tokenId] = rankGroup;
    _visualData[tokenId] = VisualData(background, outfit, belt, tokenType, faceAccessory, headGear, weapon, rank);

    emit VisualDataChanged(tokenId);
  }

  function rerollAbility(uint tokenId) external nonReentrant {
    require(rerollingIsActive, "Ethets: Rerolling is not active");
    require(address(CRP) != address(0), "Ethets: CRP not set");
    require(ownerOf(tokenId) == _msgSender(), "Ethets: This token does not belong to you");
    require(LINK.balanceOf(address(this)) >= VRF_FEE, "Ethets: Not enough LINK in the contract");
    
    CRP.burnFrom(_msgSender(), 2000);

    bytes32 requestId = requestRandomness(VRF_KEY_HASH, VRF_FEE);
    _randomnessRequests[requestId] = RandomnessRequest(tokenId, RandomnessRequestType.ABILITY, address(0));

    emit RandomnessRequested(requestId);
  }

  function upgradeWeapon(uint256 tokenId) external nonReentrant {
    require(rerollingIsActive, "Ethets: Rerolling is not active");
    require(address(CRP) != address(0), "Ethets: CRP not set");
    require(ownerOf(tokenId) == _msgSender(), "Ethets: This token does not belong to you");
    require(uint256(_weaponTiers[tokenId]) < 5, "Ethets: Weapon is already fully upgraded");

    uint256 weaponTier = uint256(_weaponTiers[tokenId]);
    uint256 upgradeCost = _weaponUpgradeCosts[weaponTier];
    CRP.burnFrom(_msgSender(), upgradeCost);

    uint256 newTier = uint256(_weaponTiers[tokenId]);
    _weaponTiers[tokenId] = WeaponTier(newTier + 1);
    
    emit WeaponUpgraded(tokenId);
  }

  function hybridize(uint256 token_1, uint256 token_2) external nonReentrant {
    require(hybridizationIsActive, "Ethets: Hybridization is not active");
    require(address(SIDEKICK) != address(0), "Ethets: Sidekick contract not set");
    require(address(CRP) != address(0), "Ethets: CRP not set");
    require(_exists(token_1) && _exists(token_2), "Ethets: operator query for nonexistent token");
    require(ownerOf(token_1) == _msgSender() && ownerOf(token_2) == _msgSender(), "Ethets: This token does not belong to you");
    require(_hybridCounts[token_1] < 10 && _hybridCounts[token_2] < 10, "Ethets: Hybridization limit reached");

    uint256 hybridCost = _hybridCosts[_hybridCounts[token_1]] + _hybridCosts[_hybridCounts[token_2]];

    CRP.burnFrom(_msgSender(), hybridCost);
    SIDEKICK.mint(token_1, token_2);

    _hybridCounts[token_1]++;
    _hybridCounts[token_2]++;

    emit TokensHybridized(token_1, token_2);
    
  }
  
  function _setStats(uint256 tokenId, uint256 randomSeed) private {
    uint256 numStats = 7;
    uint8[] memory statValues = new uint8[](numStats);

    for(uint256 i = 0; i < numStats; i++) statValues[i] = uint8(uint256(keccak256(abi.encodePacked(randomSeed, i))) % 100 + 1);

    _statistics[tokenId] = Statistics(statValues[0], statValues[1], statValues[2], statValues[3], statValues[4], statValues[5], statValues[6]);

    emit StatsRerolled(tokenId);
  }

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    RandomnessRequest memory request = _randomnessRequests[requestId];

    if(request.requestType == RandomnessRequestType.MINT) {
      _safeMint(request.recipient, _tokenIdTracker.current());
      _setStats(_tokenIdTracker.current(), randomness);
      _abilities[_tokenIdTracker.current()] = Ability.NONE;
      _weaponTiers[_tokenIdTracker.current()] = WeaponTier.TIER_0;

      _tokenIdTracker.increment();
    } else if(request.requestType == RandomnessRequestType.MINT_RESERVED) {
      _safeMint(request.recipient, MAX_TOKENS + _reservedTokenIdTracker.current());
      _setStats(_reservedTokenIdTracker.current(), randomness);
      _abilities[_reservedTokenIdTracker.current()] = Ability.NONE;
      _weaponTiers[_reservedTokenIdTracker.current()] = WeaponTier.TIER_0;

      _reservedTokenIdTracker.increment();
      reservedTokensMinted = reservedTokensMinted + 1;
      emit ReservedTokenMinted(reservedTokensMinted);

    } else if(request.requestType == RandomnessRequestType.STATISTICS) {
      _setStats(request.tokenId, randomness);
    } else if(request.requestType == RandomnessRequestType.ABILITY) {
      _abilities[request.tokenId] = Ability(randomness % 5 + 1);

      emit AbilityRerolled(request.tokenId);
    }

    delete _randomnessRequests[requestId];
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }
  
  function supportsInterface(bytes4 interfaceId) public view override(ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

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

  function jsonOf(uint256 tokenId) public view returns (string memory) {
    VisualData memory tokenVisuals = _visualData[tokenId];
    Statistics memory tokenStats = statsOf(tokenId);

    return UTILS.constructJSON(tokenVisuals, tokenStats);
  }

  function imageUrlOf(uint256 tokenId) public view returns (string memory) {
    return UTILS.constructImageURL(_baseTokenURI, tokenId);
  }

  function tokenURI(uint256 tokenId) public view override(ERC721) returns (string memory) {
    string memory attributes = jsonOf(tokenId);
    string memory image = imageUrlOf(tokenId);

    bytes memory json = abi.encodePacked('{"name":"CryptoWars Ethereum ET #', UTILS.toString(tokenId), '", "attributes":', attributes, ', "image":"', image, '"}');
    
    return string(abi.encodePacked('data:application/json;base64,', UTILS.encodeBase64(json)));
  }

  function withdrawETH() external onlyOwner {
    payable(owner()).transfer(address(this).balance);

    emit FundsWithdrawn("ETH");
  }

  function withdrawLINK() external onlyOwner {
    LINK.transfer(owner(), LINK.balanceOf(address(this)));
    
    emit FundsWithdrawn("LINK");
  }

  function withdrawCRP() external onlyOwner {
    require(address(CRP) != address(0), "Ethets: CRP not set");
    CRP.transfer(owner(), CRP.balanceOf(address(this)));
    
    emit FundsWithdrawn("CRP");
  }
}

interface ICryptonium is IERC20 {
  function burnFrom(address account, uint256 amount) external;
}

interface IUtils {
  function appendString(bytes memory buffer, string memory str) external pure;
  function toString(uint256 number) external pure returns (string memory);
  function encodeBase64(bytes memory data) external pure returns (string memory);
  function constructJSON(Ethets.VisualData memory tokenVisuals, Ethets.Statistics memory tokenStats) external pure returns (string memory);
  function constructImageURL(string memory baseTokenURI, uint256 tokenId) external pure returns (string memory);
}

interface ISidekick {
  function mint(uint256 tokenId_1, uint256 tokenId_2) external;
}