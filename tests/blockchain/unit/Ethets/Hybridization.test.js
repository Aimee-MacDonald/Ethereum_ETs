const { expect } = require('chai')

describe('Eth ETs', () => {
  let signers, ethets, mockSideKick, vrfCoordinatorMock, mockCRP

  beforeEach(async () => {
    signers = await ethers.getSigners()

    const MockLink = await ethers.getContractFactory('MockLink')
    const mockLink = await MockLink.deploy()

    const VRFCoordinatorMock = await ethers.getContractFactory('VRFCoordinatorMock')
    vrfCoordinatorMock = await VRFCoordinatorMock.deploy(mockLink.address)

    const Ethets = await ethers.getContractFactory('Ethets')
    ethets = await Ethets.deploy(vrfCoordinatorMock.address, mockLink.address)

    const MockSideKick = await ethers.getContractFactory('MockSideKick')
    mockSideKick = await MockSideKick.deploy(ethets.address)

    const MockCRP = await ethers.getContractFactory('MockCRP')
    mockCRP = await MockCRP.deploy()

    await ethets.toggleSaleIsActive()
    await mockLink.mint(ethets.address, '20000000000000000000')
    await mockCRP.mint(signers[0].address, 100000)
  })

  describe('Controls and Security', () => {
    it('Should require CRP to be set', async () => {
      await ethets.toggleHybridizationIsActive()
      await ethets.setSidekick(mockSideKick.address)

      expect(ethets.hybridize(0, 1)).to.be.revertedWith('Ethets: CRP not set')
    })

    it('Should only set the Sidekick contract if called by the owner', () => {
      expect(ethets.connect(signers[1]).setSidekick(mockSideKick.address)).to.be.revertedWith('Ownable: caller is not the owner')
    })

    it('Should only set the Sidekick once', async () => {
      await ethets.setSidekick(mockSideKick.address)
      expect(ethets.setSidekick(mockSideKick.address)).to.be.revertedWith("Ethets: Sidekick has already been set")
    })
  
    it('Should toggle hybridizationIsActive', async () => {
      expect(await ethets.hybridizationIsActive()).to.equal(false)
  
      await ethets.toggleHybridizationIsActive()
  
      expect(await ethets.hybridizationIsActive()).to.equal(true)
    })
  
    it('Should revert if hybridization is not active', () => {
      expect(ethets.hybridize(0, 1)).to.be.revertedWith('Ethets: Hybridization is not active')
    })
  })

  describe('Token Requirements', () => {
    beforeEach(async () => {
      await ethets.toggleHybridizationIsActive()
      await ethets.setSidekick(mockSideKick.address)
      await ethets.setCRP(mockCRP.address)
      
      let result = await ethets.mint(signers[0].address, 3, {value: ethers.utils.parseEther('0.10500000000000001')})
      result = await result.wait()
      result = result.events
      
      result.forEach(async (evnt, i) => {
        await vrfCoordinatorMock.callBackWithRandomness(evnt.data, i * 2, ethets.address)
      })
      
      await mockCRP.approve(ethets.address, 100000)
    })

    it('Should revert if either token does not exist', async () => {
      expect(ethets.hybridize(2, 4)).to.be.revertedWith('Ethets: operator query for nonexistent token')
      expect(ethets.hybridize(4, 2)).to.be.revertedWith('Ethets: operator query for nonexistent token')
      expect(ethets.hybridize(4, 5)).to.be.revertedWith('Ethets: operator query for nonexistent token')
    })
  
    it('Should revert if either token does not belong to the caller', async () => {
      requestId = await ethets.mint(signers[1].address, 1, {value: ethers.utils.parseEther('0.035')})
      requestId = await requestId.wait()
      requestId = requestId.events[0].data
      await vrfCoordinatorMock.callBackWithRandomness(requestId, 4, ethets.address)
  
      expect(ethets.hybridize(0, 3)).to.be.revertedWith('Ethets: This token does not belong to you')
    })
  
    it('Should allow a token to hybridize up to 10 times', async () => {
      expect(await ethets.hybridCountOf(0)).to.equal(0)

      await ethets.hybridize(0, 1)
      await ethets.hybridize(0, 1)
      await ethets.hybridize(0, 1)
      await ethets.hybridize(0, 1)
      await ethets.hybridize(0, 1)
      await ethets.hybridize(0, 1)
      await ethets.hybridize(0, 1)
      await ethets.hybridize(0, 1)
      await ethets.hybridize(0, 1)
      await ethets.hybridize(0, 1)
  
      expect(ethets.hybridize(0, 1)).to.be.revertedWith('Ethets: Hybridization limit reached')
      expect(ethets.hybridize(2, 1)).to.be.revertedWith('Ethets: Hybridization limit reached')
      expect(await ethets.hybridCountOf(0)).to.equal(10)
      expect(await ethets.hybridCountOf(1)).to.equal(10)
    })
  })

  describe('CRP', () => {
    beforeEach(async () => {
      await ethets.toggleHybridizationIsActive()
      await ethets.setSidekick(mockSideKick.address)

      let result = await ethets.mint(signers[0].address, 3, {value: ethers.utils.parseEther('0.10500000000000001')})
      result = await result.wait()
      result = result.events

      result.forEach(async (evnt, i) => {
        await vrfCoordinatorMock.callBackWithRandomness(evnt.data, i * 2, ethets.address)
      })
    })

    it('Should deduct relevant CRP cost', async () => {
      await ethets.setCRP(mockCRP.address)

      let mCRPBalance = await mockCRP.balanceOf(signers[0].address)
      await mockCRP.approve(ethets.address, 100000)
      expect(mCRPBalance).to.equal(100000)

      await ethets.hybridize(0, 1)
      mCRPBalance = await mockCRP.balanceOf(signers[0].address)
      expect(mCRPBalance).to.equal(99800)

      await ethets.hybridize(0, 1)
      mCRPBalance = await mockCRP.balanceOf(signers[0].address)
      expect(mCRPBalance).to.equal(99300)

      await ethets.hybridize(0, 1)
      mCRPBalance = await mockCRP.balanceOf(signers[0].address)
      expect(mCRPBalance).to.equal(98200)

      await ethets.hybridize(0, 1)
      mCRPBalance = await mockCRP.balanceOf(signers[0].address)
      expect(mCRPBalance).to.equal(95900)

      await ethets.hybridize(0, 1)
      mCRPBalance = await mockCRP.balanceOf(signers[0].address)
      expect(mCRPBalance).to.equal(92400)

      await ethets.hybridize(0, 1)
      mCRPBalance = await mockCRP.balanceOf(signers[0].address)
      expect(mCRPBalance).to.equal(87700)

      await ethets.hybridize(0, 1)
      mCRPBalance = await mockCRP.balanceOf(signers[0].address)
      expect(mCRPBalance).to.equal(81800)

      await ethets.hybridize(0, 1)
      mCRPBalance = await mockCRP.balanceOf(signers[0].address)
      expect(mCRPBalance).to.equal(74700)

      await ethets.hybridize(0, 1)
      mCRPBalance = await mockCRP.balanceOf(signers[0].address)
      expect(mCRPBalance).to.equal(67600)

      await ethets.hybridize(0, 1)
      mCRPBalance = await mockCRP.balanceOf(signers[0].address)
      expect(mCRPBalance).to.equal(60500)
    })
  })

  describe('Sidekick', () => {
    beforeEach(async () => {
      await ethets.toggleHybridizationIsActive()
      await ethets.setSidekick(mockSideKick.address)
      await ethets.setCRP(mockCRP.address)
      await mockCRP.approve(ethets.address, 10000)

      let result = await ethets.mint(signers[0].address, 2, {value: ethers.utils.parseEther('0.07')})
      result = await result.wait()
      result = result.events

      result.forEach(async (evnt, i) => {
        await vrfCoordinatorMock.callBackWithRandomness(evnt.data, i * 2, ethets.address)
      })
    })
    
    it('Should mint a sidekick token', async () => {
      expect(await mockSideKick.balanceOf(signers[0].address)).to.equal(0)
      
      await ethets.hybridize(0, 1)
      
      expect(await mockSideKick.balanceOf(signers[0].address)).to.equal(1)
    })

    it('Should forward the tokenIds to Sidekick', async () => {
      expect(await mockSideKick.token_1()).to.equal(0)
      expect(await mockSideKick.token_2()).to.equal(0)

      await ethets.hybridize(0, 1)

      expect(await mockSideKick.token_1()).to.equal(0)
      expect(await mockSideKick.token_2()).to.equal(1)
    })
  })
})