const hre = require('hardhat')

async function main() {
  const Ethets = await hre.ethers.getContractFactory('Ethets')
  const ethets = await Ethets.deploy()
  await ethets.deployed()
  
  console.log(`Ethets deployed to: ${ethets.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  