import React from 'react'

import './Inherited.sass'

const Inherited = () => (
  <div id='Inherited'>
    <h2>Inherited</h2>

    <div className='function'>
      <p>name()</p>
      <button>Go</button>
    </div>

    <div className='function'>
      <p>symbol()</p>
      <button>Go</button>
    </div>

    <div className='function'>
      <p>tokenURI(</p>
      <input placeholder='tokenId'/>
      <p>)</p>
      <button>Go</button>
    </div>

    <div className='function'>
      <p>owner()</p>
      <button>Go</button>
    </div>

    <div className='function'>
      <p>renounceOwnership()</p>
      <button>Go</button>
    </div>

    <div className='function'>
      <p>transferOwnership()</p>
      <input placeholder='to'/>
      <p>)</p>
      <button>Go</button>
    </div>

    <div className='function'>
      <p>balanceOf(</p>
      <input placeholder='owner'/>
      <p>)</p>
      <button>Go</button>
    </div>

    <div className='function'>
      <p>ownerOf(</p>
      <input placeholder='tokenId'/>
      <p>)</p>
      <button>Go</button>
    </div>

    <div className='function'>
      <p>approve(</p>
      <input placeholder='to'/>
      <p>, </p>
      <input placeholder='tokenId'/>
      <p>)</p>
      <button>Go</button>
    </div>

    <div className='function'>
      <p>setApprovalForAll(</p>
      <input placeholder='operator'/>
      <p>,</p>
      <input placeholder='approved'/>
      <p>)</p>
      <button>Go</button>
    </div>

    <div className='function'>
      <p>transferFrom(signers[0].address, signers[1].address, 0)</p>
      <input placeholder='from'/>
      <p>,</p>
      <input placeholder='to'/>
      <p>,</p>
      <input placeholder='tokenId'/>
      <button>Go</button>
    </div>

    <div className='function'>
      <p>tokenOfOwnerByIndex(</p>
      <input placeholder='owner'/>
      <p>,</p>
      <input placeholder='index'/>
      <p>)</p>
      <button>Go</button>
    </div>

    <div className='function'>
      <p>totalSupply()</p>
      <button>Go</button>
    </div>

    <div className='function'>
      <p>tokenByIndex(</p>
      <input placeholder='index'/>
      <p>)</p>
      <button>Go</button>
    </div>
  </div>
)

export default Inherited