import React, { useState } from 'react'
import { ethers } from 'ethers'
import 'regenerator-runtime/runtime'

const Minting = ({ ethets, vrfCoordinatorMock }) => {
  const [ quantity, setQuantity ] = useState(0)

  const mintTokens = async e => {
    e.preventDefault()

    const recipient = e.target.address.value
    const quantity = e.target.quantity.value
    const cost = 0.035 * quantity

    ethets.mint(recipient, quantity, {value: ethers.utils.parseEther(`${cost}`)})
      .then(transaction => transaction.wait())
      .then(result => result.events.forEach(async (evnt, i) => {
        await vrfCoordinatorMock.callBackWithRandomness(evnt.data, i * 2, ethets.address)
      }))
      .catch(error => console.log(error.data.message))
  }

  return (
    <form onSubmit={mintTokens}>
      <input placeholder='Wallet Address' id='address'/>

      <div>
        <button type='button' onClick={() => quantity < 30 && setQuantity(quantity + 1)}>Up</button>
        <input value={quantity} id='quantity' readOnly/>
        <button type='button' onClick={() => quantity > 0 && setQuantity(quantity - 1)}>Down</button>
      </div>

      <button type='submit'>Mint</button>
    </form>
  )
}

export default Minting