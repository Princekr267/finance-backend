import { useState } from 'react'
import Authenticate from './AuthForm/Authenticate.jsx';
import Login from './AuthForm/Login.jsx';

function App() {

  return (
    <>
      <h1>Zorvyn</h1>   
      <p>Zorvyn is a financial management system</p>
      <Authenticate />
    </>
  )
}

export default App
