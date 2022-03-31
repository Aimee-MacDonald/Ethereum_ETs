const { expect } = require('chai')

describe('Ethetsks Airdrop', () => {
  let signers, addresses
  let vrfCoordinatorMock, ethetsks

  beforeEach(async () => {
    signers = await ethers.getSigners()
    addresses = signers.map(signer => signer.address)

    const Ethetsks = await ethers.getContractFactory('Ethetsks')
    const MockEthets = await ethers.getContractFactory('MockEthets')
    const VRFCoordinatorMock = await ethers.getContractFactory('VRFCoordinatorMock')
    const MockLink = await ethers.getContractFactory('MockLink')

    const mockLink = await MockLink.deploy()
    vrfCoordinatorMock = await VRFCoordinatorMock.deploy(mockLink.address)

    const mockEthets = await MockEthets.deploy()
    ethetsks = await Ethetsks.deploy(mockEthets.address, vrfCoordinatorMock.address, mockLink.address)
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

  it('Should seed the airdrop', async () => {
    expect(await ethetsks.airdropSeeded()).to.equal(false)

    let requestId = await ethetsks.seedAirdrop()
    requestId = await requestId.wait()
    requestId = requestId.events[0].data
    await vrfCoordinatorMock.callBackWithRandomness(requestId, 2, ethetsks.address)

    expect(await ethetsks.airdropSeeded()).to.equal(true)
  })

  it('Should not arm airdrop if seed is 0', async () => {
    expect(await ethetsks.airdropSeeded()).to.equal(false)

    let requestId = await ethetsks.seedAirdrop()
    requestId = await requestId.wait()
    requestId = requestId.events[0].data
    await vrfCoordinatorMock.callBackWithRandomness(requestId, 0, ethetsks.address)

    expect(await ethetsks.airdropSeeded()).to.equal(false)
  })

  it('Should revert if airdrop already seeded', async () => {
    let requestId = await ethetsks.seedAirdrop()
    requestId = await requestId.wait()
    requestId = requestId.events[0].data
    await vrfCoordinatorMock.callBackWithRandomness(requestId, 2, ethetsks.address)

    expect(ethetsks.seedAirdrop()).to.be.revertedWith('Ethetsks: Airdrop already seeded')
  })
  
  it('Should revert if airdrop is not seeded', () => {
    expect(ethetsks.airdrop(addresses)).to.be.revertedWith('Ethetsks: Airdrop not seeded')
  })

  it('Should mint with random stats', async () => {
    let requestId = await ethetsks.seedAirdrop()
    requestId = await requestId.wait()
    requestId = requestId.events[0].data
    await vrfCoordinatorMock.callBackWithRandomness(requestId, 2, ethetsks.address)

    await ethetsks.airdrop([signers[0].address])
    
    const stats = await ethetsks.statsOf(0)

    expect(stats[0]).to.equal(9)
    expect(stats[1]).to.equal(3)
    expect(stats[2]).to.equal(6)
    expect(stats[3]).to.equal(9)
    expect(stats[4]).to.equal(8)
    expect(stats[5]).to.equal(7)
    expect(stats[6]).to.equal(1)
  })

  it('Should revert if tokens are already airdropped', async () => {
    let requestId = await ethetsks.seedAirdrop()
    requestId = await requestId.wait()
    requestId = requestId.events[0].data
    await vrfCoordinatorMock.callBackWithRandomness(requestId, 2, ethetsks.address)

    await ethetsks.airdrop([signers[0].address])
    expect(ethetsks.airdrop([signers[0].address])).to.be.revertedWith('Ethetstks: Airdrop already executed')
  })

  it('Should mint with A random type', async () => {
    let requestId = await ethetsks.seedAirdrop()
    requestId = await requestId.wait()
    requestId = requestId.events[0].data
    await vrfCoordinatorMock.callBackWithRandomness(requestId, 2, ethetsks.address)

    await ethetsks.airdrop([signers[0].address])
    
    expect(await ethetsks.typeOf(0)).to.equal(2)
  })

  it('Should mint with random abilities', async () => {
    let requestId = await ethetsks.seedAirdrop()
    requestId = await requestId.wait()
    requestId = requestId.events[0].data
    await vrfCoordinatorMock.callBackWithRandomness(requestId, 2, ethetsks.address)

    await ethetsks.airdrop([signers[0].address])

    const abilities = await ethetsks.abilityOf(0)

    expect(abilities[0]).to.equal(4)
    expect(abilities[1]).to.equal(3)
  })

  //  it('Should mint with a random variant', () => expect(true).to.equal(false))
})