const { expect } = require('chai')

describe('Ethetsks Airdrop', () => {
  let signers, addresses
  let vrfCoordinatorMock, ethetsks

  beforeEach(async () => {
    signers = await ethers.getSigners()
    addresses = signers.map(signer => signer.address)

    const Utils = await ethers.getContractFactory('Utils')
    const Ethetsks = await ethers.getContractFactory('Ethetsks')
    const MockEthets = await ethers.getContractFactory('MockEthets')
    const VRFCoordinatorMock = await ethers.getContractFactory('VRFCoordinatorMock')
    const MockLink = await ethers.getContractFactory('MockLink')
    
    const utils = await Utils.deploy()

    const mockLink = await MockLink.deploy()
    vrfCoordinatorMock = await VRFCoordinatorMock.deploy(mockLink.address)

    const mockEthets = await MockEthets.deploy()
    ethetsks = await Ethetsks.deploy(mockEthets.address, utils.address, vrfCoordinatorMock.address, mockLink.address)
  })

  describe('Airdrop Functionality', () => {
    it('Should seed the airdrop', async () => {
      expect(await ethetsks.airdropSeeded()).to.equal(false)
  
      let requestId = await ethetsks.seedAirdrop()
      requestId = await requestId.wait()
      requestId = requestId.events[0].data
      await vrfCoordinatorMock.callBackWithRandomness(requestId, 2, ethetsks.address)
  
      expect(await ethetsks.airdropSeeded()).to.equal(true)
    })
  
    it('Should revert if airdrop already seeded', async () => {
      let requestId = await ethetsks.seedAirdrop()
      requestId = await requestId.wait()
      requestId = requestId.events[0].data
      await vrfCoordinatorMock.callBackWithRandomness(requestId, 2, ethetsks.address)
  
      expect(ethetsks.seedAirdrop()).to.be.revertedWith('Ethetsks: Airdrop already seeded')
    })
  
    it('Should not arm airdrop if seed is 0', async () => {
      expect(await ethetsks.airdropSeeded()).to.equal(false)
  
      let requestId = await ethetsks.seedAirdrop()
      requestId = await requestId.wait()
      requestId = requestId.events[0].data
      await vrfCoordinatorMock.callBackWithRandomness(requestId, 0, ethetsks.address)
  
      expect(await ethetsks.airdropSeeded()).to.equal(false)
    })
  
    it('Should airdrop tokens to a list of addresses', async () => {
      expect(await ethetsks.balanceOf(addresses[0])).to.equal(0)
      expect(await ethetsks.balanceOf(addresses[1])).to.equal(0)
      expect(await ethetsks.balanceOf(addresses[2])).to.equal(0)
      expect(await ethetsks.balanceOf(addresses[3])).to.equal(0)
      expect(await ethetsks.balanceOf(addresses[4])).to.equal(0)
      
      let requestId = await ethetsks.seedAirdrop()
      requestId = await requestId.wait()
      requestId = requestId.events[0].data
  
      await vrfCoordinatorMock.callBackWithRandomness(requestId, 2, ethetsks.address)
      await ethetsks.airdrop(addresses)
      
      expect(await ethetsks.balanceOf(addresses[0])).to.equal(1)
      expect(await ethetsks.balanceOf(addresses[1])).to.equal(1)
      expect(await ethetsks.balanceOf(addresses[2])).to.equal(1)
      expect(await ethetsks.balanceOf(addresses[3])).to.equal(1)
      expect(await ethetsks.balanceOf(addresses[4])).to.equal(1)
    })
  
    it('Should revert if airdrop is not seeded', () => {
      expect(ethetsks.airdrop(addresses)).to.be.revertedWith('Ethetsks: Airdrop not seeded')
    })
  
    it('Should revert if tokens are already airdropped', async () => {
      let requestId = await ethetsks.seedAirdrop()
      requestId = await requestId.wait()
      requestId = requestId.events[0].data
      await vrfCoordinatorMock.callBackWithRandomness(requestId, 2, ethetsks.address)
  
      await ethetsks.airdrop([signers[0].address])
      expect(ethetsks.airdrop([signers[0].address])).to.be.revertedWith('Ethetstks: Airdrop already executed')
    })
  })

  describe('Airdrop Querying', () => {
    beforeEach(async () => {
      let requestId = await ethetsks.seedAirdrop()
      requestId = await requestId.wait()
      requestId = requestId.events[0].data
      await vrfCoordinatorMock.callBackWithRandomness(requestId, 2, ethetsks.address)

      await ethetsks.airdrop(addresses)
    })

    it('Should mint with random stats', async () => {
      const stats = await ethetsks.statsOf(0)
      
      expect(stats[0]).to.equal(9)
      expect(stats[1]).to.equal(3)
      expect(stats[2]).to.equal(6)
      expect(stats[3]).to.equal(9)
      expect(stats[4]).to.equal(8)
      expect(stats[5]).to.equal(7)
      expect(stats[6]).to.equal(1)
    })

    it('Should mint with A random type', async () => {
      expect(await ethetsks.typeOf(0)).to.equal(2)
      expect(await ethetsks.typeOf(1)).to.equal(4)
      expect(await ethetsks.typeOf(2)).to.equal(2)
      expect(await ethetsks.typeOf(3)).to.equal(1)
    })

    it('Should mint with random abilities', async () => {
      let abilities = await ethetsks.abilityOf(0)
      expect(abilities[0]).to.equal(4)
      expect(abilities[1]).to.equal(3)

      abilities = await ethetsks.abilityOf(1)
      expect(abilities[0]).to.equal(1)
      expect(abilities[1]).to.equal(3)

      abilities = await ethetsks.abilityOf(2)
      expect(abilities[0]).to.equal(1)
      expect(abilities[1]).to.equal(4)

      abilities = await ethetsks.abilityOf(3)
      expect(abilities[0]).to.equal(4)
      expect(abilities[1]).to.equal(3)
    })

    it('Should return the abilities of a token as a string', async () => {
      expect(await ethetsks.stringAbilityOf(0)).to.equal('Grenades/Dual Weapons')
      expect(await ethetsks.stringAbilityOf(1)).to.equal('Health Regen/Dual Weapons')
      expect(await ethetsks.stringAbilityOf(2)).to.equal('Health Regen/Grenades')
      expect(await ethetsks.stringAbilityOf(3)).to.equal('Grenades/Dual Weapons')
      expect(await ethetsks.stringAbilityOf(4)).to.equal('Grenades/Decoy')
    })

    it('Should mint with a random variant', async () => {
      expect(await ethetsks.variantOf(0)).to.equal(2)
      expect(await ethetsks.variantOf(1)).to.equal(3)
      expect(await ethetsks.variantOf(2)).to.equal(4)
      expect(await ethetsks.variantOf(3)).to.equal(3)
      expect(await ethetsks.variantOf(4)).to.equal(3)
    })
  })
})