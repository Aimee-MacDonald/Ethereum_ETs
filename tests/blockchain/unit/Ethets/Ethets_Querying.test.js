const { expect } = require('chai')

describe('Eth ETs', () => {
  let signers, ethets

  beforeEach(async () => {
    signers = await ethers.getSigners()

    const MockLink = await ethers.getContractFactory('MockLink')
    const mockLink = await MockLink.deploy()

    const VRFCoordinatorMock = await ethers.getContractFactory('VRFCoordinatorMock')
    const vRFCoordinatorMock = await VRFCoordinatorMock.deploy(mockLink.address)

    const Ethets = await ethers.getContractFactory('Ethets')
    ethets = await Ethets.deploy(vRFCoordinatorMock.address, mockLink.address)

    await mockLink.mint(ethets.address, '20000000000000000000')
    await ethets.toggleSaleIsActive()

    let requestId = await ethets.mint(signers[0].address, 1, {value: ethers.utils.parseEther('0.035')})
    requestId = await requestId.wait()
    requestId = requestId.events[0].data
    await vRFCoordinatorMock.callBackWithRandomness(requestId, 4, ethets.address)
  })

  describe('Querying', () => {
    it('Should return the minting price', async () => {
      expect(await ethets.mintingPrice()).to.equal('35000000000000000')
    })

    it('Should set the minting price', async () => {
      expect(await ethets.mintingPrice()).to.equal('35000000000000000')

      await ethets.setMintingPrice('45000000000000000')

      expect(await ethets.mintingPrice()).to.equal('45000000000000000')
    })

    it('Should return on-chain statistics data by token ID', async () => {
      const stats = await ethets.statsOf(0)

      expect(stats.firing_range).to.equal(66)
      expect(stats.firing_speed).to.equal(88)
      expect(stats.reload_speed).to.equal(8)
      expect(stats.melee_damage).to.equal(98)
      expect(stats.melee_speed).to.equal(52)
      expect(stats.magazine_capacity).to.equal(58)
      expect(stats.health).to.equal(10)
    })

    it('Should return on-chain visual data by token ID', async () => {
      const visualData = await ethets.visualDataOf(0)

      expect(visualData.background).to.equal("")
      expect(visualData.outfit).to.equal("")
      expect(visualData.belt).to.equal("")
      expect(visualData.token_type).to.equal("")
      expect(visualData.face_accessory).to.equal("")
      expect(visualData.head_gear).to.equal("")
      expect(visualData.weapon).to.equal("")
      expect(visualData.rank).to.equal("")
    })

    it('Should return the Rank Group for a token', async () => {
      expect(await ethets.rankGroupOf(0)).to.equal(0)
    })

    it('Should return on-chain ability data by token ID', async () => {
      const ability = await ethets.abilityOf(0)

      expect(ability).to.equal(0)
    })

    it('Should return token ability as a string', async () => {
      const ability = await ethets.stringAbilityOf(0)
      
      expect(ability).to.equal('None')
    })
    
    it('Should return weapon tier by token ID', async () => {
      const weaponTier = await ethets.weaponTierOf(0)
      
      expect(weaponTier).to.equal(0)
    })
    
    it('Should return the hybrid count of a token', async () => {
      expect(await ethets.hybridCountOf(0)).to.equal(0)
    })

    it('Should require image URL to be set', () => {
      expect(ethets.imageUrlOf(0)).to.be.revertedWith('Ethets: Image URL not set')
    })
    
    it('Should return token attributes as a JSON string', async () => {
      expect(await ethets.jsonOf(0)).to.equal('[{"display_type":"boost_number","trait_type":"firing_range","value":66,"max_value":100},{"display_type":"boost_number","trait_type":"firing_speed","value":88,"max_value":100},{"display_type":"boost_number","trait_type":"reload_speed","value":8,"max_value":100},{"display_type":"boost_number","trait_type":"melee_damage","value":98,"max_value":100},{"display_type":"boost_number","trait_type":"melee_speed","value":52,"max_value":100},{"display_type":"boost_number","trait_type":"magazine_capacity","value":58,"max_value":100},{"display_type":"boost_number","trait_type":"reload_speed","value":8,"max_value":100}]')
    })
    
    it('Should return the image URL of a token', async () => {
      await ethets.setBaseURI("URL")

      expect(await ethets.imageUrlOf(0)).to.equal('URL0.png')
    })
  })
})