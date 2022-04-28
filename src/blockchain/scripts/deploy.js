const hre = require('hardhat')

async function main() {
  const Utils = await hre.ethers.getContractFactory('Utils')
  const MockLink = await hre.ethers.getContractFactory('MockLink')
  const VRFCoordinatorMock = await hre.ethers.getContractFactory('VRFCoordinatorMock')
  const Ethets = await hre.ethers.getContractFactory('Ethets')
  const Ethetsks = await hre.ethers.getContractFactory('Ethetsks')
  const Krypton = await hre.ethers.getContractFactory('Cryptonium')

  const utils = await Utils.deploy()
  await utils.deployed()
  console.log(`Utils deployed to: ${utils.address}`)
  
  const mockLink = await MockLink.deploy()
  await mockLink.deployed()
  console.log(`MockLink deployed to: ${mockLink.address}`)
  
  const vrfCoordinatorMock = await VRFCoordinatorMock.deploy(mockLink.address)
  await vrfCoordinatorMock.deployed()
  console.log(`VRFCoordinatorMock deployed to: ${vrfCoordinatorMock.address}`)

  const ethets = await Ethets.deploy(utils.address, vrfCoordinatorMock.address, mockLink.address)
  await ethets.deployed()
  console.log(`Ethets deployed to: ${ethets.address}`)

  const ethetsks = await Ethetsks.deploy(ethets.address, utils.address, vrfCoordinatorMock.address, mockLink.address)
  await ethetsks.deployed()
  console.log(`Ethetsks deployed to: ${ethetsks.address}`)

  const krypton = await Krypton.deploy()
  await krypton.deployed()
  console.log(`Krypton deployed to ${krypton.address}`)

  await ethets.toggleSaleIsActive()
  console.log('Ethets sales toggled to active')

  await ethets.setCRP(krypton.address)
  console.log(`Ethets CRP Address set to ${krypton.address}`)

  await ethets.toggleRerollingIsActive()
  console.log('Ethets stats rerolling toggled to active')

  await ethets.setSidekick(ethetsks.address)
  console.log(`Ethets sidekick address set to ${ethetsks.address}`)

  await ethets.toggleHybridizationIsActive()
  console.log('Ethets hybridization toggled to active')
  
  await mockLink.mint(ethets.address, '1000000000000000000')
  console.log(`1000000000000000000 MockLink minted to Ethets (${ethets.address})`)



  /* 
  const Ethets = await hre.ethers.getContractFactory('Ethets')
  const Utils = await ethers.getContractFactory('Utils')
  const VRFCoordinatorMock = await ethers.getContractFactory('VRFCoordinatorMock')
  const MockLink = await ethers.getContractFactory('MockLink')
  
  const utils = await Utils.deploy()
  const mockLink = await MockLink.deploy()

  await mockLink.deployed()
  const vrfCoordinatorMock = await VRFCoordinatorMock.deploy(mockLink.address)
  
  await utils.deployed()
  await vrfCoordinatorMock.deployed()
  ethets = await Ethets.deploy(utils.address, '0x8C7382F9D8f56b33781fE506E897a4F1e2d17255', '0x326C977E6efc84E512bB9C30f76E30c160eD06FB')
  
  await ethets.deployed()
  await mockLink.mint(ethets.address, '20000000000000000000')

  console.log(`Ethets deployed to: ${ethets.address}`)
   */




  /* 
  const Ethetsks = await ethers.getContractFactory('Ethetsks')
  ethetsks = await Ethetsks.deploy(ethets.address)

  const Cryptonium = await ethers.getContractFactory('Cryptonium')
  const cryptonium = await Cryptonium.deploy()

  await ethets.setSidekick(ethetsks.address)
  await ethets.setCRP(cryptonium.address)

  await ethets.toggleSaleIsActive()
  await ethets.toggleHybridizationIsActive()

  await cryptonium.mint(signers[0].address, '50000')
  await cryptonium.approve(ethets.address, '50000')

  let result = await ethets.mint(signers[0].address, 2, {value: ethers.utils.parseEther('0.7')})
  result = await result.wait()
  result = result.events
  
  result.forEach(async (evnt, i) => {
    await vrfCoordinatorMock.callBackWithRandomness(evnt.data, 2 * i, ethets.address)
  })
 */


  /* 
  const Ethets = await hre.ethers.getContractFactory('Ethets')
  const ethets = await Ethets.deploy('0x8C7382F9D8f56b33781fE506E897a4F1e2d17255', '0x326C977E6efc84E512bB9C30f76E30c160eD06FB')
  await ethets.deployed()

  console.log(`Ethereum ETs deployed to: ${ethets.address}`)
 */
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  