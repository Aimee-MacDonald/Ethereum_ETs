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
    await mockEthets.mint(signers[0].address)
    await mockEthets.mint(signers[0].address)
    await mockEthets.mint(signers[0].address)
    await mockEthets.mint(signers[0].address)
    await mockEthets.mint(signers[0].address)
    await mockEthets.mint(signers[0].address)
  })

  it('Should let Ethets contract mint new Sidekicks', async () => {
    expect(await ethetsks.balanceOf(signers[0].address)).to.equal(0)
    
    await mockEthets.hybridize(0, 1)

    expect(await ethetsks.balanceOf(signers[0].address)).to.equal(1)
  })

  it('Should revert if not called by the Ethets contract', () => {
    expect(ethetsks.mint(0, 1)).to.be.revertedWith('Ethetsks: Minting restricted')
  })

  it("Should be minted with the combined parents' stats", async () => {
    await mockEthets.hybridize(0, 1)

    const stats = await ethetsks.statsOf(0)

    expect(stats.firing_range).to.equal(3)
    expect(stats.firing_speed).to.equal(3)
    expect(stats.reload_speed).to.equal(3)
    expect(stats.melee_damage).to.equal(3)
    expect(stats.melee_speed).to.equal(3)
    expect(stats.magazine_capacity).to.equal(3)
    expect(stats.health).to.equal(3)
  })

  it('Should be minted with the correct type', async () => {
    expect(await mockEthets.rankGroupOf(0)).to.equal(1)
    expect(await mockEthets.rankGroupOf(1)).to.equal(2)
    expect(await mockEthets.rankGroupOf(2)).to.equal(3)
    expect(await mockEthets.rankGroupOf(3)).to.equal(4)
    expect(await mockEthets.rankGroupOf(4)).to.equal(1)
    expect(await mockEthets.rankGroupOf(5)).to.equal(2)
    expect(await mockEthets.rankGroupOf(6)).to.equal(3)
    expect(await mockEthets.rankGroupOf(7)).to.equal(4)

    await mockEthets.hybridize(0, 4)
    await mockEthets.hybridize(0, 5)
    await mockEthets.hybridize(0, 6)
    await mockEthets.hybridize(0, 7)
    await mockEthets.hybridize(1, 5)
    await mockEthets.hybridize(1, 6)
    await mockEthets.hybridize(1, 7)
    await mockEthets.hybridize(2, 6)
    await mockEthets.hybridize(2, 7)
    await mockEthets.hybridize(3, 7)
    
    expect(await ethetsks.typeOf(0)).to.equal(1);
    expect(await ethetsks.typeOf(1)).to.equal(2);
    expect(await ethetsks.typeOf(2)).to.equal(3);
    expect(await ethetsks.typeOf(3)).to.equal(4);
    expect(await ethetsks.typeOf(4)).to.equal(2);
    expect(await ethetsks.typeOf(5)).to.equal(3);
    expect(await ethetsks.typeOf(6)).to.equal(4);
    expect(await ethetsks.typeOf(7)).to.equal(3);
    expect(await ethetsks.typeOf(8)).to.equal(4);
    expect(await ethetsks.typeOf(9)).to.equal(4);
  })

  it("Should be minted with both the parents' abilities", async () => {
    expect(await mockEthets.abilityOf(0)).to.equal(0)
    expect(await mockEthets.abilityOf(1)).to.equal(1)
    expect(await mockEthets.abilityOf(2)).to.equal(2)
    expect(await mockEthets.abilityOf(3)).to.equal(3)
    expect(await mockEthets.abilityOf(4)).to.equal(4)
    expect(await mockEthets.abilityOf(5)).to.equal(5)
    expect(await mockEthets.abilityOf(6)).to.equal(0)
    expect(await mockEthets.abilityOf(7)).to.equal(1)
    expect(await mockEthets.abilityOf(8)).to.equal(2)
    expect(await mockEthets.abilityOf(9)).to.equal(3)
    expect(await mockEthets.abilityOf(10)).to.equal(4)
    expect(await mockEthets.abilityOf(11)).to.equal(5)

    await mockEthets.hybridize(0, 4)
    await mockEthets.hybridize(0, 5)
    await mockEthets.hybridize(0, 6)
    await mockEthets.hybridize(0, 7)
    await mockEthets.hybridize(1, 5)
    await mockEthets.hybridize(1, 6)
    await mockEthets.hybridize(1, 7)
    await mockEthets.hybridize(2, 6)
    await mockEthets.hybridize(2, 7)
    await mockEthets.hybridize(3, 7)

    let abilities = await ethetsks.abilityOf(0)
    expect(abilities[0]).to.equal(0)
    expect(abilities[1]).to.equal(4)

    abilities = await ethetsks.abilityOf(1)
    expect(abilities[0]).to.equal(0)
    expect(abilities[1]).to.equal(5)

    abilities = await ethetsks.abilityOf(2)
    expect(abilities[0]).to.equal(0)
    expect(abilities[1]).to.equal(0)

    abilities = await ethetsks.abilityOf(3)
    expect(abilities[0]).to.equal(0)
    expect(abilities[1]).to.equal(1)

    abilities = await ethetsks.abilityOf(4)
    expect(abilities[0]).to.equal(1)
    expect(abilities[1]).to.equal(5)

    abilities = await ethetsks.abilityOf(5)
    expect(abilities[0]).to.equal(1)
    expect(abilities[1]).to.equal(0)

    abilities = await ethetsks.abilityOf(6)
    expect(abilities[0]).to.equal(1)
    expect(abilities[1]).to.equal(1)

    abilities = await ethetsks.abilityOf(7)
    expect(abilities[0]).to.equal(2)
    expect(abilities[1]).to.equal(0)

    abilities = await ethetsks.abilityOf(8)
    expect(abilities[0]).to.equal(2)
    expect(abilities[1]).to.equal(1)

    abilities = await ethetsks.abilityOf(9)
    expect(abilities[0]).to.equal(3)
    expect(abilities[1]).to.equal(1)
  })

  ////
  //
  //  Should only return stats and type data for existing tokens
  //
  ////
})