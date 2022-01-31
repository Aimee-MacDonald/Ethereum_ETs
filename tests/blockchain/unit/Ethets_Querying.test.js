const { expect } = require('chai')

describe('Eth ETs', () => {
  let signers, ethets

  beforeEach(async () => {
    signers = await ethers.getSigners()
    const Ethets = await ethers.getContractFactory('Ethets')
    ethets = await Ethets.deploy()
  })

  describe('Querying', () => {
    beforeEach(async () => {
      await ethets.toggleSaleIsActive()
    })

    it('Should return on-chain statistics data by token ID', async () => {
      await ethets.mint(signers[0].address, 1)

      const stats = await ethets.statsOf(0)

      expect(stats.firing_range).to.not.equal(0)
      expect(stats.firing_speed).to.not.equal(0)
      expect(stats.reload_speed).to.not.equal(0)
      expect(stats.melee_damage).to.not.equal(0)
      expect(stats.melee_speed).to.not.equal(0)
      expect(stats.magazine_capacity).to.not.equal(0)
      expect(stats.health).to.not.equal(0)
    })

    it('Should return on-chain ability data by token ID', async () => {
      const ability = await ethets.abilityOf(0)

      expect(ability).to.equal(0)
    })
    
    it('Should return weapon tier by token ID', async () => {
      const weaponTier = await ethets.weaponTierOf(0)

      expect(weaponTier).to.equal(0)
    })
  })
})