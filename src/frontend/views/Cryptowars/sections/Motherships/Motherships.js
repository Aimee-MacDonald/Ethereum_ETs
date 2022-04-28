import React from 'react'

const Motherships = ({ krypton, signerAddress }) => {
  const claimKrypton = () => {
    krypton.mint(signerAddress, 10000)
      .then(result => console.log(result))
      .catch(error => console.log(error))
  }

  return (
    <div>
      <h1>Motherships</h1>
      <button onClick={claimKrypton}>Claim Krypton</button>
    </div>
  )
}

export default Motherships