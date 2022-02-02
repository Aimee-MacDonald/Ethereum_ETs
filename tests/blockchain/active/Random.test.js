const { expect } = require('chai')

describe('Random', () => {
  let random, vRFCoordinatorMock

  beforeEach(async () => {
    const MockLink = await ethers.getContractFactory('MockLink')
    const mockLink = await MockLink.deploy()

    const VRFCoordinatorMock = await ethers.getContractFactory('VRFCoordinatorMock')
    vRFCoordinatorMock = await VRFCoordinatorMock.deploy(mockLink.address)

    const Random = await ethers.getContractFactory('Random')
    random = await Random.deploy(vRFCoordinatorMock.address, mockLink.address)

    await mockLink.mint(random.address, '20000000000000000000')
  })

  it('Should generate a new random value', async () => {
    expect(await random.randomResult()).to.equal(0)
    
    await random.generateRandomNumber()
    await vRFCoordinatorMock.callBackWithRandomness(4, 4, random.address)
    
    expect(await random.randomResult()).to.equal(4)
  })
})