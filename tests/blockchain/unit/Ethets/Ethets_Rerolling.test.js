const { expect } = require('chai')

describe('Eth ETs', () => {
  let signers, ethets, vRFCoordinatorMock, mockCRP

  beforeEach(async () => {
    signers = await ethers.getSigners()

    const Utils = await ethers.getContractFactory('Utils')
    const utils = await Utils.deploy()
    await utils.deployed()

    const MockLink = await ethers.getContractFactory('MockLink')
    const mockLink = await MockLink.deploy()

    const MockCRP = await ethers.getContractFactory('MockCRP')
    mockCRP = await MockCRP.deploy()

    const VRFCoordinatorMock = await ethers.getContractFactory('VRFCoordinatorMock')
    vRFCoordinatorMock = await VRFCoordinatorMock.deploy(mockLink.address)
    
    const Ethets = await ethers.getContractFactory('Ethets')
    ethets = await Ethets.deploy(utils.address, vRFCoordinatorMock.address, mockLink.address)

    await mockLink.mint(ethets.address, '20000000000000000000')
    await mockCRP.mint(signers[0].address, 10000)
    await mockCRP.mint(signers[1].address, 10000)

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
    it('toggleRerollingIsActive Should require CRP to be set', async () => {
      expect(await ethets.rerollingIsActive()).to.equal(false)
      
      expect(ethets.toggleRerollingIsActive()).to.be.revertedWith('Ethets: CRP not set')
      await ethets.setCRP(mockCRP.address)
      await ethets.toggleRerollingIsActive()

      expect(await ethets.rerollingIsActive()).to.equal(true)
    })
    
    it('Should toggle rerollingIsActive', async () => {
      expect(await ethets.rerollingIsActive()).to.equal(false)

      await ethets.setCRP(mockCRP.address)
      await ethets.toggleRerollingIsActive()

      expect(await ethets.rerollingIsActive()).to.equal(true)
    })

    it('Should revert if rerollingIsActive is false', () => {
      expect(ethets.rerollStats(0)).to.be.revertedWith("Ethets: Rerolling is not active")
      expect(ethets.rerollAbility(0)).to.be.revertedWith("Ethets: Rerolling is not active")
    })

    it('Should revert if token is not owned by transaction caller', async () => {
      await ethets.setCRP(mockCRP.address)
      await ethets.toggleRerollingIsActive()
      await mockCRP.connect(signers[1]).approve(ethets.address, 10000)

      expect(ethets.connect(signers[1]).rerollStats(0)).to.be.revertedWith("Ethets: This token does not belong to you")
      expect(ethets.connect(signers[1]).rerollAbility(0)).to.be.revertedWith("Ethets: This token does not belong to you")
      expect(ethets.connect(signers[1]).upgradeWeapon(0)).to.be.revertedWith("Ethets: This token does not belong to you")
    })
  })

  describe('Stats Rerolling', () => {
    it('Should generate new stats', async () => {
      await ethets.setCRP(mockCRP.address)
      await ethets.toggleRerollingIsActive()
      let stats = await ethets.statsOf(0)
      
      expect(stats.firing_range).to.equal(66)
      expect(stats.firing_speed).to.equal(88)
      expect(stats.reload_speed).to.equal(8)
      expect(stats.melee_damage).to.equal(98)
      expect(stats.melee_speed).to.equal(52)
      expect(stats.magazine_capacity).to.equal(58)
      expect(stats.health).to.equal(10)
      
      await mockCRP.approve(ethets.address, 950)
      let requestId = await ethets.rerollStats(0)
      requestId = await requestId.wait()
      requestId = requestId.events[0].data
      await vRFCoordinatorMock.callBackWithRandomness(requestId, 8, ethets.address)
      
      stats = await ethets.statsOf(0)

      expect(stats.firing_range).to.equal(66)
      expect(stats.firing_speed).to.equal(88)
      expect(stats.reload_speed).to.equal(8)
      expect(stats.melee_damage).to.equal(98)
      expect(stats.melee_speed).to.equal(52)
      expect(stats.magazine_capacity).to.equal(58)
      expect(stats.health).to.equal(10)
    })

    it('Should cost 950 CRP', async () => {
      await ethets.setCRP(mockCRP.address)
      await ethets.toggleRerollingIsActive()
      expect(await mockCRP.balanceOf(signers[0].address)).to.equal(10000)

      await mockCRP.approve(ethets.address, 950)
      let requestId = await ethets.rerollStats(0)
      requestId = await requestId.wait()
      requestId = requestId.events[0].data
      await vRFCoordinatorMock.callBackWithRandomness(requestId, 16, ethets.address)
      
      expect(await mockCRP.balanceOf(signers[0].address)).to.equal(9050)
    })
  })

  describe('Visual Data', () => {
    it('Should set the visual data of a token', async () => {
      let visualData = await ethets.visualDataOf(0)
      
      expect(visualData.background).to.equal("")
      expect(visualData.outfit).to.equal("")
      expect(visualData.belt).to.equal("")
      expect(visualData.token_type).to.equal("")
      expect(visualData.face_accessory).to.equal("")
      expect(visualData.head_gear).to.equal("")
      expect(visualData.weapon).to.equal("")
      expect(visualData.rank).to.equal("")
      
      await ethets.setVisualDataOf(0, "Area 51 v1", "GR Camo", "Grenades", "ET HB Bravo", "None", "GR Beret", "Knife", "Spy", 2)
      visualData = await ethets.visualDataOf(0)
      
      expect(visualData.background).to.equal("Area 51 v1")
      expect(visualData.outfit).to.equal("GR Camo")
      expect(visualData.belt).to.equal("Grenades")
      expect(visualData.token_type).to.equal("ET HB Bravo")
      expect(visualData.face_accessory).to.equal("None")
      expect(visualData.head_gear).to.equal("GR Beret")
      expect(visualData.weapon).to.equal("Knife")
      expect(visualData.rank).to.equal("Spy")
    })

    it('Should only be set by the owner', async () => {
      let visualData = await ethets.visualDataOf(0)
      
      expect(visualData.background).to.equal("")
      expect(visualData.outfit).to.equal("")
      expect(visualData.belt).to.equal("")
      expect(visualData.token_type).to.equal("")
      expect(visualData.face_accessory).to.equal("")
      expect(visualData.head_gear).to.equal("")
      expect(visualData.weapon).to.equal("")
      expect(visualData.rank).to.equal("")
      
      expect(ethets.connect(signers[1]).setVisualDataOf(0, "Area 51 v1", "GR Camo", "Grenades", "ET HB Bravo", "None", "GR Beret", "Knife", "Spy", 2)).to.be.revertedWith('Ownable: caller is not the owner')
      visualData = await ethets.visualDataOf(0)
      
      expect(visualData.background).to.equal("")
      expect(visualData.outfit).to.equal("")
      expect(visualData.belt).to.equal("")
      expect(visualData.token_type).to.equal("")
      expect(visualData.face_accessory).to.equal("")
      expect(visualData.head_gear).to.equal("")
      expect(visualData.weapon).to.equal("")
      expect(visualData.rank).to.equal("")
    })
  })

  describe('Ability Rerolling', () => {
    it('Should generate a new ability', async () => {
      await ethets.setCRP(mockCRP.address)
      await ethets.toggleRerollingIsActive()
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
      await ethets.setCRP(mockCRP.address)
      await ethets.toggleRerollingIsActive()
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
    it('Should upgrade the weapon tier', async () => {
      await ethets.setCRP(mockCRP.address)
      await ethets.toggleRerollingIsActive()
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
      await ethets.setCRP(mockCRP.address)
      await ethets.toggleRerollingIsActive()
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