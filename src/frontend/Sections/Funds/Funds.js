import React from 'react'

import EthetsInterface from '../../contractInterfaces/EthetsInterface'

const Funds = () => {
  const ethets = new EthetsInterface()

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

  return (
    <div>
      <div className='function'>
        <p>withdrawMATIC()</p>
        <button onClick={withdrawMatic}>Go</button>
      </div>

      <div className='function'>
        <p>withdrawLink()</p>
        <button onClick={withdrawLink}>Go</button>
      </div>
    </div>
  )
}

export default Funds