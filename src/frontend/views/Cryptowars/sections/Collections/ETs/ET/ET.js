import React, { useState, useEffect } from 'react'

import './ET.sass'

const ET = ({ tokenId, ethets, krypton, vrfCoordinatorMock }) => {
  const [ tokenStats, setTokenStats ] = useState({
    firing_range: '???',
    firing_speed: '???',
    reload_speed: '???',
    melee_damage: '???',
    melee_speed: '???',
    magazine_capacity: '???',
    health: '???'
  })

  const [ ability, setAbility ] = useState('???')
  const [ weaponTier, setWeaponTier ] = useState('???')

  useEffect(() => {
    if(ethets !== null) {
      ethets.statsOf(tokenId)
        .then(result => {
          setTokenStats({
            firing_range: result.firing_range,
            firing_speed: result.firing_speed,
            reload_speed: result.reload_speed,
            melee_damage: result.melee_damage,
            melee_speed: result.melee_speed,
            magazine_capacity: result.magazine_capacity,
            health: result.health
          })
        })
        .catch(error => console.log(error))
    }
  }, [])

  useEffect(() => {
    if(ethets !== null) {
      ethets.stringAbilityOf(tokenId)
        .then(result => setAbility(result))
        .catch(error => console.log(error))
    }
  }, [])

  useEffect(() => {
    if(ethets !== null) {
      ethets.weaponTierOf(tokenId)
        .then(result => setWeaponTier(result))
        .catch(error => console.log(error))
    }
  }, [])

  const rerollStats = () => {
    if(krypton !== null) {
      krypton.approve(ethets.address, 950)
        .then(transaction => transaction.wait())
        .then(result => {
          if(result.events[0].event === 'Approval') {
            ethets.rerollStats(tokenId)
              .then(transaction => transaction.wait())
              .then(result => {
                const randomnessID = result.events[2].data
                const randomness = Math.floor(Math.random() * 10000000000000000)

                vrfCoordinatorMock.callBackWithRandomness(randomnessID, randomness, ethets.address)
                  .then(result => console.log(result))
                  .catch(error => console.log(error))
              })
              .catch(error => console.log(error))
          }
        })
        .catch(error => console.log(error))
    }
  }

  const rerollAbility = () => {
    if(krypton !== null && ethets !== null) {
      krypton.approve(ethets.address, 2000)
        .then(transaction => transaction.wait())
        .then(result => {
          if(result.events[0].event === 'Approval') {
            ethets.rerollAbility(tokenId)
              .then(transaction => transaction.wait())
              .then(result => {
                const randomnessID = result.events[2].data
                const randomness = Math.floor(Math.random() * 10000000000000000)

                vrfCoordinatorMock.callBackWithRandomness(randomnessID, randomness, ethets.address)
                  .then(result => console.log(result))
                  .catch(error => console.log(error))
              })
              .catch(error => console.log(error))
          }
        })
        .catch(error => console.log(error))
    }
  }

  const upgradeWeapon = () => {
    if(krypton !== null && ethets !== null) {
      const weaponUpgradeCosts = [100, 200, 400, 1000, 1800]

      ethets.weaponTierOf(tokenId)
        .then(weaponTier => {
          const upgradeCost = weaponUpgradeCosts[weaponTier]
          krypton.approve(ethets.address, upgradeCost)
            .then(transaction => transaction.wait())
            .then(result => {
              if(result.events[0].event === 'Approval') {
                ethets.upgradeWeapon(tokenId)
                  .then(transaction => transaction.wait())
                  .then(result => console.log(result))
                  .catch(error => console.log(error))
              }
            })
            .catch(error => console.log(error))
        })
        .catch(error => console.log(error))
    }
  }
  
  return (
    <div id='ET'>
      <div id='image'>Image</div>

      <div id='stats'>
        <p>Token ID: {tokenId}</p>
        <p>Firing Range: {tokenStats.firing_range}</p>
        <p>Firing Speed: {tokenStats.firing_speed}</p>
        <p>Reload Speed: {tokenStats.reload_speed}</p>
        <p>Melee Damage: {tokenStats.melee_damage}</p>
        <p>Melee Speed: {tokenStats.melee_speed}</p>
        <p>Magazine Capacity: {tokenStats.magazine_capacity}</p>
        <p>health: {tokenStats.health}</p>
        <p>Ability: {ability}</p>
        <p>Weapon Tier: {weaponTier}</p>
      </div>

      <div id='controls'>
        <button onClick={rerollStats}>Reroll Stats</button>
        <button onClick={rerollAbility}>Reroll Ability</button>
        <button onClick={upgradeWeapon}>Upgrade Weapon</button>
      </div>
    </div>
  )
}

export default ET