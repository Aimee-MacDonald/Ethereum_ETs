import React from 'react'

import EthetsInterface from '../../contractInterfaces/EthetsInterface'

const Hybridization = () => {
  const ethets = new EthetsInterface()

  const hybridizationIsActive = () => {
    ethets.hybridizationIsActive()
      .then(result => console.log(result))
      .catch(error => console.log(error))
  }

  const toggleHybridizationIsActive = () => {
    ethets.toggleHybridizationIsActive()
      .then(transaction => transaction.wait())
      .then(result => console.log(result.events[0].event))
      .catch(error => console.log(error.data.message))
  }

  const setSidekick = e => {
    e.preventDefault()

    const contractAddress = e.target.contractAddress.value

    ethets.setSidekick(contractAddress)
      .then(transaction => transaction.wait())
      .then(result => console.log(result.events[0].event))
      .catch(error => console.log(error.data.message))
  }

  const hybridize = e => {
    e.preventDefault()

    const tokenID_1 = e.target.tokenID_1.value
    const tokenID_2 = e.target.tokenID_2.value

    ethets.hybridize(tokenID_1, tokenID_2)
      .then(transaction => transaction.wait())
      .then(result => console.log(result.events[0].event))
      .catch(error => console.log(error.data.message))
  }

  const hybridCountOf = e => {
    e.preventDefault()

    const tokenID = e.target.tokenID.value

    ethets.hybridCountOf(tokenID)
      .then(hybridCount => console.log(hybridCount))
      .catch(error => console.log(error))
  }

  return (
    <div>
      <div className='function'>
        <p>hybridizationIsActive()</p>
        <button onClick={hybridizationIsActive}>Go</button>
      </div>

      <div className='function'>
        <p>toggleHybridizationIsActive()</p>
        <button onClick={toggleHybridizationIsActive}>Go</button>
      </div>

      <form className='function' onSubmit={setSidekick}>
        <p>setSidekick(</p>
        <input placeholder='contractAddress' id='contractAddress'/>
        <p>)</p>
        <button type='submit'>Go</button>
      </form>

      <form className='function' onSubmit={hybridize}>
        <p>hybridize(</p>
        <input placeholder='tokenID_1' id='tokenID_1'/>
        <p>,(</p>
        <input placeholder='tokenID_2' id='tokenID_2'/>
        <p>)</p>
        <button type='submit'>Go</button>
      </form>

      <form className='function' onSubmit={hybridCountOf}>
        <p>hybridCountOf(</p>
        <input placeholder='tokenID' id='tokenID'/>
        <p>)</p>
        <button type='submit'>Go</button>
      </form>
    </div>
  )
}

export default Hybridization