import React, { useState, useEffect } from 'react'
import Sidekick from './Sidekick/Sidekick'

import './Sidekicks.sass'

const Sidekicks = ({ signerAddress, ethetsks }) => {
  const [ tokens, setTokens ] = useState([])

  useEffect(() => {
    if(ethetsks !== null) {
      ethetsks.balanceOf(signerAddress)
        .then(result => result.toNumber())
        .then(numTokens => {
          if(numTokens > 0) {
            setTokens([])

            for(let i = 0 ; i < numTokens; i++) {
              ethetsks.tokenOfOwnerByIndex(signerAddress, i)
                .then(result => result.toNumber())
                .then(tokenID => setTokens(tokens => [ ...tokens, tokenID ]))
                .catch(error => console.log(error))
            }
          }
        })
        .catch(error => console.log(error))
    }
  }, [])

  return (
    <div id='Sidekicks'>
      {tokens.map(token => <Sidekick ethetsks={ethetsks} tokenId={token}/>)}
    </div>
  )
}

export default Sidekicks