import BaseInterface from './BaseInterface'
import MockCRP from '../artifacts/src/blockchain/contracts/MockCRP.sol/MockCRP.json'
import { ethers } from 'ethers'

export default class MockCRPInterface extends BaseInterface {
  constructor() {
    super('0xbB71945C2645579A5Eea72A621c93523edAa220D', MockCRP.abi)
  }

  approveAll() {
    if(super.ethCheck) {
      let _contract, _address, _balance
      
      return super.getSignerAddress()
        .then(address => _address = address)
        .then(() => super.getContract(true))
        .then(contract => _contract = contract)
        .then(() => _contract.balanceOf(_address))
        .then(balance => _balance = balance.toString())
        .then(() => _contract.approve('0x4DE0B9D1AfDF2154b00A21D0119f155238754CE8', _balance))
    }
  }
}