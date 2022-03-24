const hre = require('hardhat')

async function main() {
  const Cryptonium = await hre.ethers.getContractFactory('Cryptonium')
  const cryptonium = await Cryptonium.deploy()
  await cryptonium.deployed()

  const walletAddress = '0xbEb8A8b0dD2797986B083Bb7158E10cdb0b7D5f0'
  const mintAmount = '10000000000000000000000000'
  
  console.log(`Cryptonium deployed to: ${cryptonium.address}`)
  
  await cryptonium.mint(walletAddress, mintAmount)

  console.log(`${mintAmount} CRP minted to ${walletAddress}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  