const { expect } = require('chai')

describe('Eth ETs', () => {
  let signers, ethets, mockLink, mockCRP

  beforeEach(async () => {
    signers = await ethers.getSigners()

    const MockLink = await ethers.getContractFactory('MockLink')
    mockLink = await MockLink.deploy()

    const MockCRP = await ethers.getContractFactory('MockCRP')
    mockCRP = await MockCRP.deploy()

    const VRFCoordinatorMock = await ethers.getContractFactory('VRFCoordinatorMock')
    const vrfCoordinatorMock = await VRFCoordinatorMock.deploy(mockLink.address)

    const Ethets = await ethers.getContractFactory('Ethets')
    ethets = await Ethets.deploy(vrfCoordinatorMock.address, mockLink.address)

    await ethets.toggleSaleIsActive()
    await mockLink.mint(ethets.address, '20000000000000000000')
    await mockCRP.mint(ethets.address, '1000')

    let requestId = await ethets.mint(signers[0].address, 10, {value: '350000000000000000'})
    requestId = await requestId.wait()
    requestId = requestId.events[0].data
    await vrfCoordinatorMock.callBackWithRandomness(requestId, 4, ethets.address)
  })

  it('Should only be callable by Owner', () => {
    expect(ethets.connect(signers[1]).withdrawETH()).to.be.revertedWith('Ownable: caller is not the owner')
    expect(ethets.connect(signers[1]).withdrawLINK()).to.be.revertedWith('Ownable: caller is not the owner')
    expect(ethets.connect(signers[1]).withdrawCRP()).to.be.revertedWith('Ownable: caller is not the owner')
  })

  it('Should withdraw all ETH from the contract', async () => {
    expect(await ethers.provider.getBalance(signers[0].address)).to.equal('9999279759546286550328')
    expect(await ethers.provider.getBalance(ethets.address)).to.equal('350000000000000000')

    await ethets.withdrawETH()

    expect(await ethers.provider.getBalance(signers[0].address)).to.equal('9999629727276665416674')
    expect(await ethers.provider.getBalance(ethets.address)).to.equal(0)
  })

  it('Should withdraw all LINK from the contract', async () => {
    expect(await mockLink.balanceOf(signers[0].address)).to.equal(0)
    expect(await mockLink.balanceOf(ethets.address)).to.equal('20000000000000000000')

    await ethets.withdrawLINK()

    expect(await mockLink.balanceOf(signers[0].address)).to.equal('20000000000000000000')
    expect(await mockLink.balanceOf(ethets.address)).to.equal(0)
  })

  it('Should require CRP to be set', () => expect(ethets.withdrawCRP()).to.be.revertedWith('Ethets: CRP not set'))

  it('Should withdraw all CRP from the contract', async () => {
    await ethets.setCRP(mockCRP.address)
    expect(await mockCRP.balanceOf(signers[0].address)).to.equal(0)
    expect(await mockCRP.balanceOf(ethets.address)).to.equal(1000)

    await ethets.withdrawCRP()

    expect(await mockCRP.balanceOf(signers[0].address)).to.equal(1000)
    expect(await mockCRP.balanceOf(ethets.address)).to.equal(0)
  })
})