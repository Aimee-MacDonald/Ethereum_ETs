import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Ethets from '../../artifacts/src/blockchain/contracts/Ethets.sol/Ethets.json'
import Ethetsks from '../../artifacts/src/blockchain/contracts/Ethetsks.sol/Ethetsks.json'
import Cryptonium from '../../artifacts/src/blockchain/contracts/Cryptonium.sol/Cryptonium.json'
import GenesisSK from '../../artifacts/src/blockchain/contracts/GenesisSK.sol/GenesisSK.json'

import './Cryptowars.sass'

import Minting from './sections/Minting/Minting'
import Collections from './sections/Collections/Collections'
import Hybridisation from './sections/Hybridisation/Hybridisation'
import Motherships from './sections/Motherships/Motherships'
import GenesisSKSection from './sections/GenesisSK/GenesisSK'
import Navigation from './Navigation/Navigation'

const Cryptowars = () => {
  const ethetsAddress = '0xe93bCb880787614dA02cB66678B19D9C6e1C98d1'
  const ethetsksAddress = '0xbb616C4f2F747266407f52A5370463eC9c22A87E'
  const kryptonAddress = '0xC64411e4A475D67490E2231c11C857afc12505Ec'
  const genesisSKAddress = '0x91bF920DcA7107BA9aF63508c0f272D0b68E6A6A'
  //  OFFICIAL PUBLIC GENESISSK  0x91bF920DcA7107BA9aF63508c0f272D0b68E6A6A

  const ethetsABI = Ethets.abi
  const ethetsksABI = Ethetsks.abi
  const kryptonABI = Cryptonium.abi
  const genesisSKABI = GenesisSK.abi
  const [ signerAddress, setSignerAddress ] = useState()

  const [ ethets, setEthets ] = useState(null)
  const [ ethetsks, setEthetsks ] = useState(null)
  const [ krypton, setKrypton ] = useState(null)
  const [ genesisSK, setGenesisSK ] = useState(null)
  
  const [ activeView, setActiveView ] = useState(0)

  useEffect(async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    
    setEthets(new ethers.Contract(ethetsAddress, ethetsABI, signer))
    setEthetsks(new ethers.Contract(ethetsksAddress, ethetsksABI, signer))
    setKrypton(new ethers.Contract(kryptonAddress, kryptonABI, signer))
    setGenesisSK(new ethers.Contract(genesisSKAddress, genesisSKABI, signer))
    
    setSignerAddress(await signer.getAddress())
  }, [])

  return (
    <div id='Cryptowars'>
      <Navigation setActiveView={setActiveView}/>

      {activeView == 0 && <Minting ethets={ethets}/>}
      {activeView == 1 && <Collections signerAddress={signerAddress} ethets={ethets} ethetsks={ethetsks} krypton={krypton}/>}
      {activeView == 2 && <Hybridisation signerAddress={signerAddress} ethets={ethets} ethetsks={ethetsks} krypton={krypton}/>}
      {activeView == 3 && <Motherships krypton={krypton} signerAddress={signerAddress}/>}
      {activeView == 4 && <GenesisSKSection genesisSK={genesisSK}/>}
    </div>
  )
}

export default Cryptowars