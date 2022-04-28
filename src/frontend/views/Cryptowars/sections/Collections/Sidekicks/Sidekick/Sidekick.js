import React, { useState, useEffect } from 'react'

import './Sidekick.sass'

const Sidekick = ({ ethetsks, tokenId }) => {
  const [ tokenType, setTokenType ] = useState('???')
  const [ tokenVariant, setTokenVariant ] = useState('???')
  const [ tokenAbility, setTokenAbility ] = useState('???')

  const [ stats, setStats ] = useState({
    firing_range: '???',
    firing_speed: '???',
    health: '???',
    magazine_capacity: '???',
    melee_damage: '???',
    melee_speed: '???',
    reload_speed: '???'
  })

  useEffect(() => {
    if(ethetsks !== null) {
      ethetsks.typeOf(tokenId)
        .then(result => setTokenType(result.toNumber()))
        .catch(error => console.log(error))
    }
  }, [])

  useEffect(() => {
    if(ethetsks !== null) {
      ethetsks.variantOf(tokenId)
        .then(result => setTokenVariant(result.toNumber()))
        .catch(error => console.log(error))
    }
  })

  useEffect(() => {
    if(ethetsks !== null) {
      ethetsks.stringAbilityOf(tokenId)
        .then(result => setTokenAbility(result))
        .catch(error => console.log(error))
    }
  })

  useEffect(() => {
    if(ethetsks !== null) {
      ethetsks.statsOf(tokenId)
        .then(result => {
          setStats({
            firing_range: result.firing_range,
            firing_speed: result.firing_speed,
            health: result.health,
            magazine_capacity: result.magazine_capacity,
            melee_damage: result.melee_damage,
            melee_speed: result.melee_speed,
            reload_speed: result.reload_speed
          })
        })
        .catch(error => console.log(error))
    }
  }, [])

  return (
    <div id='Sidekick'>
      <div id='image'>Image</div>

      <div id='stats'>
        <p>Token ID: {tokenId}</p>
        <p>Token Type: {tokenType}</p>
        <p>Token Variant: {tokenVariant}</p>
        <p>Firing Range: {stats.firing_range}</p>
        <p>Firing Speed: {stats.firing_speed}</p>
        <p>Health: {stats.health}</p>
        <p>Magazine Capacity: {stats.magazine_capacity}</p>
        <p>Melee Damage: {stats.melee_damage}</p>
        <p>Melee Speed: {stats.melee_speed}</p>
        <p>Reload Speed: {stats.reload_speed}</p>
        <p id='ability'>Token Ability: {tokenAbility}</p>
      </div>
    </div>
  )
}

export default Sidekick