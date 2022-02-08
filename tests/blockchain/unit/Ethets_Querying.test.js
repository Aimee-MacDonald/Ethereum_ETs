const { expect } = require('chai')

describe('Eth ETs', () => {
  let signers, ethets

  beforeEach(async () => {
    signers = await ethers.getSigners()

    const MockLink = await ethers.getContractFactory('MockLink')
    const mockLink = await MockLink.deploy()

    const VRFCoordinatorMock = await ethers.getContractFactory('VRFCoordinatorMock')
    const vRFCoordinatorMock = await VRFCoordinatorMock.deploy(mockLink.address)

    const Ethets = await ethers.getContractFactory('Ethets')
    ethets = await Ethets.deploy(vRFCoordinatorMock.address, mockLink.address)

    await mockLink.mint(ethets.address, '20000000000000000000')
    await ethets.toggleSaleIsActive()

    let requestId = await ethets.mint(signers[0].address, 1, {value: ethers.utils.parseEther('0.035')})
    requestId = await requestId.wait()
    requestId = requestId.events[0].data
    await vRFCoordinatorMock.callBackWithRandomness(requestId, 4, ethets.address)
  })

  describe('Querying', () => {
    it('Should return on-chain statistics data by token ID', async () => {
      const stats = await ethets.statsOf(0)

      expect(stats.firing_range).to.equal(2)
      expect(stats.firing_speed).to.equal(53)
      expect(stats.reload_speed).to.equal(90)
      expect(stats.melee_damage).to.equal(16)
      expect(stats.melee_speed).to.equal(2)
      expect(stats.magazine_capacity).to.equal(14)
      expect(stats.health).to.equal(54)
    })

    it('Should return on-chain ability data by token ID', async () => {
      const ability = await ethets.abilityOf(0)

      expect(ability).to.equal(0)
    })
    
    it('Should return weapon tier by token ID', async () => {
      const weaponTier = await ethets.weaponTierOf(0)

      expect(weaponTier).to.equal(0)
    })

    it('Should return the hybrid count of a token', async () => {
      expect(await ethets.hybridCountOf(0)).to.equal(0)
    })
  })
})