import React from 'react'
import ReactDOM from 'react-dom'

import 'normalize.css'
import './main.sass'

import Inherited from './Sections/Inherited/Inherited'

const Main = () => (
  <div id='Main'>
    <h1>Ethereum ETs</h1>
    
    <Inherited/>

    <div className='section'>
      <p>mint</p>
      <input/>
      <button>Go</button>
    </div>

    <div className='section'>
      <p>statsOf</p>
      <input/>
      <button>Go</button>
    </div>

    <div className='section'>
      <p>abilityOf</p>
      <input/>
      <button>Go</button>
    </div>
  </div>
)

ReactDOM.render(<Main/>, document.getElementById('root'))








/* 
    owner
    renounceOwnership
    transferOwnership




    supportsInterface



    
    balanceOf
    ownerOf
    safeTransferFrom
    transferFrom
    approve
    getApproved
    setApprovalForAll
    isApprovedForAll

    name
    symbol
    tokenURI

    totalSupply
    tokenOfOwnerByIndex
    tokenByIndex
 */