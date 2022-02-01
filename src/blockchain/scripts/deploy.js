const hre = require('hardhat')

async function main() {
  const Random = await hre.ethers.getContractFactory('Random')
  const random = await Random.deploy()
  await random.deployed()

  console.log(`Random deployed to: ${random.address}`)
  /* 
  const Ethets = await hre.ethers.getContractFactory('Ethets')
  const ethets = await Ethets.deploy()
  await ethets.deployed()
  
  console.log(`Ethets deployed to: ${ethets.address}`)
 */
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  