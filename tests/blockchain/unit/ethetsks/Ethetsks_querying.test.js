const { expect } = require('chai')

describe('Ethetsks Querying', () => {
  let ethetsks

  beforeEach(async () => {
    
    const MockEthets = await ethers.getContractFactory('MockEthets')
    const Utils = await ethers.getContractFactory('Utils')
    const MockLink = await ethers.getContractFactory('MockLink')
    const VRFCoordinatorMock = await ethers.getContractFactory('VRFCoordinatorMock')
    
    const mockEthets = await MockEthets.deploy()
    const utils = await Utils.deploy()
    const mockLink = await MockLink.deploy()
    const vrfCoordinatorMock = await VRFCoordinatorMock.deploy(mockLink.address)
    
    const Ethetsks = await ethers.getContractFactory('Ethetsks')
    
    ethetsks = await Ethetsks.deploy(mockEthets.address, utils.address, vrfCoordinatorMock.address, mockLink.address)

    await mockEthets.setSidekick(ethetsks.address)

    const signers = await ethers.getSigners()
    await mockEthets.mint(signers[0].address)
    await mockEthets.mint(signers[0].address)
    await mockEthets.mint(signers[0].address)
    
    let result = await mockEthets.hybridize(0, 1)
    result = await result.wait()
    result = result.events[0].data
    await vrfCoordinatorMock.callBackWithRandomness(result, 2, ethetsks.address)

    result = await mockEthets.hybridize(0, 2)
    result = await result.wait()
    result = result.events[0].data
    await vrfCoordinatorMock.callBackWithRandomness(result, 4, ethetsks.address)

    result = await mockEthets.hybridize(1, 2)
    result = await result.wait()
    result = result.events[0].data
    await vrfCoordinatorMock.callBackWithRandomness(result, 3, ethetsks.address)
  })

  it('Should return the stats of a token', async () => {
    let stats = await ethetsks.statsOf(0)
    
    expect(stats.firing_range).to.equal(3)
    expect(stats.firing_speed).to.equal(3)
    expect(stats.reload_speed).to.equal(3)
    expect(stats.melee_damage).to.equal(3)
    expect(stats.melee_speed).to.equal(3)
    expect(stats.magazine_capacity).to.equal(3)
    expect(stats.health).to.equal(3)

    stats = await ethetsks.statsOf(1)
    
    expect(stats.firing_range).to.equal(3)
    expect(stats.firing_speed).to.equal(3)
    expect(stats.reload_speed).to.equal(3)
    expect(stats.melee_damage).to.equal(3)
    expect(stats.melee_speed).to.equal(3)
    expect(stats.magazine_capacity).to.equal(3)
    expect(stats.health).to.equal(3)

    stats = await ethetsks.statsOf(2)
    
    expect(stats.firing_range).to.equal(1)
    expect(stats.firing_speed).to.equal(1)
    expect(stats.reload_speed).to.equal(1)
    expect(stats.melee_damage).to.equal(1)
    expect(stats.melee_speed).to.equal(1)
    expect(stats.magazine_capacity).to.equal(1)
    expect(stats.health).to.equal(1)
  })
  
  it('Should return the type of a token', async () => {
    expect(await ethetsks.typeOf(0)).to.equal(2)
    expect(await ethetsks.typeOf(1)).to.equal(3)
    expect(await ethetsks.typeOf(2)).to.equal(3)
  })
  
  it('Should return the abilities of a token', async () => {
    let abilities = await ethetsks.abilityOf(0)

    expect(abilities[0]).to.equal(0)
    expect(abilities[1]).to.equal(1)

    abilities = await ethetsks.abilityOf(1)

    expect(abilities[0]).to.equal(0)
    expect(abilities[1]).to.equal(2)

    abilities = await ethetsks.abilityOf(2)

    expect(abilities[0]).to.equal(1)
    expect(abilities[1]).to.equal(2)
  })

  it('Should return the abilities of a token as a string', async () => {
    expect(await ethetsks.stringAbilityOf(0)).to.equal('None/Health Regen')
    expect(await ethetsks.stringAbilityOf(1)).to.equal('None/Shield')
    expect(await ethetsks.stringAbilityOf(2)).to.equal('Health Regen/Shield')
  })

  it('Should return the variant of a token', async () => {
    expect(await ethetsks.variantOf(0)).to.equal(3)
    expect(await ethetsks.variantOf(1)).to.equal(1)
    expect(await ethetsks.variantOf(2)).to.equal(4)
  })
})