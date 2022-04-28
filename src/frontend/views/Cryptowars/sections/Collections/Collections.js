import React, { useState, useEffect } from 'react'

import './Collections.sass'

import ETs from './ETs/ETs'
import Motherships from './Motherships/Motherships'
import Sidekicks from './Sidekicks/Sidekicks'

const Collections = ({ signerAddress, ethets, ethetsks, krypton, vrfCoordinatorMock }) => {
  const [ kryptonBalance, setKryptonBalance ] = useState('???')

  useEffect(() => {
    if(krypton !== null) {
      krypton.balanceOf(signerAddress)
        .then(result => setKryptonBalance(result.toNumber()))
        .catch(error => console.log(error))
    }
  }, [ signerAddress ])

  return (
    <div id='Collections'>
      <h1>Cryptonium</h1>
      <p>You own {kryptonBalance} KRYPTON</p>

      <ETs ethets={ethets} signerAddress={signerAddress} krypton={krypton} vrfCoordinatorMock={vrfCoordinatorMock}/>

      <Sidekicks signerAddress={signerAddress} ethetsks={ethetsks}/>

      <h1>Motherships</h1>
      <Motherships/>
    </div>
  )
}

export default Collections