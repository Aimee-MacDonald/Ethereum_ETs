import React from 'react'

import EthetsInterface from '../../contractInterfaces/EthetsInterface'

const Information = () => {
  const ethets = new EthetsInterface()

  const statsOf = e => {
    e.preventDefault()

    const tokenId = e.target.tokenId.value
    
    ethets.statsOf(tokenId)
      .then(stats => console.log(stats))
      .catch(error => console.log(error.data.message))
  }

  const reroll = e => {
    e.preventDefault()

    const tokenId = e.target.tokenId.value

    ethets.reroll(tokenId)
      .then(transaction => transaction.wait())
      .then(result => console.log(result.events[0].event))
      .catch(error => console.log(error))
  }

  const abilityOf = e => {
    e.preventDefault()

    const tokenId = e.target.tokenId.value

    ethets.abilityOf(tokenId)
      .then(ability => console.log(ability))
      .catch(error => console.log(error.data.message))
  }

  const setBaseURI = e => {
    e.preventDefault()

    const baseURI = e.target.baseURI.value

    ethets.setBaseURI(baseURI)
      .then(transaction => transaction.wait())
      .then(result => console.log(result.events[0].event))
      .catch(error => console.log(error.data.message))
  }

  const maxTokens = () => ethets.maxTokens().then(maxTokens => console.log(maxTokens * 1)).catch(error => console.log(error.data.message))

  return (
    <div>
      <h2>Information</h2>

      <form onSubmit={statsOf} className='function'>
        <p>statsOf(</p>
        <input placeholder='tokenId' id='tokenId' />
        <p>)</p>
        <button type='submit'>Go</button>
      </form>

      <form onSubmit={reroll} className='function'>
        <p>reroll(</p>
        <input placeholder='tokenId' id='tokenId' />
        <p>)</p>
        <button>Reroll</button>
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

      <form onSubmit={setBaseURI} className='function'>
        <p>setBaseURI(</p>
        <input placeholder='baseURI' id='baseURI'/>
        <p>)</p>
        <button type='submit'>Go</button>
      </form>
    </div>
  )
}

export default Information