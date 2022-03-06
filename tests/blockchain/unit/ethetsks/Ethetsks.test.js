const { expect } = require('chai')

describe('Ethetsks', () => {
  let signers, mockEthets, ethetsks

  beforeEach(async () => {
    signers = await ethers.getSigners()

    const MockEthets = await ethers.getContractFactory('MockEthets')
    mockEthets = await MockEthets.deploy()

    const Ethetsks = await ethers.getContractFactory('Ethetsks')
    ethetsks = await Ethetsks.deploy(mockEthets.address)

    await mockEthets.setSidekick(ethetsks.address)
    
    await mockEthets.mint(signers[0].address)
    await mockEthets.mint(signers[0].address)
  })

  it('Should let Ethets contract mint new Sidekicks', async () => {
    expect(await ethetsks.balanceOf(signers[0].address)).to.equal(0)
    
    await mockEthets.hybridize(0, 1)

    expect(await ethetsks.balanceOf(signers[0].address)).to.equal(1)
  })

  it('Should revert of not called by the Ethets contract', () => {
    expect(ethetsks.mint(0, 1)).to.be.revertedWith('Ethetsks: Minting restricted')
  })
})