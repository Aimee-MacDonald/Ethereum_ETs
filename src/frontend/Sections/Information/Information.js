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

  const rerollStats = e => {
    e.preventDefault()

    const tokenId = e.target.tokenId.value

    ethets.rerollStats(tokenId)
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

  const rerollAbility = e => {
    e.preventDefault()

    const tokenId = e.target.tokenId.value

    ethets.rerollAbility(tokenId)
      .then(transaction => transaction.wait())
      .then(result => console.log(result.events[0].event))
      .catch(error => console.log(error.data.message))
  }

  const weaponTierOf = e => {
    e.preventDefault()

    const tokenId = e.target.tokenId.value

    ethets.weaponTierOf(tokenId)
      .then(weaponTier => console.log(weaponTier))
      .catch(error => console.log(error.data.message))
  }

  const upgradeWeapon = e => {
    e.preventDefault()

    const tokenId = e.target.tokenId.value

    ethets.upgradeWeapon(tokenId)
      .then(transaction => transaction.wait())
      .then(result => console.log(result.events[0].event))
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

      <form onSubmit={rerollStats} className='function'>
        <p>rerollStats(</p>
        <input placeholder='tokenId' id='tokenId' />
        <p>)</p>
        <button>Go</button>
      </form>

      <form onSubmit={abilityOf} className='function'>
        <p>abilityOf(</p>
        <input placeholder='tokenId' id='tokenId' />
        <p>)</p>
        <button type='submit'>Go</button>
      </form>

      <form onSubmit={rerollAbility} className='function'>
        <p>rerollAbility(</p>
        <input placeholder='tokenId' id='tokenId' />
        <p>)</p>
        <button>Go</button>
      </form>

      <form onSubmit={weaponTierOf} className='function'>
        <p>weaponTierOf(</p>
        <input placeholder='tokenId' id='tokenId' />
        <p>)</p>
        <button type='submit'>Go</button>
      </form>

      <form onSubmit={upgradeWeapon} className='function'>
        <p>upgradeWeapon(</p>
          <input placeholder='tokenId' id='tokenId'/>
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