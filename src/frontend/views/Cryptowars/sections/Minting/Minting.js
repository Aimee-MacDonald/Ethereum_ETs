import React, { useState } from 'react'
import { ethers } from 'ethers'
import 'regenerator-runtime/runtime'

import './Minting.sass'

const Minting = ({ ethets }) => {
  const [ quantity, setQuantity ] = useState(0)

  const mintTokens = async e => {
    e.preventDefault()

    const recipient = e.target.address.value
    const quantity = e.target.quantity.value
    const cost = 0.035 * quantity

    ethets.mint(recipient, quantity, {value: ethers.utils.parseEther(`${cost}`)})
      .then(transaction => transaction.wait())
      .then(result => result.events.forEach(evnt => console.log(`Ethets mint randomness request: ${evnt.data}`)))
      .catch(error => console.log(error.data.message))
  }

  return (
    <form onSubmit={mintTokens} id='Minting'>

      <h1>Mint new ETs</h1>

      <label htmlFor='address'>Paste your Wallet Address</label>
      <input placeholder='Wallet Address' id='address'/>

      <div id='quantitySlector'>
        <label htmlFor='quantitySlector'>Mint Multiple Tokens:   </label>
        <button type='button' onClick={() => quantity < 30 && setQuantity(quantity + 1)}>{'\u25B2'}</button>
        <input value={quantity} id='quantity' readOnly/>
        <button type='button' onClick={() => quantity > 0 && setQuantity(quantity - 1)}>{'\u25BC'}</button>
      </div>


      <button id='mintButton' type='submit'>Mint</button>
    </form>
  )
}

export default Minting