import React from 'react'

import RandomInterface from '../../contractInterfaces/RandomInterface'

const Random = () => {
  const random = new RandomInterface()

  const randomResult = () => random.randomResult().then(randomResult => console.log(randomResult * 1)).catch(error => console.log(error.data.message))

  const generateRandomNumber = () => {
    random.generateRandomNumber()
      .then(result => console.log(result))
      .catch(error => console.log(error))
  }

  const linkValue = () => {
    random.linkValue()
      .then(lv => console.log(lv * 1))
      .catch(error => console.log(error))
  }

  return (
    <div>
      <h2>Random</h2>

      <div className='function'>
        <p>randomResult()</p>
        <button onClick={randomResult}>Go</button>
      </div>
      
      <div className='function'>
        <p>generateRandomNumber()</p>
        <button onClick={generateRandomNumber}>Go</button>
      </div>

      <div className='function'>
        <p>linkValue()</p>
        <button onClick={linkValue}>Go</button>
      </div>
    </div>
  )
}

export default Random