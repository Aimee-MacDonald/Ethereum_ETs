import BaseInterface from './BaseInterface'
import Ethets from '../artifacts/src/blockchain/contracts/Ethets.sol/Ethets.json'
import { ethers } from 'ethers'

export default class EthetsInterface extends BaseInterface {
  constructor() {
    super('0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9', Ethets.abi)
    
    //  0x7487e67d8e01a5FCacA14AB34FB9503b9d7c6077
  }

  name() {
    if(super.ethCheck) {
      return super.getContract()
        .then(contract => contract.name())
    }
  }

  symbol() {
    if(super.ethCheck) {
      return super.getContract()
        .then(contract => contract.symbol())
    }
  }

  tokenURI(tokenId) {
    if(super.ethCheck) {
      return super.getContract()
        .then(contract => contract.tokenURI(tokenId))
    }
  }

  owner() {
    if(super.ethCheck) {
      return super.getContract()
        .then(contract => contract.owner())
    }
  }

  renounceOwnership() {
    if(super.ethCheck) {
      return super.getContract(true)
        .then(contract => contract.renounceOwnership())
    }
  }

  transferOwnership(to) {
    if(super.ethCheck) {
      return super.getContract(true)
        .then(contract => contract.transferOwnership(to))
    }
  }

  balance() {
    if(super.ethCheck) {
      return super.getSignerAddress()
        .then(address => this.balanceOf(address))
    }
  }

  balanceOf(owner) {
    if(super.ethCheck) {
      return super.getContract()
        .then(contract => contract.balanceOf(owner))
    }
  }

  ownerOf(tokenId) {
    if(super.ethCheck) {
      return super.getContract()
        .then(contract => contract.ownerOf(tokenId))
    }
  }

  approve(to, tokenId) {
    if(super.ethCheck) {
      return super.getContract(true)
        .then(contract => contract.approve(to, tokenId))
    }
  }

  getApproved(tokenId) {
    if(super.ethCheck) {
      return super.getContract()
        .then(contract => contract.getApproved(tokenId))
    }
  }

  setApprovalForAll(operator, approved) {
    if(super.ethCheck) {
      return super.getContract(true)
        .then(contract => contract.setApprovalForAll(operator, approved))
    }
  }

  isApprovedForAll(owner, operator) {
    if(super.ethCheck) {
      return super.getContract()
        .then(contract => contract.isApprovedForAll(owner, operator))
    }
  }

  transferFrom(from, to, tokenId) {
    if(super.ethCheck) {
      return super.getContract(true)
        .then(contract => contract.transferFrom(from, to, tokenId))
    }
  }

  tokenOfOwnerByIndex(owner, index) {
    if(super.ethCheck) {
      return super.getContract()
        .then(contract => contract.tokenOfOwnerByIndex(owner, index))
    }
  }

  totalSupply() {
    if(super.ethCheck) {
      return super.getContract()
        .then(contract => contract.totalSupply())
    }
  }

  tokenByIndex(index) {
    if(super.ethCheck) {
      return super.getContract()
        .then(contract => contract.tokenByIndex(index))
    }
  }


  mint(recipient, amount) {
    if(super.ethCheck) {
      return super.getContract(true)
        .then(contract => {
          const cost = 0.035 * amount
          contract.mint(recipient, amount, {value: ethers.utils.parseEther(`${cost}`)})
        })
    }
  }

  saleIsActive() {
    if(super.ethCheck) {
      return super.getContract()
        .then(contract => contract.saleIsActive())
    }
  }

  toggleSaleIsActive() {
    if(super.ethCheck) {
      return super.getContract(true)
        .then(contract => contract.toggleSaleIsActive())
    }
  }

  statsOf(tokenId) {
    if(super.ethCheck) {
      return super.getContract()
        .then(contract => contract.statsOf(tokenId))
    }
  }

  rerollStats(tokenId) {
    if(super.ethCheck) {
      return super.getContract(true)
        .then(contract => contract.rerollStats(tokenId))
    }
  }
  
  abilityOf(tokenId) {
    if(super.ethCheck) {
      return super.getContract()
        .then(contract => contract.abilityOf(tokenId))
    }
  }

