import { BrowserRouter, Routes, Route } from 'react-router'
import Navbar from './components/navbar'
import { ThemeProvider } from './hooks/themeProvider'
import './App.css'
import settingsPage from './pages/settings'

function App() {
  return (
    <>
    <ThemeProvider>
      <Navbar></Navbar>
      <BrowserRouter>
        <Routes>
          <Route path='/settings' Component={settingsPage}></Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
    </>
  )
}



export default App
