//  SPDX-License-Identifier: MIT
//  Author: Aimée MacDonald (aimeelmacdonald@pm.me)

pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @dev Special Sidekick series to be minted for CryptoWars Genesis Spies holders.
 * Meta data is stored statically at an external URL
 */
contract GenesisSK is Ownable, ERC721Enumerable, ReentrancyGuard {
  //  Base of each Token's URI
  string private _baseTokenURI;

  //  Root of the Merkle Tree for Whitelist
  bytes32 private _merkleRoot;

  //  Mapping from tokenID to Claimed Status
  mapping(uint256 => bool) _claimed;

  /**
   * @dev Emitted when '_merkleRoot' is set by the Owner.
   */
  event MerkleRootSet();

  /**
   * @dev Emitted when '_baseTokenURI' is set by the Owner.
   */
  event BaseURLChanged(string baseURI);

  constructor() ERC721("CryptoWars Genesis Sidekicks", "CWGS") {}

  /**
   * @dev Mints token 'tokenId' to Address 'recipient'.
   * Requires the token to not have been claimed or airdropped yet.
   * Can only be Called by the Contract Owner
   */
  function airdrop(address recipient, uint256 tokenId) external onlyOwner {
    require(!_claimed[tokenId], "GenesisSK: Token already Claimed");

    _claimed[tokenId] = true;
    _safeMint(recipient, tokenId);
  }

  /**
   * @dev Mints token 'tokenId' to the '_msgSender'.
   * Requires '_merkleRoot' to be set by the Owner.
   * Requires the token to not have been claimed or airdropped yet.
   */
  function whitelistClaim(uint256 tokenId, bytes32[] calldata proof) external nonReentrant {
    require(_merkleRoot != 0, "GenesisSK: Merkle Root not Set");
    require(!_claimed[tokenId], "GenesisSK: Token already Claimed");

    bytes32 leaf = keccak256(abi.encodePacked(_msgSender(), tokenId));
    require(MerkleProof.verify(proof, _merkleRoot, leaf), "GenesisSK: Invalid Proof");
    
    _claimed[tokenId] = true;
    _safeMint(_msgSender(), tokenId);
  }

  /**
   * @dev Sets '_merkleRoot'
   * Can only be Called by the Contract Owner
   * Emits a 'MerkleRootSet' Event
   */
  function setMerkleRoot(bytes32 root) external onlyOwner {
    _merkleRoot = root;

    emit MerkleRootSet();
  }

  /**
   * @dev Returns true if 'tokenId' has Already been Claimed or Airdropped
   */
  function isClaimed(uint256 tokenId) external view returns (bool) {
    return _claimed[tokenId];
  }

  /**
   * @dev Sets _baseTokenURI
   * Can only be Called by the Contract Owner
   * Emits a 'BaseURLChanged' Event
   */
  function setBaseURI(string memory baseURI) external onlyOwner {
    _baseTokenURI = baseURI;

    emit BaseURLChanged(baseURI);
  }

  /**
   * @dev Returns _baseTokenURI
   */
  function _baseURI() internal view override returns (string memory) {
    return _baseTokenURI;
  }
  
  /**
   * @dev Returns the Specific URI of the token 'tokenId'
   */
  function tokenURI(uint256 tokenId) public view override(ERC721) returns (string memory) {
    string memory _tokenURI = super.tokenURI(tokenId);

    return bytes(_tokenURI).length > 0 ? string(abi.encodePacked(_tokenURI, ".json")) : "";
  }
}