  stringAbilityOf(tokenId) {
    if(super.ethCheck) {
      return super.getContract()
        .then(contract => contract.stringAbilityOf(tokenId))
    }
  }

  rerollAbility(tokenId) {
    if(super.ethCheck) {
      return super.getContract(true)
        .then(contract => contract.rerollAbility(tokenId))
    }
  }

  weaponTierOf(tokenId) {
    if(super.ethCheck) {
      return super.getContract()
        .then(contract => contract.weaponTierOf(tokenId))
    }
  }

  upgradeWeapon(tokenId) {
    if(super.ethCheck) {
      return super.getContract(true)
        .then(contract => contract.upgradeWeapon(tokenId))
    }
  }

  maxTokens() {
    if(super.ethCheck) {
      return super.getContract()
        .then(contract => contract.maxTokens())
    }
  }

  setBaseURI(baseURI) {
    if(super.ethCheck) {
      return super.getContract(true)
        .then(contract => contract.setBaseURI(baseURI))
    }
  }

  withdrawETH() {
    if(super.ethCheck) {
      return super.getContract(true)
        .then(contract => contract.withdrawETH())
    }
  }

  withdrawLINK() {
    if(super.ethCheck) {
      return super.getContract(true)
        .then(contract => contract.withdrawLINK())
    }
  }

  withdrawCRP() {
    if(super.ethCheck) {
      return super.getContract(true)
        .then(contract => contract.withdrawCRP())
    }
  }

  rerollingIsActive() {
    if(super.ethCheck) {
      return super.getContract()
        .then(contract => contract.rerollingIsActive())
    }
  }

  toggleRerollingIsActive() {
    if(super.ethCheck) {
      return super.getContract(true)
        .then(contract => contract.toggleRerollingIsActive())
    }
  }

  setCRP(crpAddress) {
    if(super.ethCheck) {
      return super.getContract(true)
        .then(contract => contract.setCRP(crpAddress))
    }
  }

  hybridizationIsActive() {
    if(super.ethCheck) {
      return super.getContract()
        .then(contract => contract.hybridizationIsActive())
    }
  }

  toggleHybridizationIsActive() {
    if(super.ethCheck) {
      return super.getContract(true)
        .then(contract => contract.toggleHybridizationIsActive())
    }
  }

  setSidekick(contractAddress) {
    if(super.ethCheck) {
      return super.getContract(true)
        .then(contract => contract.setSidekick(contractAddress))
    }
  }

  hybridize(tokenID_1, tokenID_2) {
    if(super.ethCheck) {
      return super.getContract(true)
        .then(contract => contract.hybridize(tokenID_1, tokenID_2))
    }
  }

  hybridCountOf(tokenID) {
    if(super.ethCheck) {
      return super.getContract()
        .then(contract => contract.hybridCountOf(tokenID))
    }
  }

  imageUrlOf(tokenId) {
    if(super.ethCheck) {
      return super.getContract()
        .then(contract => contract.imageUrlOf(tokenId))
    }
  }

  mintingPrice() {
    if(super.ethCheck) {
      return super.getContract()
        .then(contract => contract.mintingPrice())
    }
  }

  setMintingPrice(price) {
    if(super.ethCheck) {
      return super.getContract(true)
        .then(contract => contract.setMintingPrice(price))
    }
  }

  reservedTokensMinted() {
    if(super.ethCheck) {
      return super.getContract()
        .then(contract => contract.reservedTokensMinted())
    }
  }

  mintReservedToken(recipient, amount) {
    if(super.ethCheck) {
      return super.getContract(true)
        .then(contract => contract.mintReservedToken(recipient, amount))
    }
  }

  visualDataOf(tokenId) {
    if(super.ethCheck) {
      return super.getContract()
        .then(contract => contract.visualDataOf(tokenId))
    }
  }

  setVisualDataOf(tokenId, background, belt, face_accessory, head_gear, outfit, rank, token_type, weapon) {
    if(super.ethCheck) {
      return super.getContract(true)
        .then(contract => contract.setVisualDataOf(tokenId, background, belt, face_accessory, head_gear, outfit, rank, token_type, weapon))
    }
  }
}