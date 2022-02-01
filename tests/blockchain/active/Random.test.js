const { expect } = require('chai')

describe('Random', () => {
  let random

  beforeEach(async () => {
    const Random = await ethers.getContractFactory('Random')
    random = await Random.deploy()
  })

  it('Should test the System', async () => {
    expect(await random.randomResult()).to.equal(0)

    await random.generateRandomNumber()
  })
})