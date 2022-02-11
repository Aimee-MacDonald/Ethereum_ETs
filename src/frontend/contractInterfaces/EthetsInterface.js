import BaseInterface from './BaseInterface'
import Ethets from '../artifacts/src/blockchain/contracts/Ethets.sol/Ethets.json'
import { ethers } from 'ethers'

export default class EthetsInterface extends BaseInterface {
  constructor() {
    super('0x37683c6066DC837BC6660509FF5C73b2680a3f11', Ethets.abi)
    // Mumbai: 0xFf9661Cc7e8eC75702bcFD648c08D0Aa443c1c90
    // Local: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
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
        .then(contract => {
          const value = 0.035 * amount
          contract.mint(recipient, amount, {value: ethers.utils.parseEther(`${value}`)})
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
}