const hre = require('hardhat')

async function main() {
  const MockLink = await hre.ethers.getContractFactory('MockLink')
  const VRFCoordinatorMock = await hre.ethers.getContractFactory('VRFCoordinatorMock')

  const mockLink = await MockLink.deploy()
  await mockLink.deployed()
  console.log(`MockLink deployed to: ${mockLink.address}`)
  
  const vrfCoordinatorMock = await VRFCoordinatorMock.deploy(mockLink.address)
  await vrfCoordinatorMock.deployed()
  console.log(`VRFCoordinatorMock deployed to: ${vrfCoordinatorMock.address}`)

  await mockLink.mint('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', '1000000000000000000')
  console.log(`1000000000000000000 MockLink minted to Account #0`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  