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

      expect(stats.firing_range).to.equal(100)
      expect(stats.firing_speed).to.equal(100)
      expect(stats.reload_speed).to.equal(100)
      expect(stats.melee_damage).to.equal(100)
      expect(stats.melee_speed).to.equal(100)
      expect(stats.magazine_capacity).to.equal(100)
      expect(stats.health).to.equal(100)
    })

    it('Should return on-chain ability data by token ID', async () => {
      const ability = await ethets.abilityOf(0)

      expect(ability).to.equal(0)
    })
  })
})