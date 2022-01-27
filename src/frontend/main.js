import React from 'react'
import ReactDOM from 'react-dom'

import 'normalize.css'
import './main.sass'

import Inherited from './Sections/Inherited/Inherited'
import Minting from './Sections/Minting/Minting'
import Querying from './Sections/Querying/Querying'

const Main = () => (
  <div id='Main'>
    <h1>Ethereum ETs</h1>
    
    <Inherited/>
    <Minting/>
    <Querying/>
  </div>
)

ReactDOM.render(<Main/>, document.getElementById('root'))