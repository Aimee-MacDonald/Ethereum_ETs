const hre = require('hardhat')

async function main() {
  const Ethets = await hre.ethers.getContractFactory('Ethets')
  const ethets = await Ethets.deploy('0x8C7382F9D8f56b33781fE506E897a4F1e2d17255', '0x326C977E6efc84E512bB9C30f76E30c160eD06FB')
  await ethets.deployed()

  console.log(`Ethereum ETs deployed to: ${ethets.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  