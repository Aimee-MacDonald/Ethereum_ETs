const { expect } = require('chai')

describe('Eth ETs', () => {
  let signers, ethets, mockSideKick, vrfCoordinatorMock

  beforeEach(async () => {
    signers = await ethers.getSigners()

    const MockLink = await ethers.getContractFactory('MockLink')
    const mockLink = await MockLink.deploy()

    const VRFCoordinatorMock = await ethers.getContractFactory('VRFCoordinatorMock')
    vrfCoordinatorMock = await VRFCoordinatorMock.deploy(mockLink.address)

    const Ethets = await ethers.getContractFactory('Ethets')
    ethets = await Ethets.deploy(vrfCoordinatorMock.address, mockLink.address)

    const MockSideKick = await ethers.getContractFactory('MockSideKick')
    mockSideKick = await MockSideKick.deploy()

    await ethets.toggleSaleIsActive()
    await mockLink.mint(ethets.address, '20000000000000000000')
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
  
  it('Should revert if either token does not exist', async () => {
    await ethets.toggleHybridizationIsActive()
    await ethets.setSidekick(mockSideKick.address)
    expect(ethets.hybridize(0, 1)).to.be.revertedWith('Ethets: operator query for nonexistent token')
    
    let requestId = await ethets.mint(signers[0].address, 1)
    requestId = await requestId.wait()
    requestId = requestId.events[0].data
    await vrfCoordinatorMock.callBackWithRandomness(requestId, 4, ethets.address)
    
    expect(ethets.hybridize(0, 1)).to.be.revertedWith('Ethets: operator query for nonexistent token')
  })

  it('Should revert if either token does not belong to the caller', async () => {
    await ethets.toggleHybridizationIsActive()
    await ethets.setSidekick(mockSideKick.address)
    let requestId = await ethets.mint(signers[0].address, 1)
    requestId = await requestId.wait()
    requestId = requestId.events[0].data
    await vrfCoordinatorMock.callBackWithRandomness(requestId, 4, ethets.address)

    requestId = await ethets.mint(signers[1].address, 1)
    requestId = await requestId.wait()
    requestId = requestId.events[0].data
    await vrfCoordinatorMock.callBackWithRandomness(requestId, 4, ethets.address)

    expect(ethets.hybridize(0, 1)).to.be.revertedWith('Ethets: This token does not belong to you')
  })

  it('Should mint a sidekick token', async () => {
    await ethets.toggleHybridizationIsActive()
    await ethets.setSidekick(mockSideKick.address)
    expect(await mockSideKick.balanceOf(signers[0].address)).to.equal(0)
    let requestId = await ethets.mint(signers[0].address, 2)
    requestId = await requestId.wait()
    requestId = requestId.events[0].data
    await vrfCoordinatorMock.callBackWithRandomness(requestId, 4, ethets.address)
    
    await ethets.hybridize(0, 1)
    
    expect(await mockSideKick.balanceOf(signers[0].address)).to.equal(1)
  })
})