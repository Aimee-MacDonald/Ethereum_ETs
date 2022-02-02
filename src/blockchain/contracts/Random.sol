//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "hardhat/console.sol";

contract Random is VRFConsumerBase {
  bytes32 internal keyHash;
  uint256 internal fee;
  
  uint256 public randomResult;

  event RandomRequested(bytes32 requestId);

  //0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9, 0xa36085F69e2889c224210F603D836748e7dC0088
  constructor(address vrfCoordinator, address linkToken) VRFConsumerBase(vrfCoordinator, linkToken) {
    keyHash = 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4;
    fee = 0.1 * 10 ** 18;
  }

  function linkValue() external view returns (uint256) {
    return LINK.balanceOf(address(this));
  }

  function generateRandomNumber() public returns (bytes32) {
    require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");

    bytes32 requestId = requestRandomness(keyHash, fee);

    emit RandomRequested(requestId);

    return requestId;
  }

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    console.logBytes32(requestId);

    randomResult = randomness;
  }
}