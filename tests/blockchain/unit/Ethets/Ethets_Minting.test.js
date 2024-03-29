const { expect } = require('chai')

describe('Eth ETs', () => {
  let signers, ethets, vrfCoordinatorMock

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

    await mockLink.mint(ethets.address, '20000000000000000000')
  })

  describe('Minting', () => {
    it('Should Mint a new ET NFT', async () => {
      expect(await ethets.balanceOf(signers[0].address)).to.equal(0)
      
      await ethets.toggleSaleIsActive()
      let requestId = await ethets.mint(signers[0].address, 1, {value: ethers.utils.parseEther('0.035')})
      requestId = await requestId.wait()
      requestId = requestId.events[0].data
      await vrfCoordinatorMock.callBackWithRandomness(requestId, 2, ethets.address)
      
      expect(await ethets.balanceOf(signers[0].address)).to.equal(1)
    })

    it('Should mint multiple tokens', async () => {
      expect(await ethets.balanceOf(signers[0].address)).to.equal(0)
      
      await ethets.toggleSaleIsActive()
      let result = await ethets.mint(signers[0].address, 5, {value: ethers.utils.parseEther('0.17500000000000002')})
      result = await result.wait()
      result = result.events

      result.forEach(async evnt => {
        await vrfCoordinatorMock.callBackWithRandomness(evnt.data, 2, ethets.address)
        expect(await ethets.balanceOf(signers[0].address)).to.equal(5)
      })
    })

    it('Should return the number of reserved tokens already minted', async () => {
      expect(await ethets.reservedTokensMinted()).to.equal(0)
    })
    
    it('Should mint a new reserved token', async () => {
      expect(await ethets.reservedTokensMinted()).to.equal(0)
      expect(await ethets.balanceOf(signers[0].address)).to.equal(0)
      
      let requestId = await ethets.mintReservedToken(signers[0].address, 1)
      requestId = await requestId.wait() 
      requestId = requestId.events[0].data
      await vrfCoordinatorMock.callBackWithRandomness(requestId, 2, ethets.address)
      
      expect(await ethets.reservedTokensMinted()).to.equal(1)
      expect(await ethets.balanceOf(signers[0].address)).to.equal(1)
    })

    it('Reserved tokens can only be minted by contract owner', () => {
      expect(ethets.connect(signers[1]).mintReservedToken(signers[1].address, 1)).to.be.revertedWith('Ownable: caller is not the owner')
    })

    it('Should mint multiple reserved tokens', async () => {
      expect(await ethets.reservedTokensMinted()).to.equal(0)
      expect(await ethets.balanceOf(signers[0].address)).to.equal(0)
      
      let result = await ethets.mintReservedToken(signers[0].address, 5)
      result = await result.wait() 
      result = result.events

      result.forEach(async evnt => {
        await vrfCoordinatorMock.callBackWithRandomness(evnt.data, 2, ethets.address)
        expect(await ethets.reservedTokensMinted()).to.equal(5)
        expect(await ethets.balanceOf(signers[0].address)).to.equal(5)
      })
    })

    it('Should mint a maximum of 333 reserved tokens', async () => {
      expect(await ethets.reservedTokensMinted()).to.equal(0)
      expect(await ethets.balanceOf(signers[0].address)).to.equal(0)

      let result = await ethets.mintReservedToken(signers[0].address, 333)
      result = await result.wait()
      result = result.events

      result.forEach(async evnt => {
        await vrfCoordinatorMock.callBackWithRandomness(evnt.data, 2, ethets.address)
        expect(await ethets.reservedTokensMinted()).to.equal(333)
        expect(await ethets.balanceOf(signers[0].address)).to.equal(333)
        expect(ethets.mintReservedToken(signers[0].address, 1)).to.be.revertedWith('Ethets: Only 333 total reserved tokens can be minted')
      })
    })

    it('Should cost 0.035 ETH per token to mint', async () => {
      expect(await ethers.provider.getBalance(ethets.address)).to.equal(0)

      await ethets.toggleSaleIsActive()
      let requestId = await ethets.mint(signers[0].address, 5, {value: ethers.utils.parseEther('0.17500000000000002')})
      requestId = await requestId.wait()
      requestId = requestId.events[0].data
      await vrfCoordinatorMock.callBackWithRandomness(requestId, 2, ethets.address)

      expect(await ethers.provider.getBalance(ethets.address)).to.equal('175000000000000020')
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

    it('Should allow minting up to 300 total tokens', async () => {
      await ethets.toggleSaleIsActive()

      for(let i = 0; i < 10; i++) {
        let result = await ethets.mint(signers[i].address, 30, {value: ethers.utils.parseEther('1.05')})
        result = await result.wait()
        result = result.events

        result.forEach(async (evnt, j) => {
          await vrfCoordinatorMock.callBackWithRandomness(evnt.data, 2 * j, ethets.address)
        })
      }
      
      expect(ethets.mint(signers[15].address, 1, {value: ethers.utils.parseEther('0.035')})).to.be.revertedWith('Ethers: Purchase would exceed max supply')
    })

    it('Should allow a maximum of 30 tokens per wallet when minting', async () => {
      await ethets.toggleSaleIsActive()

      let result = await ethets.mint(signers[0].address, 30, {value: ethers.utils.parseEther('1.05')})
      result = await result.wait()
      result = result.events

      result.forEach(async evnt => {
        await vrfCoordinatorMock.callBackWithRandomness(evnt.data, 4, ethets.address)

        expect(ethets.mint(signers[0].address, 1)).to.be.revertedWith('Ethers: Limit is 30 tokens per wallet, sale not allowed')
      })
    })
  })
})