import React from 'react'

import EthetsInterface from '../../contractInterfaces/EthetsInterface'

const Querying = () => {
  const ethets = new EthetsInterface()

  const statsOf = e => {
    e.preventDefault()

    const tokenId = e.target.tokenId.value
    
    ethets.statsOf(tokenId)
      .then(stats => console.log(stats))
      .catch(error => console.log(error.data.message))
  }

  const abilityOf = e => {
    e.preventDefault()

    const tokenId = e.target.tokenId.value

    ethets.abilityOf(tokenId)
      .then(ability => console.log(ability))
      .catch(error => console.log(error.data.message))
  }

  const maxTokens = () => ethets.maxTokens().then(maxTokens => console.log(maxTokens * 1)).catch(error => console.log(error.data.message))

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

      <div className='function'>
        <p>maxTokens()</p>
        <button onClick={maxTokens}>Go</button>
      </div>
    </div>
  )
}

export default Querying