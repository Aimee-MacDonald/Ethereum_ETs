const { expect } = require('chai')

describe('Eth ETs', () => {
  let signers, ethets, vRFCoordinatorMock, mockCRP

  beforeEach(async () => {
    signers = await ethers.getSigners()

    const MockLink = await ethers.getContractFactory('MockLink')
    const mockLink = await MockLink.deploy()

    const MockCRP = await ethers.getContractFactory('MockCRP')
    mockCRP = await MockCRP.deploy()

    const VRFCoordinatorMock = await ethers.getContractFactory('VRFCoordinatorMock')
    vRFCoordinatorMock = await VRFCoordinatorMock.deploy(mockLink.address)
    
    const Ethets = await ethers.getContractFactory('Ethets')
    ethets = await Ethets.deploy(vRFCoordinatorMock.address, mockLink.address)

    await mockLink.mint(ethets.address, '20000000000000000000')
    await mockCRP.mint(signers[0].address, 10000)

    await ethets.toggleSaleIsActive()
    let requestId = await ethets.mint(signers[0].address, 1, {value: ethers.utils.parseEther('0.035')})
    requestId = await requestId.wait()
    requestId = requestId.events[0].data
    await vRFCoordinatorMock.callBackWithRandomness(requestId, 4, ethets.address)
  })

  describe('CRP', () => {
    it('Should set the CRP token address', async () => {
      await ethets.setCRP(mockCRP.address)
    })
  })

  describe('Permissions', () => {
    it('Should toggle rerollingIsActive', async () => {
      await ethets.toggleRerollingIsActive()
    })

    it('Should revert if rerollingIsActive is false', () => {
      expect(ethets.rerollStats(0)).to.be.revertedWith("Ethets: Rerolling is not active")
      expect(ethets.rerollAbility(0)).to.be.revertedWith("Ethets: Rerolling is not active")
    })
  })

  describe('Stats Rerolling', () => {
    it('Should require CRP to be set', async () => {
      await ethets.toggleRerollingIsActive()
      expect(ethets.rerollStats(0)).to.be.revertedWith('Ethets: CRP not set')
    })

    it('Should generate new stats', async () => {
      await ethets.toggleRerollingIsActive()
      await ethets.setCRP(mockCRP.address)
      let stats = await ethets.statsOf(0)
      
      expect(stats.firing_range).to.equal(2)
      expect(stats.firing_speed).to.equal(53)
      expect(stats.reload_speed).to.equal(90)
      expect(stats.melee_damage).to.equal(16)
      expect(stats.melee_speed).to.equal(2)
      expect(stats.magazine_capacity).to.equal(14)
      expect(stats.health).to.equal(54)
      
      await mockCRP.approve(ethets.address, 950)
      let requestId = await ethets.rerollStats(0)
      requestId = await requestId.wait()
      requestId = requestId.events[0].data
      await vRFCoordinatorMock.callBackWithRandomness(requestId, 8, ethets.address)
      
      stats = await ethets.statsOf(0)

      expect(stats.firing_range).to.equal(2)
      expect(stats.firing_speed).to.equal(53)
      expect(stats.reload_speed).to.equal(90)
      expect(stats.melee_damage).to.equal(16)
      expect(stats.melee_speed).to.equal(2)
      expect(stats.magazine_capacity).to.equal(14)
      expect(stats.health).to.equal(54)
    })

    it('Should cost 950 CRP', async () => {
      await ethets.toggleRerollingIsActive()
      await ethets.setCRP(mockCRP.address)
      expect(await mockCRP.balanceOf(signers[0].address)).to.equal(10000)

      await mockCRP.approve(ethets.address, 950)
      let requestId = await ethets.rerollStats(0)
      requestId = await requestId.wait()
      requestId = requestId.events[0].data
      await vRFCoordinatorMock.callBackWithRandomness(requestId, 16, ethets.address)
      
      expect(await mockCRP.balanceOf(signers[0].address)).to.equal(9050)
    })
  })

  describe('Ability Rerolling', () => {
    it('Should require CRP to be set', async () => {
      await ethets.toggleRerollingIsActive()
      expect(ethets.rerollAbility(0)).to.be.revertedWith('Ethets: CRP not set')
    })

    it('Should generate a new ability', async () => {
      await ethets.toggleRerollingIsActive()
      await ethets.setCRP(mockCRP.address)
      expect(await ethets.abilityOf(0)).to.equal(0)

      await mockCRP.approve(ethets.address, 2000)
      let requestId = await ethets.rerollAbility(0)
      requestId = await requestId.wait()
      requestId = requestId.events[2].data
      await vRFCoordinatorMock.callBackWithRandomness(requestId, 32, ethets.address)

      expect(await ethets.abilityOf(0)).to.equal(3)
      expect(await ethets.stringAbilityOf(0)).to.equal("Dual Weapons")
    })

    it('Should cost 2000 CRP', async () => {
      await ethets.toggleRerollingIsActive()
      await ethets.setCRP(mockCRP.address)
      expect(await mockCRP.balanceOf(signers[0].address)).to.equal(10000)

      await mockCRP.approve(ethets.address, 2000)
      let requestId = await ethets.rerollAbility(0)
      requestId = await requestId.wait()
      requestId = requestId.events[0].data
      await vRFCoordinatorMock.callBackWithRandomness(requestId, 32, ethets.address)

      expect(await mockCRP.balanceOf(signers[0].address)).to.equal(8000)
    })
  })

  describe('Weapon Upgrading', () => {
    it('Should require CRP to be set', async () => {
      await ethets.toggleRerollingIsActive()
      expect(ethets.upgradeWeapon(0)).to.be.revertedWith('Ethets: CRP not set')
    })

    it('Should upgrade the weapon tier', async () => {
      await ethets.toggleRerollingIsActive()
      await ethets.setCRP(mockCRP.address)
      expect(await ethets.weaponTierOf(0)).to.equal(0)

      await mockCRP.approve(ethets.address, 3500)
      await(ethets.upgradeWeapon(0))
      await(ethets.upgradeWeapon(0))
      await(ethets.upgradeWeapon(0))
      await(ethets.upgradeWeapon(0))
      await(ethets.upgradeWeapon(0))

      expect(await ethets.weaponTierOf(0)).to.equal(5)
      expect(ethets.upgradeWeapon(0)).to.be.revertedWith('Ethets: Weapon is already fully upgraded')
    })

    it('Should deduct relevant CRP cost', async () => {
      await ethets.toggleRerollingIsActive()
      await ethets.setCRP(mockCRP.address)
      await mockCRP.approve(ethets.address, 3500)

      expect(await mockCRP.balanceOf(signers[0].address)).to.equal(10000)
      await(ethets.upgradeWeapon(0))
      expect(await mockCRP.balanceOf(signers[0].address)).to.equal(9900)
      await(ethets.upgradeWeapon(0))
      expect(await mockCRP.balanceOf(signers[0].address)).to.equal(9700)
      await(ethets.upgradeWeapon(0))
      expect(await mockCRP.balanceOf(signers[0].address)).to.equal(9300)
      await(ethets.upgradeWeapon(0))
      expect(await mockCRP.balanceOf(signers[0].address)).to.equal(8300)
      await(ethets.upgradeWeapon(0))
      expect(await mockCRP.balanceOf(signers[0].address)).to.equal(6500)
    })
  })
})