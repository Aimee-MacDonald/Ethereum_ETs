import React, { useState, useEffect } from 'react'

const Hybridisation = ({ signerAddress, ethets, ethetsks, krypton }) => {
  const [ tokens, setTokens ] = useState([])

  useEffect(() => {
    if(ethets !== null) {
      ethets.balanceOf(signerAddress)
        .then(result => result.toNumber())
        .then(tokenCount => {
          for(let i = 0; i < tokenCount; i++) {
            ethets.tokenOfOwnerByIndex(signerAddress, i)
              .then(result => {
                const tokenId = result.toNumber()

                ethets.hybridCountOf(tokenId)
                  .then(result => {
                    setTokens(tokens => [...tokens, {
                      tokenId,
                      hybridCount: result.toNumber()
                    }])
                  })
                  .catch(error => console.log(error))
              })
              .catch(error => console.log(error))
          }
        })
        .catch(error => console.log(error))
    }
  }, [])

  const hybridize = e => {
    e.preventDefault()

    if(krypton !== null) {
      const hybridizationCosts = [100, 250, 550, 1150, 1750, 2350, 2950, 3550, 3550, 3550]

      const tokenOneId = parseInt(e.target.tokenOne.value)
      const tokenTwoId = parseInt(e.target.tokenTwo.value)

      const tokenOneCost = hybridizationCosts[tokens.filter(token => token.tokenId === tokenOneId)[0].hybridCount]
      const tokenTwoCost = hybridizationCosts[tokens.filter(token => token.tokenId === tokenTwoId)[0].hybridCount]
      const totalCost = tokenOneCost + tokenTwoCost

      krypton.approve(ethets.address, totalCost)
        .then(transaction => transaction.wait())
        .then(result => {
          if(result.events[0].event === 'Approval') {
            ethets.hybridize(tokenOneId, tokenTwoId)
              .then(transaction => transaction.wait())
              .then(result => console.log(result))
              .catch(error => console.log(error))
          }
        })
    }
  }

  return (
    <div>
      <h1>Hybridisation</h1>
      <p>You do not have any valid ETs</p>

      {tokens.length > 1 && (
        <form onSubmit={hybridize}>
          <p>Select first Token</p>
          <select id='tokenOne'>{tokens.map(token => (<option key={token.tokenId} value={token.tokenId}>{`Token ID: ${token.tokenId}`}</option>))}</select>
          
          <p>Select second Token</p>
          <select id='tokenTwo'>{tokens.map(token => (<option key={token.tokenId} value={token.tokenId}>{`Token ID: ${token.tokenId}`}</option>))}</select>

          <button type='submit'>Hybridize</button>
        </form>
      )}
    </div>
  )
}

export default Hybridisation