import React from 'react'

import './Navigation.sass'

const Navigation = ({ setActiveView }) => (
  <div id='Navigation'>
    <button onClick={() => setActiveView(0)}>Minting</button>
    <button onClick={() => setActiveView(1)}>Collections</button>
    <button onClick={() => setActiveView(2)}>Hybridisation</button>
    <button onClick={() => setActiveView(3)}>Motherships</button>
    <button onClick={() => setActiveView(4)}>Genesis SK</button>
  </div>
)

export default Navigation