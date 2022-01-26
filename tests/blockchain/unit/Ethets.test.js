const { expect } = require('chai')

describe('Eth ETs', () => {
  let signers, ethets

  beforeEach(async () => {
    signers = await ethers.getSigners()
    const Ethets = await ethers.getContractFactory('Ethets')
    ethets = await Ethets.deploy()
  })

  describe('Deployment', () => {
    it('Should be owned by the deployer', async () => {
      expect(await ethets.owner()).to.equal(signers[0].address)
    })
  })

  describe('Minting', () => {
    it('Should Mint a new ET NFT', async () => {
      expect(await ethets.balanceOf(signers[0].address)).to.equal(0)
      
      await ethets.mint(signers[0].address)
      
      expect(await ethets.balanceOf(signers[0].address)).to.equal(1)
    })
  })
  
  describe('Querying', () => {
    beforeEach(async () => {
      await ethets.mint(signers[0].address)
      await ethets.mint(signers[1].address)
      await ethets.mint(signers[0].address)
    })

    it('Should return the tokenID by index for a specified holder', async () => {
      expect(await ethets.tokenOfOwnerByIndex(signers[0].address, 0)).to.equal(0)
      expect(await ethets.tokenOfOwnerByIndex(signers[1].address, 0)).to.equal(1)
      expect(await ethets.tokenOfOwnerByIndex(signers[0].address, 1)).to.equal(2)
    })

    it('Should return on-chain statistics data by token ID', async () => {
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