import React from 'react'

import EthetsInterface from '../../contractInterfaces/EthetsInterface'

const Querying = () => {
  const ethets = new EthetsInterface()

  const statsOf = e => {
    e.preventDefault()

    const tokenId = e.target.tokenId.value
    
    ethets.statsOf(tokenId)
      .then(stats => console.log(stats))
  }

  const abilityOf = e => {
    e.preventDefault()

    const tokenId = e.target.tokenId.value

    ethets.abilityOf(tokenId)
      .then(ability => console.log(ability))
  }

  return (
    <div>
      <h2>Querying</h2>

      <form onSubmit={statsOf} className='function'>
        <p>statsOf(</p>
        <input placeholder='tokenId' id='tokenId' />
        <p>)</p>
        <button type='submit'>Go</button>
      </form>

      <form onSubmit={abilityOf} className='function'>
        <p>abilityOf(</p>
        <input placeholder='tokenId' id='tokenId' />
        <p>)</p>
        <button type='submit'>Go</button>
      </form>
    </div>
  )
}

export default Querying