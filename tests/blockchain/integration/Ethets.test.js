const { expect } = require('chai')

describe('Ethets integration', () => {
  let signers, ethets, ethetsks

  beforeEach(async () => {
    signers = await ethers.getSigners()

    const MockLink = await ethers.getContractFactory('MockLink')
    const mockLink = await MockLink.deploy()

    const VRFCoordinatorMock = await ethers.getContractFactory('VRFCoordinatorMock')
    const vrfCoordinatorMock = await VRFCoordinatorMock.deploy(mockLink.address)

    const Ethets = await ethers.getContractFactory('Ethets')
    ethets = await Ethets.deploy(vrfCoordinatorMock.address, mockLink.address)

    const Ethetsks = await ethers.getContractFactory('Ethetsks')
    ethetsks = await Ethetsks.deploy(ethets.address)

    const Cryptonium = await ethers.getContractFactory('Cryptonium')
    const cryptonium = await Cryptonium.deploy()

    await ethets.setSidekick(ethetsks.address)
    await ethets.setCRP(cryptonium.address)

    await ethets.toggleSaleIsActive()
    await ethets.toggleHybridizationIsActive()

    await mockLink.mint(ethets.address, '20000000000000000000')
    await cryptonium.mint(signers[0].address, '50000')
    await cryptonium.approve(ethets.address, '50000')

    let requestId = await ethets.mint(signers[0].address, 2, {value: ethers.utils.parseEther('0.7')})
    requestId = await requestId.wait()
    requestId = requestId.events[0].data
    await vrfCoordinatorMock.callBackWithRandomness(requestId, 2, ethets.address)
  })

  describe('Hybridization', () => {
    it('Should mint a new Ethereum ET Sidekick', async () => {
      expect(await ethetsks.balanceOf(signers[0].address)).to.equal(0)

      await ethets.hybridize(0, 1)

      expect(await ethetsks.balanceOf(signers[0].address)).to.equal(1)
    })
  })
})