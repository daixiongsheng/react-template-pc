import React, { useState } from 'react'

const HomePage = () => {
  console.log('homePage')
  const [arr] = useState(new Array(3))
  for (let i = 0; i < arr.length; i++) {
    arr[i] = Math.random()
  }
  return (
    <>
      {arr.map((i) => (
        <h1 key={i}>{i}</h1>
      ))}
    </>
  )
}
export default HomePage
