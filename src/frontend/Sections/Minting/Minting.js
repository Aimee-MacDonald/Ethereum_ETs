import React from 'react'

import EthetsInterface from '../../contractInterfaces/EthetsInterface'

const Minting = () => {
  const ethets = new EthetsInterface()

  const mint = e => {
    e.preventDefault()

    const recipient = e.target.recipient.value
    const amount = e.target.amount.value
    
    ethets.mint(recipient, amount)
      .then(transaction => transaction.wait())
      .then(result => console.log(result.events[0].event))
      .catch(error => console.log(error))
  }

  const saleIsActive = () => ethets.saleIsActive().then(saleIsActive => console.log(saleIsActive))

  const toggleSaleIsActive = () => {
    ethets.toggleSaleIsActive()
      .then(transaction => transaction.wait())
      .then(result => console.log(result.events[0].event))
      .catch(error => console.log(error.data.message))
  }
  
  return (
    <div>
      <h2>Minting</h2>

      <form className='function' onSubmit={mint}>
        <p>mint(</p>
        <input placeholder='recipient' id='recipient' />
        <p>,</p>
        <input placeholder='amount' id='amount' />
        <p>)</p>
        <button type='submit'>Go</button>
      </form>

      <div className='function'>
        <p>saleIsActive()</p>
        <button onClick={saleIsActive}>Go</button>
      </div>

      <div className='function'>
        <p>toggleSaleIsActive()</p>
        <button onClick={toggleSaleIsActive}>Go</button>
      </div>
    </div>
  )
}

export default Minting