import React,  { useState, useEffect } from 'react'

import './ETs.sass'

import ET from './ET/ET'

const ETs = ({ ethets, signerAddress, krypton, vrfCoordinatorMock }) => {
  const [ numTokens, setNumTokens ] = useState(0)
  const [ tokens, setTokens ] = useState([])

  useEffect(() => {
    if(ethets !== null) {
      ethets.balanceOf(signerAddress)
        .then(result => setNumTokens(result.toNumber()))
        .catch(err => console.log(err))
    }
  }, [ signerAddress ])

  useEffect(() => {
    if(ethets !== null) {
      for(let i = 0; i < numTokens; i++) {
        ethets.tokenOfOwnerByIndex(signerAddress, i)
          .then(result => setTokens(tokens => [ ...tokens, result.toNumber() ]))
          .catch(error => console.log(error))
      }
    }
  }, [ numTokens ])
  
  return (
    <div id='ETs'>
      {tokens.map(token => <ET key={token} tokenId={token} ethets={ethets} krypton={krypton} vrfCoordinatorMock={vrfCoordinatorMock}/>)}
    </div>
  )
}

export default ETs

















/* import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'

import Ethets from '../../../../../artifacts/src/blockchain/contracts/Ethets.sol/Ethets.json'

import ET from './ET/ET'

const ETs = () => {
  const ethetsAddress = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'
  const ethetsABI = Ethets.abi

  const [ ethetCount, setEthetCount ] = useState(0)
  const [ ethets, setEthets ] = useState(null)
  const [ signerAddress, setSignerAddress ] = useState(0)
  const [ tokens, setTokens ] = useState([])

  useEffect(async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' })

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    
    setEthets(new ethers.Contract(ethetsAddress, ethetsABI, signer))
    setSignerAddress(await signer.getAddress())
  }, [])

  useEffect(() => {
    if(ethets !== null) {
      ethets.balanceOf(signerAddress)
        .then(result => setEthetCount(result * 1))
        .catch(err => console.log(err))
    }
  }, [ signerAddress ])

  useEffect(() => {
    if(ethetCount > 0) {
      for(let i = 0; i < ethetCount; i++) setTokens(tokens => [ ...tokens, {} ])

      for(let i = 0; i < ethetCount; i++) {
        ethets.tokenOfOwnerByIndex(signerAddress, i)
          .then(result => setTokens(tokens => tokens.map((token, j) => j === i ? { ...token, id: result } : token)))
          .catch(error => console.log(error))
      }
    }
  }, [ ethetCount ])

  return (
    <div>
      <h1>Ethereum ETs</h1>
      <p>{`You own ${ethetCount} Ethereum ETs`}</p>
      {tokens.map(token => token.id ? <p>{`Token ID: ${token.id.toNumber()}`}</p> : <p>???</p>)}
      <ET/>
    </div>
  )
}

export default ETs */