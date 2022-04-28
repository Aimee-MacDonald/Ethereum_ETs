import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Ethets from '../../artifacts/src/blockchain/contracts/Ethets.sol/Ethets.json'
import Ethetsks from '../../artifacts/src/blockchain/contracts/Ethetsks.sol/Ethetsks.json'
import Cryptonium from '../../artifacts/src/blockchain/contracts/Cryptonium.sol/Cryptonium.json'
import VRFCoordinatorMock from '../../artifacts/src/blockchain/contracts/mocks/VRFCoordinatorMock.sol/VRFCoordinatorMock.json'

import './Cryptowars.sass'

import Minting from './sections/Minting/Minting'
import Collections from './sections/Collections/Collections'
import Hybridisation from './sections/Hybridisation/Hybridisation'
import Motherships from './sections/Motherships/Motherships'
import Navigation from './Navigation/Navigation'

const Cryptowars = () => {
  const ethetsAddress = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'
  const ethetsksAddress = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9'
  const kryptonAddress = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707'
  const vrfCoordinatorMockAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

  const ethetsABI = Ethets.abi
  const ethetsksABI = Ethetsks.abi
  const kryptonABI = Cryptonium.abi
  const vrfCoordinatorMockABI = VRFCoordinatorMock.abi
  const [ signerAddress, setSignerAddress ] = useState()

  const [ ethets, setEthets ] = useState(null)
  const [ ethetsks, setEthetsks ] = useState(null)
  const [ krypton, setKrypton ] = useState(null)
  const [ vrfCoordinatorMock, setVRFCoordinatorMock ] = useState(null)
  
  const [ activeView, setActiveView ] = useState(0)

  useEffect(async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    
    setEthets(new ethers.Contract(ethetsAddress, ethetsABI, signer))
    setEthetsks(new ethers.Contract(ethetsksAddress, ethetsksABI, signer))
    setKrypton(new ethers.Contract(kryptonAddress, kryptonABI, signer))
    setVRFCoordinatorMock(new ethers.Contract(vrfCoordinatorMockAddress, vrfCoordinatorMockABI, signer))
    
    setSignerAddress(await signer.getAddress())
  }, [])

  return (
    <div id='Cryptowars'>
      <Navigation setActiveView={setActiveView}/>

      {activeView == 0 && <Minting ethets={ethets} vrfCoordinatorMock={vrfCoordinatorMock}/>}
      {activeView == 1 && <Collections signerAddress={signerAddress} ethets={ethets} ethetsks={ethetsks} krypton={krypton} vrfCoordinatorMock={vrfCoordinatorMock}/>}
      {activeView == 2 && <Hybridisation signerAddress={signerAddress} ethets={ethets} ethetsks={ethetsks} krypton={krypton} vrfCoordinatorMock={vrfCoordinatorMock}/>}
      {activeView == 3 && <Motherships krypton={krypton} signerAddress={signerAddress}/>}
    </div>
  )
}

export default Cryptowars