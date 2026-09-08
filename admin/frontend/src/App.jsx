import { useState } from 'react'
import './App.css'
import Gallery from '../components/Gallery'
import Admin from '../app/admin/admin'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      
      <Admin />
    </>
  )
}

export default App
