import BaseInterface from './BaseInterface'
import VRFCoordinatorMock from '../artifacts/src/blockchain/contracts/mocks/VRFCoordinatorMock.sol/VRFCoordinatorMock.json'

export default class VRFCoordinatorInterface extends BaseInterface {
  constructor() {
    super('0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0', VRFCoordinatorMock.abi)
  }
  
  callBackWithRandomness(requestId, randomness, consumerContract) {
    if(super.ethCheck) {
      return super.getContract()
        .then(contract => contract.callBackWithRandomness(requestId, randomness, consumerContract))
    }
  }
}