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
        '0x274996539fafc4b0887fdcfbe1c73bc1147c223b1ebedc6e4e8462a80707d2c7',
        '0xff44073c86b5f36d03e3cd6c33164ce126a78b18b7e90da5ede5b0a38c1906c2',
        '0x8df12610124b2f1d449b15a3738c89d89da351486556b8edec14891a3d33a10c',
        '0x74175349793b8b77859a3add3bc6b566832b7cd5e549d1b4240e3c2bc17c236c',
        '0x7fbaee0d3844acad166301012340d54a8dfb194a0c9f32cebed1ff8c71906898'
      ];

      expect(genesisSK.whitelistClaim(1, proof)).to.be.revertedWith("GenesisSK: Merkle Root not Set")
    })

    it('Should set the Merkle Root', async () => {
      const proof = [
        '0x274996539fafc4b0887fdcfbe1c73bc1147c223b1ebedc6e4e8462a80707d2c7',
        '0xff44073c86b5f36d03e3cd6c33164ce126a78b18b7e90da5ede5b0a38c1906c2',
        '0x8df12610124b2f1d449b15a3738c89d89da351486556b8edec14891a3d33a10c',
        '0x74175349793b8b77859a3add3bc6b566832b7cd5e549d1b4240e3c2bc17c236c',
        '0x7fbaee0d3844acad166301012340d54a8dfb194a0c9f32cebed1ff8c71906898'
      ];
      
      await genesisSK.setMerkleRoot("0x6a9d6791629880d211d618caac000c3a8e21d92691dbfbcf5a6dff4e118bd2c4")
      
      genesisSK.whitelistClaim(1, proof)
    })

    it("Should revert if not the owner", () => {
      expect(genesisSK.connect(signers[1]).setMerkleRoot("0x6a9d6791629880d211d618caac000c3a8e21d92691dbfbcf5a6dff4e118bd2c4")).to.be.revertedWith("Ownable: caller is not the owner");
    })

    it('Should mint the reserved token', async () => {
      expect(await genesisSK.balanceOf(signers[0].address)).to.equal(0)

      await genesisSK.setMerkleRoot("0x6a9d6791629880d211d618caac000c3a8e21d92691dbfbcf5a6dff4e118bd2c4")
      
      const proof = [
        '0x274996539fafc4b0887fdcfbe1c73bc1147c223b1ebedc6e4e8462a80707d2c7',
        '0xff44073c86b5f36d03e3cd6c33164ce126a78b18b7e90da5ede5b0a38c1906c2',
        '0x8df12610124b2f1d449b15a3738c89d89da351486556b8edec14891a3d33a10c',
        '0x74175349793b8b77859a3add3bc6b566832b7cd5e549d1b4240e3c2bc17c236c',
        '0x7fbaee0d3844acad166301012340d54a8dfb194a0c9f32cebed1ff8c71906898'
      ];
      
      await genesisSK.whitelistClaim(1, proof)
      
      expect(await genesisSK.balanceOf(signers[0].address)).to.equal(1)
    })

    it("Should set token claimed status to true", async () => {
      expect(await genesisSK.isClaimed(1)).to.equal(false)

      await genesisSK.setMerkleRoot("0x6a9d6791629880d211d618caac000c3a8e21d92691dbfbcf5a6dff4e118bd2c4")
      
      const proof = [
        '0x274996539fafc4b0887fdcfbe1c73bc1147c223b1ebedc6e4e8462a80707d2c7',
        '0xff44073c86b5f36d03e3cd6c33164ce126a78b18b7e90da5ede5b0a38c1906c2',
        '0x8df12610124b2f1d449b15a3738c89d89da351486556b8edec14891a3d33a10c',
        '0x74175349793b8b77859a3add3bc6b566832b7cd5e549d1b4240e3c2bc17c236c',
        '0x7fbaee0d3844acad166301012340d54a8dfb194a0c9f32cebed1ff8c71906898'
      ];
      
      await genesisSK.whitelistClaim(1, proof)
      
      expect(await genesisSK.isClaimed(1)).to.equal(true)
    })

    it("Should revert if claimed status is true", async () => {
      await genesisSK.setMerkleRoot("0x6a9d6791629880d211d618caac000c3a8e21d92691dbfbcf5a6dff4e118bd2c4")
      
      const proof = [
        '0x274996539fafc4b0887fdcfbe1c73bc1147c223b1ebedc6e4e8462a80707d2c7',
        '0xff44073c86b5f36d03e3cd6c33164ce126a78b18b7e90da5ede5b0a38c1906c2',
        '0x8df12610124b2f1d449b15a3738c89d89da351486556b8edec14891a3d33a10c',
        '0x74175349793b8b77859a3add3bc6b566832b7cd5e549d1b4240e3c2bc17c236c',
        '0x7fbaee0d3844acad166301012340d54a8dfb194a0c9f32cebed1ff8c71906898'
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