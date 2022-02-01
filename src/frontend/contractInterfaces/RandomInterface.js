import BaseInterface from './BaseInterface'
import Random from '../artifacts/src/blockchain/contracts/Random.sol/Random.json'

export default class EthetsInterface extends BaseInterface {
  constructor() {
    super('0xA6239b6f7E5C5F6e1F2B992a087B71A2e28b2e91', Random.abi)
    // Local: 0x5FbDB2315678afecb367f032d93F642f64180aa3
    // Kovan: 0x2688bCC3d8065eFb470C79d6c9091Cf7De369e2a
  }

  randomResult() {
    if(super.ethCheck) {
      return super.getContract()
        .then(contract => contract.randomResult())
    }
  }

  generateRandomNumber() {
    if(super.ethCheck) {
      return super.getContract(true)
        .then(contract => contract.generateRandomNumber())
    }
  }

  linkValue() {
    if(super.ethCheck) {
      return super.getContract(true)
        .then(contract => contract.linkValue())
    }
  }
}