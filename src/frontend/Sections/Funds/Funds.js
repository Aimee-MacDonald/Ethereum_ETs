import React from 'react'

import EthetsInterface from '../../contractInterfaces/EthetsInterface'

const Funds = () => {
  const ethets = new EthetsInterface()

  const setCRP = e => {
    e.preventDefault()

    const crpAddress = e.target.crpAddress.value;

    ethets.setCRP(crpAddress)
      .then(transaction => transaction.wait())
      .then(result => console.log(result.events[0].event))
      .catch(error => console.log(error))
  }

  const withdrawMatic = () => {
    ethets.withdrawETH()
      .then(transaction => transaction.wait())
      .then(result => console.log(result.events[0].event))
      .catch(error => console.log(error))
  }

  const withdrawLink = () => {
    ethets.withdrawLINK()
      .then(transaction => transaction.wait())
      .then(result => console.log(result.events[0].event))
      .catch(error => console.log(error))
  }

  const withdrawCRP = () => {
    ethets.withdrawCRP()
      .then(transaction => transaction.wait())
      .then(result => console.log(result.events[0].event))
      .catch(error => console.log(error))
  }

  return (
    <div>
      <form className='function' onSubmit={setCRP}>
        <p>setCRP(</p>
        <input id='crpAddress' placeholder='crpAddress'></input>
        <p>)</p>
        <button type='submit'>Go</button>
      </form>

      <div className='function'>
        <p>withdrawMATIC()</p>
        <button onClick={withdrawMatic}>Go</button>
      </div>

      <div className='function'>
        <p>withdrawLink()</p>
        <button onClick={withdrawLink}>Go</button>
      </div>

      <div className='function'>
        <p>withdrawCRP()</p>
        <button onClick={withdrawCRP}>Go</button>
      </div>
    </div>
  )
}

export default Funds