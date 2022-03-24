import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import 'normalize.css'
import './main.sass'

import Inherited from './Sections/Inherited/Inherited'
import Minting from './Sections/Minting/Minting'
import Information from './Sections/Information/Information'
import Funds from './Sections/Funds/Funds'
import Hybridization from './Sections/Hybridization/Hybridization'

const Main = () => {
  const [ activeSection, setActiveSection ] = useState(0)

  return (
    <div id='Main'>
      <h1>Ethereum ETs</h1>
      <button onClick={() => setActiveSection(1)}>Inherited</button>
      <button onClick={() => setActiveSection(2)}>Minting</button>
      <button onClick={() => setActiveSection(3)}>Information</button>
      <button onClick={() => setActiveSection(5)}>Funds</button>
      <button onClick={() => setActiveSection(6)}>Hybridization</button>

      {activeSection === 1 && <Inherited/>}
      {activeSection === 2 && <Minting/>}
      {activeSection === 3 && <Information/>}
      {activeSection === 5 && <Funds/>}
      {activeSection === 6 && <Hybridization/>}
    </div>
  )
}

ReactDOM.render(<Main/>, document.getElementById('root'))