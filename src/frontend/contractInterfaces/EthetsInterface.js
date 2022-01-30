import BaseInterface from './BaseInterface'
import Ethets from '../artifacts/src/blockchain/contracts/Ethets.sol/Ethets.json'

export default class EthetsInterface extends BaseInterface {
  constructor() {
    super('0x2688bCC3d8065eFb470C79d6c9091Cf7De369e2a', Ethets.abi)
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

  reroll(tokenId) {
    if(super.ethCheck) {
      return super.getContract(true)
        .then(contract => contract.reroll(tokenId))
    }
  }
  
  abilityOf(tokenId) {
    if(super.ethCheck) {
      return super.getContract()
        .then(contract => contract.abilityOf(tokenId))
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