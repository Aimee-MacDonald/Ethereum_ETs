import React from 'react'

const ConnectWallet = ({ connectWallet }) => (
  <div>
    <h1>Wallet not Connected</h1>
    <p>Please Connect your Wallet</p>
    <button onClick={connectWallet}>Connect</button>
  </div>
)

export default ConnectWallet