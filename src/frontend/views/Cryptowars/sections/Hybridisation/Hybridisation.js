import React, { useState, useEffect } from 'react'

const Hybridisation = ({ signerAddress, ethets, ethetsks, krypton, vrfCoordinatorMock }) => {
  const [ tokens, setTokens ] = useState([])

  const hybridize = e => {
    e.preventDefault()
    const hybridizationCosts = [100, 250, 550, 1150, 1750, 2350, 2950, 3550, 3550, 3550]

    const tokenOneId = parseInt(e.target.tokenOne.value)
    const tokenTwoId = parseInt(e.target.tokenTwo.value)

    const tokenOneCost = hybridizationCosts[tokens.filter(token => token.tokenId === tokenOneId)[0].hybridCount]
    const tokenTwoCost = hybridizationCosts[tokens.filter(token => token.tokenId === tokenTwoId)[0].hybridCount]
    const totalCost = tokenOneCost + tokenTwoCost

    console.log({
      token1: tokenOneCost,
      token2: tokenTwoCost,
      total: totalCost
    })

    if(ethets !== null && krypton !== null) {
      krypton.approve(ethets.address, totalCost)
        .then(transaction => transaction.wait())
        .then(result => {
          if(result.events[0].event === 'Approval') {
            ethets.hybridize(tokenOneId, tokenTwoId)
              .then(transaction => transaction.wait())
              .then(result => result.events[2].data)
              .then(randomnessId => {
                const randomness = Math.floor(Math.random() * 10000000000000000)

                vrfCoordinatorMock.callBackWithRandomness(randomnessId, randomness, ethetsks.address)
                  .then(result => console.log(result))
                  .catch(error => console.log(error))
              })
              .catch(error => console.log(error))
          }
        })
        .catch(error => console.log(error))
    }
  }

  useEffect(() => {
    ethets.balanceOf(signerAddress)
      .then(result => {
        for(let i = 0; i < result.toNumber(); i++) {
          ethets.tokenOfOwnerByIndex(signerAddress, i)
            .then(result => {
              const tokenId = result.toNumber()
              ethets.hybridCountOf(tokenId)
                .then(result => {
                  setTokens(tokens => [...tokens, {
                    tokenId: tokenId,
                    hybridCount: result.toNumber()
                  }])
                })
                .catch(error => console.log(error))
            })
            .catch(error => console.log(error))
        }
      })
      .catch(error => console.log(error))
  }, [])

  return (
    <div>
      <h1>Hybridisation</h1>
      <p>You do not have any valid ETs</p>

      {tokens.length > 1 && (
        <form onSubmit={hybridize}>
          <p>Select first token:</p>
          <select id='tokenOne'>
            {tokens.map(token => (
              <option value={token.tokenId}>{`Token ID: ${token.tokenId}`}</option>
            ))}
          </select>

          <p>Select Second token</p>
          <select id='tokenTwo'>
            {tokens.map(token => (
              <option value={token.tokenId}>{`Token ID: ${token.tokenId}`}</option>
            ))}
          </select>

          <button type='submit'>Hybridize</button>
        </form>
      )}
    </div>
  )
}

export default Hybridisation