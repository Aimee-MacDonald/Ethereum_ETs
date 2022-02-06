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

    let requestId = await ethets.mint(signers[0].address, 1)
    requestId = await requestId.wait()
    requestId = requestId.events[0].data
    await vRFCoordinatorMock.callBackWithRandomness(requestId, 2, ethets.address)

    requestId = await ethets.mint(signers[1].address, 1)
    requestId = await requestId.wait()
    requestId = requestId.events[0].data
    await vRFCoordinatorMock.callBackWithRandomness(requestId, 4, ethets.address)

    requestId = await ethets.mint(signers[0].address, 1)
    requestId = await requestId.wait()
    requestId = requestId.events[0].data
    await vRFCoordinatorMock.callBackWithRandomness(requestId, 8, ethets.address)
  })

  describe('Inherited Functions', () => {
    it('Should return the token name', async () => {
      expect(await ethets.name()).to.equal('CryptoWars Ethereum ET')
    })

    it('Should return the token symbol', async () => {
      expect(await ethets.symbol()).to.equal('CWEE')
    })

    it('Should return a URI for the token', async () => {
      await ethets.setBaseURI('URI')

      expect(await ethets.tokenURI(0)).to.not.equal('')
    })

    it('Should return the Owner of the contract', async () => {
      expect(await ethets.owner()).to.equal(signers[0].address)
    })

    it('Should renounce Ownership of the contract', async () => {
      expect(await ethets.owner()).to.equal(signers[0].address)
      
      await ethets.renounceOwnership()

      expect(await ethets.owner()).to.equal('0x0000000000000000000000000000000000000000')
    })

    it('Should transfer Ownership of the contract', async () => {
      expect(await ethets.owner()).to.equal(signers[0].address)
      
      await ethets.transferOwnership(signers[1].address)
      
      expect(await ethets.owner()).to.equal(signers[1].address)
    })

    it('Should return the balance of a signer', async () => {
      expect(await ethets.balanceOf(signers[0].address)).to.equal(2)
    })

    it('Should return the owner of specific token', async () => {
      expect(await ethets.ownerOf(0)).to.equal(signers[0].address)
    })

    it('Should approve a token', async () => {
      await ethets.approve(signers[1].address, 0)

      expect(await ethets.getApproved(0)).to.equal(signers[1].address)
    })

    it('Should set approval for all tokens owned by a signer', async () => {
      await ethets.setApprovalForAll(signers[1].address, true)

      expect(await ethets.isApprovedForAll(signers[0].address, signers[1].address)).to.equal(true)
    })

    it('Should transfer a token from an approved signer', async () => {
      await ethets.approve(signers[1].address, 0)

      expect(await ethets.balanceOf(signers[0].address)).to.equal(2)
      expect(await ethets.balanceOf(signers[1].address)).to.equal(1)

      await ethets.connect(signers[1]).transferFrom(signers[0].address, signers[1].address, 0)

      expect(await ethets.balanceOf(signers[0].address)).to.equal(1)
      expect(await ethets.balanceOf(signers[1].address)).to.equal(2)
    })

    it('Should return the tokenID by index for a specified holder', async () => {
      expect(await ethets.tokenOfOwnerByIndex(signers[0].address, 0)).to.equal(0)
      expect(await ethets.tokenOfOwnerByIndex(signers[1].address, 0)).to.equal(1)
      expect(await ethets.tokenOfOwnerByIndex(signers[0].address, 1)).to.equal(2)
    })

    it('Should return the total supply', async () => {
      expect(await ethets.totalSupply()).to.equal(3)
    })

    it('Should return the token at an index', async () => {
      expect(await ethets.tokenByIndex(0)).to.equal(0)
    })
  })
})