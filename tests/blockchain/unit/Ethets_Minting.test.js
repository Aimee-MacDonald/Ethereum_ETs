const { expect } = require('chai')

describe('Eth ETs', () => {
  let signers, ethets, vrfCoordinatorMock

  beforeEach(async () => {
    signers = await ethers.getSigners()
    
    const MockLink = await ethers.getContractFactory('MockLink')
    const mockLink = await MockLink.deploy()

    const VRFCoordinatorMock = await ethers.getContractFactory('VRFCoordinatorMock')
    vrfCoordinatorMock = await VRFCoordinatorMock.deploy(mockLink.address)

    const Ethets = await ethers.getContractFactory('Ethets')
    ethets = await Ethets.deploy(vrfCoordinatorMock.address, mockLink.address)

    await mockLink.mint(ethets.address, '20000000000000000000')
  })

  describe('Minting', () => {
    it('Should Mint a new ET NFT', async () => {
      expect(await ethets.balanceOf(signers[0].address)).to.equal(0)
      
      await ethets.toggleSaleIsActive()
      let requestId = await ethets.mint(signers[0].address, 1)
      requestId = await requestId.wait()
      requestId = requestId.events[0].data
      await vrfCoordinatorMock.callBackWithRandomness(requestId, 2, ethets.address)
      
      expect(await ethets.balanceOf(signers[0].address)).to.equal(1)
    })

    it('Should mint multiple tokens', async () => {
      expect(await ethets.balanceOf(signers[0].address)).to.equal(0)
      
      await ethets.toggleSaleIsActive()
      let requestId = await ethets.mint(signers[0].address, 5)
      requestId = await requestId.wait()
      requestId = requestId.events[0].data
      await vrfCoordinatorMock.callBackWithRandomness(requestId, 2, ethets.address)

      expect(await ethets.balanceOf(signers[0].address)).to.equal(5)
    })

    it('Should toggle saleIsActive', async () => {
      expect(await ethets.saleIsActive()).to.equal(false)

      await ethets.toggleSaleIsActive()
      
      expect(await ethets.saleIsActive()).to.equal(true)
    })

    it('Should revert when not the owner', async () => {
      expect(await ethets.saleIsActive()).to.equal(false)
      
      await ethets.connect(signers[1].address).toggleSaleIsActive
      
      expect(await ethets.saleIsActive()).to.equal(false)
    })

    it('Should allow maximum 30 tokens to be minted at a time', async () => {
      expect(await ethets.balanceOf(signers[0].address)).to.equal(0)

      await ethets.toggleSaleIsActive()
      expect(ethets.mint(signers[0].address, 31)).to.be.revertedWith('Ethets: Max 30 NFTs per transaction')

      expect(await ethets.balanceOf(signers[0].address)).to.equal(0)
    })

    it('Should allow minting up to 900 total tokens', async () => {
      await ethets.toggleSaleIsActive()
      
      for(let i = 0; i < 20; i++) {
        let requestId = await ethets.mint(signers[i].address, 30)
        requestId = await requestId.wait()
        requestId = requestId.events[0].data
        await vrfCoordinatorMock.callBackWithRandomness(requestId, 2 * i, ethets.address)
      }

      expect(await ethets.totalSupply()).to.equal(600)

      for(let i = 0; i < 10; i++) {
        for(let j = 0; j < 30; j++) {
          await ethets.connect(signers[i]).transferFrom(signers[i].address, signers[19].address, i * 30 + j)
        }
      }

      for(let i = 0; i < 10; i++) {
        let requestId = await ethets.mint(signers[i].address, 30)
        requestId = await requestId.wait()
        requestId = requestId.events[0].data
        await vrfCoordinatorMock.callBackWithRandomness(requestId, 2 * i, ethets.address)
      }
      
      expect(await ethets.totalSupply()).to.equal(900)

      expect(ethets.mint(signers[0].address, 1)).to.be.revertedWith('Ethers: Purchase would exceed max supply')

      expect(await ethets.totalSupply()).to.equal(900)
    })

    it('Should allow a maximum of 30 tokens per wallet when minting', async () => {
      await ethets.toggleSaleIsActive()
      let requestId = await ethets.mint(signers[0].address, 30)
      requestId = await requestId.wait()
      requestId = requestId.events[0].data
      await vrfCoordinatorMock.callBackWithRandomness(requestId, 4, ethets.address)
      expect(await ethets.balanceOf(signers[0].address)).to.equal(30)

      expect(ethets.mint(signers[0].address, 1)).to.be.revertedWith('Ethers: Limit is 30 tokens per wallet, sale not allowed')

      expect(await ethets.balanceOf(signers[0].address)).to.equal(30)
    })
  })
})