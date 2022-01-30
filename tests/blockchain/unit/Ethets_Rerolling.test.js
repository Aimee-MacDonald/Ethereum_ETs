const { expect } = require('chai')

describe('Eth ETs', () => {
  let signers, ethets

  beforeEach(async () => {
    signers = await ethers.getSigners()
    const Ethets = await ethers.getContractFactory('Ethets')
    ethets = await Ethets.deploy()
    await ethets.toggleSaleIsActive()
    await ethets.mint(signers[0].address, 1)
  })

  it('Should generate new stats', async () => {
    let stats = await ethets.statsOf(0)
    
    const firing_range = stats.firing_range
    const firing_speed = stats.firing_speed
    const reload_speed = stats.reload_speed
    const melee_damage = stats.melee_damage
    const melee_speed = stats.melee_speed
    const magazine_capacity = stats.magazine_capacity
    const health = stats.health
    
    expect(firing_range).to.not.equal(0)
    expect(firing_speed).to.not.equal(0)
    expect(reload_speed).to.not.equal(0)
    expect(melee_damage).to.not.equal(0)
    expect(melee_speed).to.not.equal(0)
    expect(magazine_capacity).to.not.equal(0)
    expect(health).to.not.equal(0)
    
    await(ethets.reroll(0))
    
    stats = await ethets.statsOf(0)
    
    expect(stats.firing_range).to.not.equal(firing_range)
    expect(stats.firing_speed).to.not.equal(firing_speed)
    expect(stats.reload_speed).to.not.equal(reload_speed)
    expect(stats.melee_damage).to.not.equal(melee_damage)
    expect(stats.melee_speed).to.not.equal(melee_speed)
    expect(stats.magazine_capacity).to.not.equal(magazine_capacity)
    expect(stats.health).to.not.equal(health)
  })
})