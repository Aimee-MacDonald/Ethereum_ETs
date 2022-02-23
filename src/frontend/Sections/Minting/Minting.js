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
  const rerollingIsActive = () => ethets.rerollingIsActive().then(rerollingIsActive => console.log(rerollingIsActive))

  const toggleSaleIsActive = () => {
    ethets.toggleSaleIsActive()
      .then(transaction => transaction.wait())
      .then(result => console.log(result.events[0].event))
      .catch(error => console.log(error.data.message))
  }

  const toggleRerollingIsActive = () => {
    ethets.toggleRerollingIsActive()
      .then(transaction => transaction.wait())
      .then(result => console.log(result.events[0].event))
      .catch(error => console.log(error.data.message))
  }
    
  const mintingPrice = () => {
    ethets.mintingPrice()
      .then(price => console.log(price))
      .catch(error => console.log(error.data.message))
  }

  const setMintingPrice = e => {
    e.preventDefault()

    const price = e.target.price.value

    ethets.setMintingPrice(price)
      .then(transaction => transaction.wait())
      .then(result => console.log(result.events[0].event))
      .catch(error => console.log(error.data.message))
  }

  const reservedTokensMinted = () => {
    ethets.reservedTokensMinted()
      .then(result => console.log(result))
      .catch(error => console.log(error.data.message))
  }

  const mintReservedToken = e => {
    e.preventDefault()

    const recipient = e.target.recipient.value
    const amount = e.target.amount.value

    ethets.mintReservedToken(recipient, amount)
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

      <div className='function'>
        <p>rerollingIsActive()</p>
        <button onClick={rerollingIsActive}>Go</button>
      </div>

      <div className='function'>
        <p>toggleRerollingIsActive()</p>
        <button onClick={toggleRerollingIsActive}>Go</button>
      </div>

      <div className='function'>
        <p>mintingPrice()</p>
        <button onClick={mintingPrice}>Go</button>
      </div>

      <form className='function' onSubmit={setMintingPrice}>
        <p>setMintingPrice(</p>
        <input placeholder='price' id='price' />
        <p>)</p>
        <button type='submit'>Go</button>
      </form>

      <div className='function'>
        <p>reservedTokensMinted()</p>
        <button onClick={reservedTokensMinted}>Go</button>
      </div>
      
      <form className='function' onSubmit={mintReservedToken}>
        <p>mintReservedToken(</p>
        <input placeholder='recipient' id='recipient' />
        <p>,</p>
        <input placeholder='amount' id='amount' />
        <p>)</p>
        <button type='submit'>Go</button>
      </form>
    </div>
  )
}

export default Minting