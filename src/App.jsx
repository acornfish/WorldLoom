import { BrowserRouter, Routes, Route } from 'react-router'
import Navbar from './components/navbar'
import { ThemeProvider } from './hooks/themeProvider'
import './App.css'
import SettingsPage from './pages/settings'
import DashboardPage from './pages/dashboard'

function App() {
  return (
    <>
    <ThemeProvider>
      <Navbar></Navbar>
      <BrowserRouter>
        <Routes>
          <Route path='/settings' Component={SettingsPage}></Route>
          <Route path='/dashboard' Component={DashboardPage}></Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
    </>
  )
}



export default App
