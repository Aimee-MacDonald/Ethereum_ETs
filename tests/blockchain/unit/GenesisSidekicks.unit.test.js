const { expect } = require('chai')

describe('Genesis Sidekicks Unit', () => {
  let signers
  let genesisSK

  beforeEach(async () => {
    signers = await ethers.getSigners()

    const GenesisSK = await ethers.getContractFactory('GenesisSK')
    genesisSK = await GenesisSK.deploy()
  })

  describe('Airdrop', () => {
    it('Should airdrop a token {tokenId} to recipient address', async () => {
      expect(await genesisSK.balanceOf(signers[0].address)).to.equal(0)
      
      await genesisSK.airdrop(signers[0].address, 1)
      
      expect(await genesisSK.balanceOf(signers[0].address)).to.equal(1)
      expect(await genesisSK.ownerOf(1)).to.equal(signers[0].address)
    })
  
    it('Should revert if caller is not the contract owner', async () =>{
      expect(await genesisSK.balanceOf(signers[1].address)).to.equal(0)
      
      expect(genesisSK.connect(signers[1]).airdrop(signers[1].address, 1)).to.be.revertedWith('Ownable: caller is not the owner')
      
      expect(await genesisSK.balanceOf(signers[1].address)).to.equal(0)
    })

    it("Should set token claimed status to true", async () => {
      expect(await genesisSK.isClaimed(1)).to.equal(false)
      
      genesisSK.airdrop(signers[1].address, 1)
      
      expect(await genesisSK.isClaimed(1)).to.equal(true)
    })

    it("Should revert if claimed status is true", async () => {
      await genesisSK.airdrop(signers[1].address, 1)
      
      expect(await genesisSK.isClaimed(1)).to.equal(true)
      
      expect(genesisSK.airdrop(signers[1].address, 1)).to.be.revertedWith("GenesisSK: Token already Claimed")
    })
  })

  describe('Whitelist', () => {
    it('Should revert if merkle tree root is not set', () => {
      const proof = [
        '0xba1e1ed4749e27d3fc4a93cb926aaca781b2da5376580a96baad9fae24fd8002',
        '0xf2683d3c628d2f2b91acd3058ba5c43f91c62ab132069900c3849fc9c1b65f01',
        '0x843ca9974a7016bcb262088f8272245972b98a56b542596bcf12e17a5f634811',
        '0xbf902a1941f35ad10e3cf481f7fea36806ec3bd5470caa5af644fe54e3b49fa7',
        '0x337547a7ba3ff7d9f4f388adcd1a813a1ac4bc66b8d1697d66514ddfe7c017b7'
      ];

      expect(genesisSK.whitelistClaim(1, proof)).to.be.revertedWith("GenesisSK: Merkle Root not Set")
    })

    it('Should set the Merkle Root', async () => {
      const proof = [
        "0x00314e565e0574cb412563df634608d76f5c59d9f817e85966100ec1d48005c0",
        "0x7e0eefeb2d8740528b8f598997a219669f0842302d3c573e9bb7262be3387e63",
        "0x90a5fdc765808e5a2e0d816f52f09820c5f167703ce08d078eb87e2c194c5525",
        "0x5a34698734dde87d16cbecce5d1c793eed47d6456e40489b991d8fb9e370a92d",
        "0x6d6cbee8dcc53afd0fe8468716e17f2c38de5112a301ca32c586f1daa063b47d"
      ];
      
      await genesisSK.setMerkleRoot("0xd38a533706a576a634c618407eb607df606d62179156c0bed7ab6c2088b01de9")
      
      genesisSK.whitelistClaim(1, proof)
    })

    it("Should revert if not the owner", () => {
      expect(genesisSK.connect(signers[1]).setMerkleRoot("0xd38a533706a576a634c618407eb607df606d62179156c0bed7ab6c2088b01de9")).to.be.revertedWith("Ownable: caller is not the owner");
    })

    it('Should mint the reserved token', async () => {
      expect(await genesisSK.balanceOf(signers[0].address)).to.equal(0)

      await genesisSK.setMerkleRoot("0xd38a533706a576a634c618407eb607df606d62179156c0bed7ab6c2088b01de9")
      
      const proof = [
        "0x00314e565e0574cb412563df634608d76f5c59d9f817e85966100ec1d48005c0",
        "0x7e0eefeb2d8740528b8f598997a219669f0842302d3c573e9bb7262be3387e63",
        "0x90a5fdc765808e5a2e0d816f52f09820c5f167703ce08d078eb87e2c194c5525",
        "0x5a34698734dde87d16cbecce5d1c793eed47d6456e40489b991d8fb9e370a92d",
        "0x6d6cbee8dcc53afd0fe8468716e17f2c38de5112a301ca32c586f1daa063b47d"
      ];
      
      await genesisSK.whitelistClaim(1, proof)
      
      expect(await genesisSK.balanceOf(signers[0].address)).to.equal(1)
    })

    it("Should set token claimed status to true", async () => {
      expect(await genesisSK.isClaimed(1)).to.equal(false)

      await genesisSK.setMerkleRoot("0xd38a533706a576a634c618407eb607df606d62179156c0bed7ab6c2088b01de9")
      
      const proof = [
        "0x00314e565e0574cb412563df634608d76f5c59d9f817e85966100ec1d48005c0",
        "0x7e0eefeb2d8740528b8f598997a219669f0842302d3c573e9bb7262be3387e63",
        "0x90a5fdc765808e5a2e0d816f52f09820c5f167703ce08d078eb87e2c194c5525",
        "0x5a34698734dde87d16cbecce5d1c793eed47d6456e40489b991d8fb9e370a92d",
        "0x6d6cbee8dcc53afd0fe8468716e17f2c38de5112a301ca32c586f1daa063b47d"
      ];
      
      await genesisSK.whitelistClaim(1, proof)
      
      expect(await genesisSK.isClaimed(1)).to.equal(true)
    })

    it("Should revert if claimed status is true", async () => {
      await genesisSK.setMerkleRoot("0xd38a533706a576a634c618407eb607df606d62179156c0bed7ab6c2088b01de9")
      
      const proof = [
        "0x00314e565e0574cb412563df634608d76f5c59d9f817e85966100ec1d48005c0",
        "0x7e0eefeb2d8740528b8f598997a219669f0842302d3c573e9bb7262be3387e63",
        "0x90a5fdc765808e5a2e0d816f52f09820c5f167703ce08d078eb87e2c194c5525",
        "0x5a34698734dde87d16cbecce5d1c793eed47d6456e40489b991d8fb9e370a92d",
        "0x6d6cbee8dcc53afd0fe8468716e17f2c38de5112a301ca32c586f1daa063b47d"
      ];
      
      await genesisSK.whitelistClaim(1, proof)
      expect(genesisSK.whitelistClaim(1, proof)).to.be.revertedWith('GenesisSK: Token already Claimed')
    })
  })

  describe('Token URI', () => {
    beforeEach(async () => await genesisSK.airdrop(signers[0].address, 1))

    it('Should return a token URI', async () => expect(await genesisSK.tokenURI(1)).to.equal(''))

    it('Should set the base URI for all the tokens', async () => {
      expect(await genesisSK.tokenURI(1)).to.equal('')
      
      await genesisSK.setBaseURI('base')
      
      expect(await genesisSK.tokenURI(1)).to.equal('base1.json')
    })
  })
})