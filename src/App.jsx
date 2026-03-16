import { BrowserRouter, Routes, Route } from 'react-router'
import Navbar from './components/navbar'
import { ThemeProvider } from './hooks/themeProvider'
import './App.css'
import { lazy, Suspense } from 'react'
import { ReferencePopupProvider } from './hooks/referencePopupProvider'
import { useEffect } from 'react'

const SettingsPage = lazy(() => import("./pages/settings"));
const DashboardPage = lazy(() => import("./pages/dashboard"));
const ArticleEditorPage = lazy(() => import("./pages/articleEditor"));

function App() {
  useEffect(() =>{
    if(!(localStorage.getItem("CurrentProject"))){
      window.location = '/createProject'
    }
  },[])

  return (
    <>
    <ReferencePopupProvider>
      <ThemeProvider>
        <Navbar></Navbar>
        <BrowserRouter>
         <Suspense fallback={<div>Loading...</div>}></Suspense>
          <Routes>
            <Route path='/settings' Component={SettingsPage}></Route>
            <Route path='/dashboard' Component={DashboardPage}></Route>
            <Route path='/article' Component={ArticleEditorPage}></Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ReferencePopupProvider>
    </>
  )
}



export default App
