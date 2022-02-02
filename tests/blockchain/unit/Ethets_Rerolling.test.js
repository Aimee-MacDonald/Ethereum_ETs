const { expect } = require('chai')

describe('Eth ETs', () => {
  let signers, ethets, vRFCoordinatorMock

  beforeEach(async () => {
    signers = await ethers.getSigners()

    const MockLink = await ethers.getContractFactory('MockLink')
    const mockLink = await MockLink.deploy()

    const VRFCoordinatorMock = await ethers.getContractFactory('VRFCoordinatorMock')
    vRFCoordinatorMock = await VRFCoordinatorMock.deploy(mockLink.address)
    
    const Ethets = await ethers.getContractFactory('Ethets')
    ethets = await Ethets.deploy(vRFCoordinatorMock.address, mockLink.address)

    await mockLink.mint(ethets.address, '20000000000000000000')
    await ethets.toggleSaleIsActive()
    await ethets.mint(signers[0].address, 1)
    await vRFCoordinatorMock.callBackWithRandomness(4, 4, ethets.address)
  })

  it('Should generate new stats', async () => {
    let stats = await ethets.statsOf(0)
    
    expect(stats.firing_range).to.equal(66)
    expect(stats.firing_speed).to.equal(88)
    expect(stats.reload_speed).to.equal(8)
    expect(stats.melee_damage).to.equal(98)
    expect(stats.melee_speed).to.equal(52)
    expect(stats.magazine_capacity).to.equal(58)
    expect(stats.health).to.equal(10)
    
    await(ethets.rerollStats(0))
    await vRFCoordinatorMock.callBackWithRandomness(4, 8, ethets.address)
    
    stats = await ethets.statsOf(0)

    expect(stats.firing_range).to.equal(97)
    expect(stats.firing_speed).to.equal(72)
    expect(stats.reload_speed).to.equal(98)
    expect(stats.melee_damage).to.equal(95)
    expect(stats.melee_speed).to.equal(89)
    expect(stats.magazine_capacity).to.equal(91)
    expect(stats.health).to.equal(84)
  })

  it('Should generate a new ability', async () => {
    expect(await ethets.abilityOf(0)).to.equal(0)

    await(ethets.rerollAbility(0))

    expect(await ethets.abilityOf(0)).to.not.equal(0)
  })

  it('Should upgrade the weapon tier', async () => {
    expect(await ethets.weaponTierOf(0)).to.equal(0)

    await(ethets.upgradeWeapon(0))
    await(ethets.upgradeWeapon(0))
    await(ethets.upgradeWeapon(0))
    await(ethets.upgradeWeapon(0))
    await(ethets.upgradeWeapon(0))

    expect(await ethets.weaponTierOf(0)).to.equal(5)
    expect(ethets.upgradeWeapon(0)).to.be.revertedWith('Ethets: Weapon is already fully upgraded')
  })
})