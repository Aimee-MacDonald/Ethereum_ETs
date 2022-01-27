import React from 'react'

import EthetsInterface from '../../contractInterfaces/EthetsInterface'

const Minting = () => {
  const ethets = new EthetsInterface()

  const mint = e => {
    e.preventDefault()

    const recipient = e.target.recipient.value
    
    ethets.mint(recipient)
      .then(success => console.log(success))
  }
  
  return (
    <div>
      <h2>Minting</h2>

      <form className='function' onSubmit={mint}>
        <p>mint(</p>
        <input placeholder='recipient' id='recipient' />
        <p>)</p>
        <button type='submit'>Go</button>
      </form>
    </div>
  )
}

export default Minting