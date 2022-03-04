const { expect } = require('chai')

describe('Cryptonium', () => {
  let signers, cryptonium

  beforeEach(async () => {
    signers = await ethers.getSigners()

    const Cryptonium = await ethers.getContractFactory('Cryptonium')
    cryptonium = await Cryptonium.deploy()
  })

  it('Should mint tokens', async () => {
    expect(await cryptonium.balanceOf(signers[0].address)).to.equal(0)

    await cryptonium.mint(signers[0].address, '5000')

    expect(await cryptonium.balanceOf(signers[0].address)).to.equal(5000)
  })
})