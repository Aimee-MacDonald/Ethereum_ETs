import React from 'react'

import './Inherited.sass'

import EthetsInterface from '../../contractInterfaces/EthetsInterface'

const Inherited = () => {
  const ethets = new EthetsInterface()

  const name = () => ethets.name().then(name => console.log(name)).catch(error => console.log(error.data.message))
  const symbol = () => ethets.symbol().then(symbol => console.log(symbol)).catch(error => console.log(error.data.message))
  const owner = () => ethets.owner().then(owner => console.log(owner)).catch(error => console.log(error.data.message))
  const totalSupply = () => ethets.totalSupply().then(totalSupply => console.log(totalSupply * 1)).catch(error => console.log(error.data.message))

  const renounceOwnership = () => {
    ethets.renounceOwnership()
      .then(transaction => transaction.wait())
      .then(result => console.log(result.events[0].event))
      .catch(error => console.log(error.data.message))
  }

  const tokenURI = e => {
    e.preventDefault()

    const tokenId = e.target.tokenId.value

    ethets.tokenURI(tokenId)
      .then(tokenUri => console.log(tokenUri))
      .catch(error => console.log(error.data.message))
  }

  const transferOwnership = e => {
    e.preventDefault()

    const to = e.target.to.value

    ethets.transferOwnership(to)
      .then(transaction => transaction.wait())
      .then(result => console.log(result.events[0].event))
      .catch(error => console.log(error.data.message))
  }

  const balanceOf = e => {
    e.preventDefault()

    const owner = e.target.owner.value

    ethets.balanceOf(owner)
      .then(balance => console.log(balance * 1))
      .catch(error => console.log(error.data.message))
  }

  const ownerOf = e => {
    e.preventDefault()

    const tokenId = e.target.tokenId.value

    ethets.ownerOf(tokenId)
      .then(owner => console.log(owner))
      .catch(error => console.log(error.data.message))
  }

  const approve = e => {
    e.preventDefault()

    const to = e.target.to.value
    const tokenId = e.target.tokenId.value

    ethets.approve(to, tokenId)
      .then(transaction => transaction.wait())
      .then(result => console.log(result.events[0].event))
      .catch(error => console.log(error.data.message))
  }

  const getApproved = e => {
    e.preventDefault()
    
    const tokenId = e.target.tokenId.value
    
    ethets.getApproved(tokenId)
      .then(approved => console.log(approved))
      .catch(error => console.log(error.data.message))
  }

  const setApprovalForAll = e => {
    e.preventDefault()

    const operator = e.target.operator.value
    const approved = e.target.approved.value

    ethets.setApprovalForAll(operator, approved)
      .then(transaction => transaction.wait())
      .then(result => console.log(result.events[0].event))
      .catch(error => console.log(error.data.message))
  }

  const isApprovedForAll = e => {
    e.preventDefault()

    const owner = e.target.owner.value
    const operator = e.target.operator.value

    ethets.isApprovedForAll(owner, operator)
      .then(approved => console.log(approved))
      .catch(error => console.log(error.data.message))
  }

  const transferFrom = e => {
    e.preventDefault()
    
    const from = e.target.from.value
    const to = e.target.to.value
    const tokenId = e.target.tokenId.value

    ethets.transferFrom(from, to, tokenId)
      .then(transaction => transaction.wait())
      .then(result => console.log(result.events[0].event))
      .catch(error => console.log(error.data.message))
  }

  const tokenOfOwnerByIndex = e => {
    e.preventDefault()

    const owner = e.target.owner.value
    const index = e.target.index.value

    ethets.tokenOfOwnerByIndex(owner, index)
      .then(tokenId => console.log(tokenId * 1))
      .catch(error => console.log(error.data.message))
  }

  const tokenByIndex = e => {
    e.preventDefault()

    const index = e.target.index.value

    ethets.tokenByIndex(index)
      .then(tokenId => console.log(tokenId * 1))
      .catch(error => console.log(error.data.message))
  }

  return (
    <div id='Inherited'>
      <h2>Inherited</h2>

      <div className='function'>
        <p>name()</p>
        <button onClick={name}>Go</button>
      </div>

      <div className='function'>
        <p>symbol()</p>
        <button onClick={symbol}>Go</button>
      </div>

      <form className='function' onSubmit={tokenURI}>
        <p>tokenURI(</p>
        <input placeholder='tokenId' id='tokenId' />
        <p>)</p>
        <button type='submit'>Go</button>
      </form>

      <div className='function'>
        <p>owner()</p>
        <button onClick={owner}>Go</button>
      </div>

      <div className='function'>
        <p>renounceOwnership()</p>
        <button onClick={renounceOwnership}>Go</button>
      </div>

      <form className='function' onSubmit={transferOwnership}>
        <p>transferOwnership()</p>
        <input placeholder='to' id='to'/>
        <p>)</p>
        <button type='submit'>Go</button>
      </form>

      <form className='function' onSubmit={balanceOf}>
        <p>balanceOf(</p>
        <input placeholder='owner' id='owner'/>
        <p>)</p>
        <button type='submit'>Go</button>
      </form>

      <form className='function' onSubmit={ownerOf}>
        <p>ownerOf(</p>
        <input placeholder='tokenId' id='tokenId'/>
        <p>)</p>
        <button type='submit'>Go</button>
      </form>

      <form className='function' onSubmit={approve}>
        <p>approve(</p>
        <input placeholder='to' id='to'/>
        <p>, </p>
        <input placeholder='tokenId' id='tokenId'/>
        <p>)</p>
        <button type='submit'>Go</button>
      </form>

      <form className='function' onSubmit={getApproved}>
        <p>getApproved(</p>
        <input placeholder='tokenId' id='tokenId'/>
        <p>)</p>
        <button type='submit'>Go</button>
      </form>

      <form className='function' onSubmit={setApprovalForAll}>
        <p>setApprovalForAll(</p>
        <input placeholder='operator' id='operator'/>
        <p>,</p>
        <input placeholder='approved' id='approved'/>
        <p>)</p>
        <button type='submit'>Go</button>
      </form>

      <form className='function' onSubmit={isApprovedForAll}>
        <p>isApprovedForAll(</p>
        <input placeholder='operator' id='operator'/>
        <p>,</p>
        <input placeholder='owner' id='owner'/>
        <p>)</p>
        <button type='submit'>Go</button>
      </form>

      <form className='function' onSubmit={transferFrom}>
        <p>transferFrom(</p>
        <input placeholder='from' id='from'/>
        <p>,</p>
        <input placeholder='to' id='to'/>
        <p>,</p>
        <input placeholder='tokenId' id='tokenId'/>
        <p>)</p>
        <button type='submit'>Go</button>
      </form>

      <form className='function' onSubmit={tokenOfOwnerByIndex}>
        <p>tokenOfOwnerByIndex(</p>
        <input placeholder='owner' id='owner'/>
        <p>,</p>
        <input placeholder='index' id='index'/>
        <p>)</p>
        <button type='submit'>Go</button>
      </form>

      <div className='function'>
        <p>totalSupply()</p>
        <button onClick={totalSupply}>Go</button>
      </div>

      <form className='function' onSubmit={tokenByIndex}>
        <p>tokenByIndex(</p>
        <input placeholder='index' id='index'/>
        <p>)</p>
        <button type='submit'>Go</button>
      </form>
    </div>
  )
}

export default Inherited