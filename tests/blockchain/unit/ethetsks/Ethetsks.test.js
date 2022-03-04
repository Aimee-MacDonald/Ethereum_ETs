const { expect } = require('chai')

describe('Ethetsks', () => {
  let signers, ethetsks

  beforeEach(async () => {
    signers = await ethers.getSigners()

    const MockEthets = await ethers.getContractFactory('MockEthets')
    const mockEthets = await MockEthets.deploy()

    const Ethetsks = await ethers.getContractFactory('Ethetsks')
    ethetsks = await Ethetsks.deploy(mockEthets.address)

    await mockEthets.setSidekick(ethetsks.address)
    
    await mockEthets.mint(signers[0].address)
    await mockEthets.mint(signers[0].address)
  })

  it('Should mint a new NFT', async () => {
    expect(await ethetsks.balanceOf(signers[0].address)).to.equal(0)

    await ethetsks.mint(0, 1)
    
    expect(await ethetsks.balanceOf(signers[0].address)).to.equal(1)
  })

  it('Only Ethets can call', () => expect(true).to.equal(false))
  it('Both tokens should exist', () => expect(true).to.equal(false))
  it('Both tokens should belong to the caller', () => expect(true).to.equal(false))
})