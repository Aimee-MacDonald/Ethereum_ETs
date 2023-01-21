const hre = require('hardhat')

async function main() {
  const GenesisSK = await hre.ethers.getContractFactory('GenesisSK')
  const genesisSK = await GenesisSK.deploy()
  await genesisSK.deployed()
  console.log(`GenesisSK deployed to: ${genesisSK.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })