const { expect } = require("chai")

describe('Ethetsks Integration', () => {
  let signers, ethets, ethetsks, vrfCoordinatorMock

  beforeEach(async () => {
    signers = await ethers.getSigners()

    const Utils = await ethers.getContractFactory('Utils')
    const utils = await Utils.deploy()
    await utils.deployed()

    const MockLink = await ethers.getContractFactory('MockLink')
    const mockLink = await MockLink.deploy()

    const VRFCoordinatorMock = await ethers.getContractFactory('VRFCoordinatorMock')
    vrfCoordinatorMock = await VRFCoordinatorMock.deploy(mockLink.address)

    const Ethets = await ethers.getContractFactory('Ethets')
    ethets = await Ethets.deploy(utils.address, vrfCoordinatorMock.address, mockLink.address)

    const Ethetsks = await ethers.getContractFactory('Ethetsks')
    ethetsks = await Ethetsks.deploy(ethets.address)

    const Cryptonium = await ethers.getContractFactory('Cryptonium')
    const cryptonium = await Cryptonium.deploy()

    await ethets.setSidekick(ethetsks.address)
    await ethets.setCRP(cryptonium.address)

    await ethets.toggleSaleIsActive()
    await ethets.toggleRerollingIsActive()
    await ethets.toggleHybridizationIsActive()

    await mockLink.mint(ethets.address, '20000000000000000000')
    await cryptonium.mint(signers[0].address, '50000')
    await cryptonium.approve(ethets.address, '50000')

    let requestId = await ethets.mint(signers[0].address, 1, {value: ethers.utils.parseEther('0.035')})
    requestId = await requestId.wait()
    requestId = requestId.events[0].data
    await vrfCoordinatorMock.callBackWithRandomness(requestId, 1, ethets.address)

    requestId = await ethets.mint(signers[0].address, 1, {value: ethers.utils.parseEther('0.035')})
    requestId = await requestId.wait()
    requestId = requestId.events[0].data
    await vrfCoordinatorMock.callBackWithRandomness(requestId, 2, ethets.address)

    await ethets.setVisualDataOf(0, 'background', 'outfit', 'belt', 'tokenType', 'faceAccessory', 'headGear', 'weapon', 'rank', 2)
    await ethets.setVisualDataOf(1, 'background', 'outfit', 'belt', 'tokenType', 'faceAccessory', 'headGear', 'weapon', 'rank', 4)

    requestId = await ethets.rerollAbility(0)
    requestId = await requestId.wait()
    requestId = requestId.events[2].data
    await vrfCoordinatorMock.callBackWithRandomness(requestId, 4, ethets.address)

    requestId = await ethets.rerollAbility(1)
    requestId = await requestId.wait()
    requestId = requestId.events[2].data
    await vrfCoordinatorMock.callBackWithRandomness(requestId, 8, ethets.address)
  })
  
  it("Should be minted with the combined parents' stats", async () => {
    await ethets.hybridize(0, 1)
    
    const stats_1 = await ethets.statsOf(0)
    const stats_2 = await ethets.statsOf(1)
    
    const expected_firing_range = Math.floor((stats_1.firing_range + stats_2.firing_range) / 20)
    const expected_firing_speed = Math.floor((stats_1.firing_speed + stats_2.firing_speed) / 20)
    const expected_reload_speed = Math.floor((stats_1.reload_speed + stats_2.reload_speed) / 20)
    const expected_melee_damage = Math.floor((stats_1.melee_damage + stats_2.melee_damage) / 20)
    const expected_melee_speed = Math.floor((stats_1.melee_speed + stats_2.melee_speed) / 20)
    const expected_magazine_capacity = Math.floor((stats_1.magazine_capacity + stats_2.magazine_capacity) / 20)
    const expected_health = Math.floor((stats_1.health + stats_2.health) / 20)
    
    const sidekickStats = await ethetsks.statsOf(0)

    expect(sidekickStats.firing_range).to.equal(expected_firing_range)
    expect(sidekickStats.firing_speed).to.equal(expected_firing_speed)
    expect(sidekickStats.reload_speed).to.equal(expected_reload_speed)
    expect(sidekickStats.melee_damage).to.equal(expected_melee_damage)
    expect(sidekickStats.melee_speed).to.equal(expected_melee_speed)
    expect(sidekickStats.magazine_capacity).to.equal(expected_magazine_capacity)
    expect(sidekickStats.health).to.equal(expected_health)
  })
  
  it('Should be minted with the correct type', async () => {
    await ethets.hybridize(0, 1)

    const rank_1 = await ethets.rankGroupOf(0)
    const rank_2 = await ethets.rankGroupOf(1)
    const expectedRank = rank_1 > rank_2 ? rank_1 : rank_2
    const sidekickRank = await ethetsks.typeOf(0)

    expect(sidekickRank).to.equal(expectedRank)
  })

  it("Should be minted with both the parents' abilities", async () => {
    await ethets.hybridize(0, 1)

    const ability_1 = await ethets.abilityOf(0)
    const ability_2 = await ethets.abilityOf(1)
    const sidekickAbilities = await ethetsks.abilityOf(0)

    expect(sidekickAbilities[0]).to.equal(ability_1)
    expect(sidekickAbilities[1]).to.equal(ability_2)
  })
})