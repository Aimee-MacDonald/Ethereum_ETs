import BaseInterface from './BaseInterface'
import Ethets from '../artifacts/src/blockchain/contracts/Ethets.sol/Ethets.json'

export default class EthetsInterface extends BaseInterface {
  constructor() {
    super('0x5FbDB2315678afecb367f032d93F642f64180aa3', Ethets.abi)
    // Local: 0x5FbDB2315678afecb367f032d93F642f64180aa3
    // Kovan: 0xEfE1bC957a98a148fde0BDF3D9CC77d52c3de569
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
        .then(contract => contract.mint(recipient, amount))
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
}