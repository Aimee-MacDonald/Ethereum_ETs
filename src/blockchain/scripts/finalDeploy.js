const hre = require('hardhat')

async function main() {
  const vrfAddress = '0x8C7382F9D8f56b33781fE506E897a4F1e2d17255'
  const linkAddress = '0x326C977E6efc84E512bB9C30f76E30c160eD06FB'

  const Utils = await hre.ethers.getContractFactory('Utils')
  const Ethets = await hre.ethers.getContractFactory('Ethets')
  const Ethetsks = await hre.ethers.getContractFactory('Ethetsks')
  const Krypton = await hre.ethers.getContractFactory('Cryptonium')
  
  const utils = await Utils.deploy()
  await utils.deployed()
  console.log(`Utils deployed to: ${utils.address}`)

  const ethets = await Ethets.deploy(utils.address, vrfAddress, linkAddress)
  await ethets.deployed()
  console.log(`Ethets deployed to: ${ethets.address}`)

  const ethetsks = await Ethetsks.deploy(ethets.address, utils.address, vrfAddress, linkAddress)
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
  
  console.log(`

  *****************************************************************
  
                  Contract base Deployed Successfully
          Remember to fund the contracts with $LINK manually
                            to pay for VRF

  *****************************************************************

  `)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  

/*
  Utils deployed to: 0xb99Cb6B83EEc806f0BF4091fD25B44eF2799E52D
  Ethets deployed to: 0x2a47c389f3c8Cc00E0CB6286d1D6a7EA3e823c6F
  Ethetsks deployed to: 0x1aea5329E0020Bf7dD679590a7BD52044681dA19
  Krypton deployed to 0x427a2F4460A1E51De73D6A417a557Df6FBc55F0C
*/