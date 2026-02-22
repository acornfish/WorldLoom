import { BrowserRouter, Routes, Route } from 'react-router'
import Navbar from './components/navbar'
import './App.css'

function App() {
  return (
    <>
      <Navbar></Navbar>
      <BrowserRouter>
        <Routes>
          <Route path='/'></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}



export default App
