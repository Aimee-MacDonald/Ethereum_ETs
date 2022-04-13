const { expect } = require('chai')

describe('Ethetsks Querying', () => {
  let ethetsks

  beforeEach(async () => {
    const Ethetsks = await ethers.getContractFactory('Ethetsks')
    const MockEthets = await ethers.getContractFactory('MockEthets')
    const VRFCoordinatorMock = await ethers.getContractFactory('VRFCoordinatorMock')
    const MockLink = await ethers.getContractFactory('MockLink')
    const Utils = await ethers.getContractFactory('Utils')
    
    const mockEthets = await MockEthets.deploy()
    const mockLink = await MockLink.deploy()
    const vrfCoordinatorMock = await VRFCoordinatorMock.deploy(mockLink.address)
    const utils = await Utils.deploy()
    ethetsks = await Ethetsks.deploy(mockEthets.address, utils.address, vrfCoordinatorMock.address, mockLink.address)

    const signers = await ethers.getSigners()
    const addresses = signers.map(signer => signer.address)
    
    let requestId = await ethetsks.seedAirdrop()
    requestId = await requestId.wait()
    requestId = requestId.events[0].data
    await vrfCoordinatorMock.callBackWithRandomness(requestId, 2, ethetsks.address)

    ////
    //
    //  This file should not work with an airdrop.
    //  All functions should be tested from hybridization
    //  A separate file should retest all the functionalities of this file in an airdrop context
    //
    ////

    await ethetsks.airdrop(addresses)
  })

  it('Should return the stats of a token', async () => {
    const stats = await ethetsks.statsOf(0)
    
    expect(stats.firing_range).to.equal(9)
    expect(stats.firing_speed).to.equal(3)
    expect(stats.reload_speed).to.equal(6)
    expect(stats.melee_damage).to.equal(9)
    expect(stats.melee_speed).to.equal(8)
    expect(stats.magazine_capacity).to.equal(7)
    expect(stats.health).to.equal(1)
  })
  
  it('Should return the type of a token', async () => expect(await ethetsks.typeOf(0)).to.equal(2))
  
  it('Should return the abilities of a token', async () => {
    const abilities = await ethetsks.abilityOf(0)

    expect(abilities[0]).to.equal(4)
    expect(abilities[1]).to.equal(3)
  })

  it('Should return the abilities of a token as a string', async () => {
    expect(await ethetsks.stringAbilityOf(0)).to.equal('Grenades/Dual Weapons')
    expect(await ethetsks.stringAbilityOf(1)).to.equal('Health Regen/Dual Weapons')
  })

  it('Should return the variant of a token', async () => {
    expect(await ethetsks.variantOf(0)).to.equal(2)
    expect(await ethetsks.variantOf(1)).to.equal(3)
  })
})