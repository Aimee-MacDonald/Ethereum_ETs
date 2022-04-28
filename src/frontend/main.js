import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { ethers } from 'ethers'

import 'normalize.css'
import './main.sass'

import NoWallet from './views/NoWallet/NoWallet'
import ConnectWallet from './views/ConnectWallet/ConnectWallet'
import Cryptowars from './views/Cryptowars/Cryptowars'

const Main = () => {
  const [ walletAvailable, setWalletAvailable ] = useState(true)
  const [ walletConnected, setWalletConnected ] = useState(false)

  useEffect(() => {
    if(typeof window.ethereum === 'undefined') {
      setWalletAvailable(false)
    }
  }, [])

  const connectWallet = () => {
    window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(() => {
        setWalletConnected(true)
      })
      .catch(() => console.log('Wallet Connection Failed'))
  }
  
/* 
  const connectWallet = () => console.log('Connecting Wallet')

  useEffect(() => {
    window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(() => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()

        console.log(`Provider: ${provider}`)
        console.log(`Signer: ${signer}`)
      })
      .catch(err => console.log(`Error: ${err}`))
  })
 */
  return (
    <div id='Main'>
      {!walletAvailable && <NoWallet/>}
      {walletAvailable && !walletConnected && <ConnectWallet connectWallet={connectWallet}/>}
      {walletConnected && <Cryptowars/>}
{/* 
      {!walletAvailable && <h1>No Wallet Available, please install extension</h1>}
      {walletAvailable && <h1>Wallet Available, Please Connect</h1>}
       */}
      
      {/* 
      <h1>Ethereum ETs</h1>
      <button onClick={() => setActiveSection(1)}>Inherited</button>
      <button onClick={() => setActiveSection(2)}>Minting</button>
      <button onClick={() => setActiveSection(3)}>Information</button>
      <button onClick={() => setActiveSection(5)}>Funds</button>
      <button onClick={() => setActiveSection(6)}>Hybridization</button>

      {activeSection === 1 && <Inherited/>}
      {activeSection === 2 && <Minting/>}
      {activeSection === 3 && <Information/>}
      {activeSection === 5 && <Funds/>}
      {activeSection === 6 && <Hybridization/>}
 */}
    </div>
  )
}

ReactDOM.render(<Main/>, document.getElementById('root'))