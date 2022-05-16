import React from 'react'

import './ConnectWallet.sass'

const ConnectWallet = ({ connectWallet }) => (
  <div id='ConnectWallet'>
    <h1>Wallet not Connected</h1>
    <p>Please Connect your Wallet</p>
    <button onClick={connectWallet}>Connect</button>
  </div>
)

export default ConnectWallet