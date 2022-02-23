import React from 'react'

import EthetsInterface from '../../contractInterfaces/EthetsInterface'
import MockCRPInterface from '../../contractInterfaces/MockCRPInterface'

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

    const mockCRP = new MockCRPInterface()

    mockCRP.approveAll()
      .then(transaction => transaction.wait())
      .then(result => console.log(result.events[0].event))
      .then(() => ethets.rerollStats(tokenId))
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

  const stringAbilityOf = e => {
    e.preventDefault()

    const tokenId = e.target.tokenId.value

    ethets.stringAbilityOf(tokenId)
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

  const imageUrlOf = e => {
    e.preventDefault()

    const tokenId = e.target.tokenId.value

    ethets.imageUrlOf(tokenId)
      .then(imageUrl => console.log(imageUrl))
      .catch(error => console.log(error.data.message))
  }

  const visualDataOf = e => {
    e.preventDefault()

    const tokenId = e.target.tokenId.value

    ethets.visualDataOf(tokenId)
      .then(result => console.log(result))
      .catch(error => console.log(error.data.message))
  }

  const setVisualDataOf = e => {
    e.preventDefault()
    
    const tokenId = e.target.tokenId.value
    const background = e.target.background.value
    const belt = e.target.belt.value
    const face_accessory = e.target.face_accessory.value
    const head_gear = e.target.head_gear.value
    const outfit = e.target.outfit.value
    const rank = e.target.rank.value
    const token_type = e.target.token_type.value
    const weapon = e.target.weapon.value

    ethets.setVisualDataOf(tokenId, background, belt, face_accessory, head_gear, outfit, rank, token_type, weapon)
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
        <button type='submit'>Go</button>
      </form>

      <form onSubmit={abilityOf} className='function'>
        <p>abilityOf(</p>
        <input placeholder='tokenId' id='tokenId' />
        <p>)</p>
        <button type='submit'>Go</button>
      </form>

      <form onSubmit={stringAbilityOf} className='function'>
        <p>stringAbilityOf(</p>
        <input placeholder='tokenId' id='tokenId' />
        <p>)</p>
        <button type='submit'>Go</button>
      </form>

      <form onSubmit={rerollAbility} className='function'>
        <p>rerollAbility(</p>
        <input placeholder='tokenId' id='tokenId' />
        <p>)</p>
        <button type='submit'>Go</button>
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

      <form onSubmit={imageUrlOf} className='function'>
        <p>imageUrlOf(</p>
        <input placeholder='tokenId' id='tokenId'/>
        <p>)</p>
        <button type='submit'>Go</button>
      </form>

      <form onSubmit={visualDataOf} className='function'>
        <p>visualDataOf(</p>
        <input placeholder='tokenId' id='tokenId'/>
        <p>)</p>
        <button type='submit'>Go</button>
      </form>

      <form onSubmit={setVisualDataOf} className='function'>
        <p>setVisualDataOf(</p>
        <input placeholder='tokenId' id='tokenId'/>
        <p>,</p>
        <input placeholder='background' id='background'/>
        <p>,</p>
        <input placeholder='belt' id='belt'/>
        <p>,</p>
        <input placeholder='face_accessory' id='face_accessory'/>
        <p>,</p>
        <input placeholder='head_gear' id='head_gear'/>
        <p>,</p>
        <input placeholder='outfit' id='outfit'/>
        <p>,</p>
        <input placeholder='rank' id='rank'/>
        <p>,</p>
        <input placeholder='token_type' id='token_type'/>
        <p>,</p>
        <input placeholder='weapon' id='weapon'/>
        <p>)</p>
        <button type='submit'>Go</button>
      </form>
    </div>
  )
}

export default Information


/* 
BACKGROUND
Area 51 V1

BELT
Grenades

FACE ACCESSORY
None

HEAD GEAR
GR Beret

OUTFIT
GR Camo

RANK
Spy

TYPE
ET HB Bravo

WEAPON
Knife
 */